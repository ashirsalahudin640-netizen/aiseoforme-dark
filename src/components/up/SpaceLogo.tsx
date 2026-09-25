"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "@/lib/gsap";
import { LOGO_PATHS } from "@/lib/logo";

function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.3, outer);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * The AIB mark as a solid object in space: extruded from the official paths,
 * glossy navy and orange with crisp edge lines, circled by an accretion disk
 * of particles and two orbit rings, in a slow starfield.
 */
export function SpaceLogo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const init = (): (() => void) | void => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const small = window.innerWidth < 768;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0.4, 11);

      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(o: T) => (
        disposables.push(o),
        o
      );

      // Extrude the mark from its SVG paths.
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 433 198">
      <path id="base" d="${LOGO_PATHS.base}"/><path id="arc" d="${LOGO_PATHS.arc}"/>
      <path id="stem" d="${LOGO_PATHS.stem}"/><path id="dot" d="${LOGO_PATHS.dot}"/></svg>`;
      const data = new SVGLoader().parse(svg);
      const navyMat = track(
        new THREE.MeshPhysicalMaterial({
          color: "#2a24b3",
          metalness: 0.6,
          roughness: 0.22,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          emissive: "#0b076e",
          emissiveIntensity: 0.5,
        }),
      );
      const orangeMat = track(
        new THREE.MeshPhysicalMaterial({
          color: "#ff6a00",
          metalness: 0.15,
          roughness: 0.3,
          clearcoat: 0.6,
          envMapIntensity: 0.3,
          // Filmic tone mapping desaturates this orange towards peach; keep the brand colour.
          toneMapped: false,
          emissive: "#e05200",
          emissiveIntensity: 0.28,
        }),
      );
      const edgeMat = track(
        new THREE.LineBasicMaterial({
          color: "#e4e2ff",
          transparent: true,
          opacity: 0.55,
        }),
      );
      const logo = new THREE.Group();
      data.paths.forEach((path) => {
        const id = (path.userData?.node as Element | undefined)?.getAttribute(
          "id",
        );
        const mat = id === "base" ? navyMat : orangeMat;
        SVGLoader.createShapes(path).forEach((shape) => {
          const geo = track(
            new THREE.ExtrudeGeometry(shape, {
              depth: 34,
              bevelEnabled: true,
              bevelThickness: 4,
              bevelSize: 2.5,
              bevelSegments: 2,
              curveSegments: 20,
            }),
          );
          const mesh = new THREE.Mesh(geo, mat);
          logo.add(mesh);
          const edges = new THREE.LineSegments(
            track(new THREE.EdgesGeometry(geo, 28)),
            edgeMat,
          );
          logo.add(edges);
        });
      });
      // SVG space is y-down and in pixels: flip, centre, scale to world units.
      logo.scale.set(0.012, -0.012, 0.012);
      const box = new THREE.Box3().setFromObject(logo);
      const centre = box.getCenter(new THREE.Vector3());
      logo.position.sub(centre);
      const pivot = new THREE.Group();
      pivot.add(logo);
      scene.add(pivot);

      const key = new THREE.DirectionalLight("#ffffff", 1.1);
      key.position.set(3, 4, 6);
      scene.add(key);
      const rimOrange = new THREE.PointLight("#ff7d00", 30, 20);
      rimOrange.position.set(-4, -2, 3);
      scene.add(rimOrange);
      const rimBlue = new THREE.PointLight("#7b77e8", 40, 20);
      rimBlue.position.set(4, 2, -3);
      scene.add(rimBlue);

      // Accretion disk: particles on a tilted, gently turning ring.
      const diskN = small ? 1800 : 4200;
      const disk = new Float32Array(diskN * 3);
      const diskCol = new Float32Array(diskN * 3);
      const cA = new THREE.Color("#c9c6ff");
      const cB = new THREE.Color("#ff8a1f");
      for (let i = 0; i < diskN; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 3.2 + Math.pow(Math.random(), 1.6) * 2.4;
        disk.set(
          [Math.cos(a) * r, (Math.random() - 0.5) * 0.08, Math.sin(a) * r],
          i * 3,
        );
        const c = Math.random() < 0.18 ? cB : cA;
        diskCol.set([c.r, c.g, c.b], i * 3);
      }
      const diskGeo = track(new THREE.BufferGeometry());
      diskGeo.setAttribute("position", new THREE.BufferAttribute(disk, 3));
      diskGeo.setAttribute("color", new THREE.BufferAttribute(diskCol, 3));
      const dot = track(
        glowTexture("rgba(255,255,255,1)", "rgba(255,255,255,0.35)"),
      );
      const diskPts = new THREE.Points(
        diskGeo,
        track(
          new THREE.PointsMaterial({
            size: 0.085,
            map: dot,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      const diskGroup = new THREE.Group();
      diskGroup.rotation.set(1.22, 0, 0.18);
      diskGroup.add(diskPts);
      scene.add(diskGroup);

      // Two orbit rings with travelling nodes.
      const ringMat = track(
        new THREE.MeshBasicMaterial({
          color: "#7b77e8",
          transparent: true,
          opacity: 0.5,
        }),
      );
      const nodeTex = track(
        glowTexture("rgba(255,255,255,1)", "rgba(255,125,0,0.7)"),
      );
      const rings = [
        { r: 4.3, rot: [1.05, 0.35, 0], speed: 0.35 },
        { r: 3.6, rot: [1.6, -0.6, 0.4], speed: -0.5 },
      ].map(({ r, rot, speed }) => {
        const g = new THREE.Group();
        g.rotation.set(rot[0], rot[1], rot[2]);
        g.add(
          new THREE.Mesh(
            track(new THREE.TorusGeometry(r, 0.007, 6, 180)),
            ringMat,
          ),
        );
        const node = new THREE.Sprite(
          track(
            new THREE.SpriteMaterial({
              map: nodeTex,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            }),
          ),
        );
        node.scale.setScalar(0.45);
        g.add(node);
        scene.add(g);
        return { g, node, r, speed };
      });

      // Nebula glows and a starfield.
      const nebula = (color: string, x: number, y: number, s: number) => {
        const sp = new THREE.Sprite(
          track(
            new THREE.SpriteMaterial({
              map: track(
                glowTexture(color, color.replace(/[\d.]+\)$/, "0.12)")),
              ),
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              opacity: 0.55,
            }),
          ),
        );
        sp.position.set(x, y, -8);
        sp.scale.setScalar(s);
        scene.add(sp);
      };
      nebula("rgba(59,54,201,0.9)", -5, 1, 16);
      nebula("rgba(255,125,0,0.55)", 5, -2, 12);
      const starN = small ? 900 : 2200;
      const stars = new Float32Array(starN * 3);
      for (let i = 0; i < starN; i++)
        stars.set(
          [
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 34,
            -6 - Math.random() * 30,
          ],
          i * 3,
        );
      const starGeo = track(new THREE.BufferGeometry());
      starGeo.setAttribute("position", new THREE.BufferAttribute(stars, 3));
      const starPts = new THREE.Points(
        starGeo,
        track(
          new THREE.PointsMaterial({
            size: 0.09,
            map: dot,
            color: "#dcdaff",
            transparent: true,
            depthWrite: false,
          }),
        ),
      );
      scene.add(starPts);

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const fit = Math.min(1, camera.aspect / 1.5);
        scene.scale.setScalar(fit);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const pointer = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = false;
      const io = new IntersectionObserver(
        ([e]) => (visible = e.isIntersecting),
        { rootMargin: "150px" },
      );
      io.observe(el);

      const tick = (time: number) => {
        if (!visible) return;
        const t = reduce ? 0 : time;
        pivot.rotation.y +=
          (pointer.x * 0.45 + Math.sin(t * 0.3) * 0.18 - pivot.rotation.y) *
          0.05;
        pivot.rotation.x += (pointer.y * 0.25 - pivot.rotation.x) * 0.05;
        pivot.position.y = Math.sin(t * 0.8) * 0.12;
        diskPts.rotation.y = t * 0.08;
        rings.forEach((r, i) => {
          const a = t * r.speed + i * 2.4;
          r.node.position.set(Math.cos(a) * r.r, Math.sin(a) * r.r, 0);
        });
        starPts.rotation.z = t * 0.004;
        renderer.render(scene, camera);
      };
      gsap.ticker.add(tick);
      visible = true;
      tick(0);
      visible = false;

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        ro.disconnect();
        io.disconnect();
        disposables.forEach((d) => d.dispose());
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };
    // Build only when the section is close, so the page itself loads light.
    let stop: (() => void) | void;
    const gate = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gate.disconnect();
          stop = init();
        }
      },
      { rootMargin: "900px 0px" },
    );
    gate.observe(el);
    return () => {
      gate.disconnect();
      stop?.();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
