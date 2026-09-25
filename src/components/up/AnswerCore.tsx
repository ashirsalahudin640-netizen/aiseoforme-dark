"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/** A soft round sprite texture for glows and point nodes. */
function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, outer);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function ringPoints(r: number, n = 160) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  return pts;
}

/**
 * Ten links in, one answer out. Ten blue result bars sit in a column beside a
 * wireframe core; as the statement is read they fly in one by one and the core
 * burns orange. `progress` (0–1) comes from the section's scroll.
 */
export function AnswerCore({
  progress,
  className,
}: {
  progress: React.RefObject<number>;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const init = (): (() => void) | void => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(0, 0, 8.6);

      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(o: T) => (
        disposables.push(o),
        o
      );

      const core = new THREE.Group();
      core.position.x = 0.7;
      scene.add(core);

      // Outer geodesic shell and inner orange crystal, drawn as crisp edges.
      const outerGeo = track(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 1)),
      );
      const outer = new THREE.LineSegments(
        outerGeo,
        track(
          new THREE.LineBasicMaterial({
            color: "#c9c6ff",
            transparent: true,
            opacity: 0.55,
          }),
        ),
      );
      core.add(outer);
      const innerGeo = track(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.82, 0)),
      );
      const inner = new THREE.LineSegments(
        innerGeo,
        track(
          new THREE.LineBasicMaterial({
            color: "#ff8a1f",
            transparent: true,
            opacity: 0.9,
          }),
        ),
      );
      core.add(inner);

      // Vertex nodes on the shell.
      const vGeo = track(new THREE.IcosahedronGeometry(1.55, 1));
      const nodeMat = track(
        new THREE.PointsMaterial({
          size: 0.11,
          map: track(
            glowTexture("rgba(255,255,255,1)", "rgba(201,198,255,0.5)"),
          ),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      core.add(new THREE.Points(vGeo, nodeMat));

      // The answer: a small hot core with a glow that grows as links arrive.
      const heart = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.2, 32, 32)),
        track(new THREE.MeshBasicMaterial({ color: "#ffb266" })),
      );
      core.add(heart);
      const glow = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: track(
              glowTexture("rgba(255,160,70,1)", "rgba(255,125,0,0.35)"),
            ),
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      core.add(glow);

      // Three orbit rings, each carrying one travelling node.
      const orbits: {
        group: THREE.Group;
        node: THREE.Sprite;
        r: number;
        speed: number;
      }[] = [];
      const ringMat = track(
        new THREE.LineBasicMaterial({
          color: "#7b77e8",
          transparent: true,
          opacity: 0.45,
        }),
      );
      const nodeTex = track(
        glowTexture("rgba(255,255,255,1)", "rgba(255,125,0,0.6)"),
      );
      [
        [2.05, 1.2, 0.3, 0.55],
        [2.35, -0.9, 0.7, -0.4],
        [1.85, 0.2, -1.1, 0.7],
      ].forEach(([r, rx, ry, speed]) => {
        const g = new THREE.Group();
        g.rotation.set(rx, ry, 0);
        g.add(
          new THREE.LineLoop(
            track(new THREE.BufferGeometry().setFromPoints(ringPoints(r))),
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
        node.scale.setScalar(0.28);
        g.add(node);
        core.add(g);
        orbits.push({ group: g, node, r, speed });
      });

      // Ten blue links: result bars stacked in a column, left of the core.
      const barGeo = track(new THREE.PlaneGeometry(1.25, 0.12));
      const links = Array.from({ length: 10 }, (_, i) => {
        const mat = track(
          new THREE.MeshBasicMaterial({
            color: i === 6 ? "#ff8a1f" : "#5b7cff",
            transparent: true,
            opacity: 0.95,
          }),
        );
        const m = new THREE.Mesh(barGeo, mat);
        const home = new THREE.Vector3(-2.35, 1.62 - i * 0.36, 0.2);
        m.position.copy(home);
        scene.add(m);
        // A thin grey "snippet" line under each title.
        const sub = new THREE.Mesh(
          barGeo,
          track(
            new THREE.MeshBasicMaterial({
              color: "#c9c6ff",
              transparent: true,
              opacity: 0.25,
            }),
          ),
        );
        sub.scale.set(0.8, 0.45, 1);
        sub.position.set(-0.12, -0.11, 0);
        m.add(sub);
        return { m, home, mat };
      });

      // Distant specks for depth.
      const dustN = 260;
      const dust = new Float32Array(dustN * 3);
      for (let i = 0; i < dustN; i++)
        dust.set(
          [
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 7,
            -3 - Math.random() * 4,
          ],
          i * 3,
        );
      const dustGeo = track(new THREE.BufferGeometry());
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
      scene.add(
        new THREE.Points(
          dustGeo,
          track(
            new THREE.PointsMaterial({
              color: "#8f8bff",
              size: 0.03,
              transparent: true,
              opacity: 0.6,
              depthWrite: false,
            }),
          ),
        ),
      );

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const fit = Math.min(1, camera.aspect / 1.15);
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
        { rootMargin: "100px" },
      );
      io.observe(el);

      let p = 0;
      const v = new THREE.Vector3();
      const tick = (time: number) => {
        if (!visible) return;
        const t = reduce ? 0 : time;
        p += ((progress.current ?? 0) - p) * 0.1;
        outer.rotation.set(t * 0.12, t * 0.18, 0);
        inner.rotation.set(-t * 0.3, -t * 0.22, t * 0.1);
        core.rotation.x += (pointer.y * 0.25 - core.rotation.x) * 0.05;
        core.rotation.y += (pointer.x * 0.35 - core.rotation.y) * 0.05;
        orbits.forEach((o, i) => {
          const a = t * o.speed + i * 2;
          o.node.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
        });

        // Each link leaves on its own beat, arcs in and disappears into the core.
        links.forEach((l, i) => {
          const start = i * 0.07;
          const k = gsap.utils.clamp(0, 1, (p - start) / 0.28);
          const e = k * k * (3 - 2 * k);
          v.copy(core.position);
          l.m.position.lerpVectors(l.home, v, e);
          l.m.position.y += Math.sin(e * Math.PI) * 0.5;
          l.m.scale.setScalar(1 - e * 0.85);
          l.m.rotation.z = -e * 1.2;
          l.mat.opacity = 0.95 * (1 - gsap.utils.clamp(0, 1, (e - 0.8) / 0.2));
          l.m.visible = e < 0.999;
        });

        const heat = gsap.utils.clamp(0, 1, p);
        const pulse = reduce ? 1 : 1 + Math.sin(time * 3) * 0.04;
        heart.scale.setScalar((0.8 + heat * 1.1) * pulse);
        glow.scale.setScalar((1.2 + heat * 3.2) * pulse);
        (glow.material as THREE.SpriteMaterial).opacity = 0.35 + heat * 0.65;
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
  }, [progress]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
