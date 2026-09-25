"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { LOGO_PATHS } from "@/lib/logo";

/**
 * A field of nano-particles that holds one shape per chapter of the story:
 * the AIB mark, a nano-sphere, an orbit, a graphene sheet, a double helix,
 * then the mark again. Each particle leaves on its own delay, so a change of
 * shape reads as a swarm re-assembling rather than a crossfade.
 */

const VERT = /* glsl */ `
  attribute vec3 aS0;
  attribute vec3 aS1;
  attribute vec3 aS2;
  attribute vec3 aS3;
  attribute vec3 aS4;
  attribute vec3 aG;
  attribute vec3 aColor;
  attribute float aRand;
  uniform float uState;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixel;
  uniform vec3 uMouse;
  uniform float uMouseStr;
  uniform float uIntro;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 pick(float i) {
    if (i < 0.5) return aS0;
    if (i < 1.5) return aS1;
    if (i < 2.5) return aS2;
    if (i < 3.5) return aS3;
    if (i < 4.5) return aS4;
    return aS0;
  }

  void main() {
    float i0 = floor(uState);
    float f = uState - i0;
    float d = aRand * 0.4;
    float t = smoothstep(d, d + 0.6, f);
    vec3 p = mix(pick(i0), pick(i0 + 1.0), t);
    // Particles bow outward mid-flight instead of travelling in straight lines.
    p += normalize(p + vec3(0.0001)) * sin(t * 3.14159) * (0.35 + aRand * 0.7);
    // Before the answer: the same particles are a turning galaxy, the web at large.
    float ga = aG.y + uTime * (0.16 + 0.42 / (0.7 + aG.x));
    vec3 g = vec3(cos(ga) * aG.x, aG.z, sin(ga) * aG.x);
    g = vec3(g.x, g.y * 0.41 - g.z * 0.91, g.y * 0.91 + g.z * 0.41);
    float di = aRand * 0.45;
    float it = smoothstep(di, di + 0.55, uIntro);
    p = mix(g, p, it) + normalize(p - g + vec3(0.0001)) * sin(it * 3.14159) * 0.45;
    p += 0.03 * vec3(
      sin(uTime * 0.9 + aRand * 40.0),
      cos(uTime * 0.7 + aRand * 31.0),
      sin(uTime * 0.6 + aRand * 17.0)
    );
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec2 dm = world.xy - uMouse.xy;
    float dist = length(dm);
    world.xy += normalize(dm + vec2(0.0001)) * uMouseStr * smoothstep(1.2, 0.0, dist) * 0.5;
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixel * (0.55 + aRand * 0.9) * (9.0 / -mv.z);
    vColor = aColor;
    vAlpha = 0.8 + 0.2 * sin(uTime * 1.6 + aRand * 60.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    // A crisp disc with a thin rim of glow: sharp at any size, no smeared halo.
    if (r > 0.5) discard;
    float disc = 1.0 - smoothstep(0.3, 0.36, r);
    float rim = (1.0 - smoothstep(0.36, 0.5, r)) * 0.18;
    gl_FragColor = vec4(vColor * (1.0 + disc * 0.35), (disc + rim) * vAlpha);
  }
`;

const LAVENDER = new THREE.Color("#c9c6ff");
const WHITE = new THREE.Color("#ffffff");
const ORANGE = new THREE.Color("#ff8a1f");
const PERI = new THREE.Color("#7b77e8");

/** Samples the official mark into `n` points; orange parts stay orange. */
function sampleLogo(n: number) {
  const W = 433;
  const H = 198;
  const k = 3;
  const c = document.createElement("canvas");
  c.width = W * k;
  c.height = H * k;
  const g = c.getContext("2d");
  const pts: { x: number; y: number; accent: boolean }[] = [];
  if (!g) return pts;
  g.scale(k, k);
  g.fillStyle = "#ff0000";
  g.fill(new Path2D(LOGO_PATHS.base));
  g.fillStyle = "#00ff00";
  g.fill(new Path2D(LOGO_PATHS.arc));
  g.fill(new Path2D(LOGO_PATHS.stem));
  g.fill(new Path2D(LOGO_PATHS.dot));
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const filled: number[] = [];
  for (let i = 0; i < data.length; i += 4 * 2) {
    if (data[i + 3] > 128) filled.push(i / 4);
  }
  const scale = 4.6 / c.width;
  for (let j = 0; j < n; j++) {
    const idx = filled[(Math.random() * filled.length) | 0];
    const px = idx % c.width;
    const py = (idx / c.width) | 0;
    const o = idx * 4;
    pts.push({
      x: (px - c.width / 2) * scale,
      y: -(py - c.height / 2) * scale,
      accent: data[o + 1] > data[o],
    });
  }
  return pts;
}

const put = (a: Float32Array, i: number, x: number, y: number, z: number) => {
  a[i * 3] = x;
  a[i * 3 + 1] = y;
  a[i * 3 + 2] = z;
};

function buildShapes(n: number) {
  const s0 = new Float32Array(n * 3);
  const s1 = new Float32Array(n * 3);
  const s2 = new Float32Array(n * 3);
  const s3 = new Float32Array(n * 3);
  const s4 = new Float32Array(n * 3);
  const gal = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const rnd = new Float32Array(n);
  const logo = sampleLogo(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tilt = new THREE.Euler(0.95, 0.25, 0);
  const inner = new THREE.Euler(-0.5, 0.9, 0.4);
  const sheet = new THREE.Euler(-0.7, 0.25, 0);
  const lean = new THREE.Euler(0, 0, -0.35);
  const v = new THREE.Vector3();

  // Graphene: points along the edges of a honeycomb, gently rippled.
  const hexR = 0.36;
  const edges: [number, number, number, number][] = [];
  for (let q = -7; q <= 7; q++) {
    for (let r = -5; r <= 5; r++) {
      const cx = q * hexR * 1.5;
      const cy = (r + (q % 2 ? 0.5 : 0)) * hexR * Math.sqrt(3);
      if (Math.hypot(cx * 0.8, cy) > 2.6) continue;
      for (let e = 0; e < 3; e++) {
        const a1 = (Math.PI / 3) * e;
        const a2 = (Math.PI / 3) * (e + 1);
        edges.push([cx + hexR * Math.cos(a1), cy + hexR * Math.sin(a1), cx + hexR * Math.cos(a2), cy + hexR * Math.sin(a2)]);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const r = Math.random();
    rnd[i] = r;
    const L = logo[i] ?? { x: 0, y: 0, accent: false };
    put(s0, i, L.x, L.y, (Math.random() - 0.5) * 0.12);

    // Nano-sphere
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const R = 1.75 + (Math.random() - 0.5) * 0.08;
    put(s1, i, Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R);

    // Orbit: a main ring and a thinner crossing one
    const a = Math.random() * Math.PI * 2;
    if (i % 4 === 0) {
      v.set(Math.cos(a) * 1.25, Math.sin(a) * 1.25, (Math.random() - 0.5) * 0.06).applyEuler(inner);
    } else {
      const minor = 0.28 * Math.sqrt(Math.random());
      const b = Math.random() * Math.PI * 2;
      v.set((2 + minor * Math.cos(b)) * Math.cos(a), (2 + minor * Math.cos(b)) * Math.sin(a), minor * Math.sin(b)).applyEuler(tilt);
    }
    put(s2, i, v.x, v.y, v.z);

    // Graphene sheet
    const e = edges[(Math.random() * edges.length) | 0];
    const u = Math.random();
    const gx = e[0] + (e[2] - e[0]) * u;
    const gy = e[1] + (e[3] - e[1]) * u;
    v.set(gx, gy, 0.35 * Math.sin(gx * 1.3) * Math.cos(gy * 1.5)).applyEuler(sheet);
    put(s3, i, v.x, v.y, v.z);

    // Double helix with rungs
    const h = Math.random();
    const ang = h * Math.PI * 5;
    const hy = (h - 0.5) * 4.2;
    if (i % 6 === 0) {
      const w = Math.random() * 2 - 1;
      v.set(Math.cos(ang) * 0.85 * w, hy, Math.sin(ang) * 0.85 * w);
    } else {
      const strand = i % 2 ? 0 : Math.PI;
      v.set(
        Math.cos(ang + strand) * 0.85 + (Math.random() - 0.5) * 0.08,
        hy,
        Math.sin(ang + strand) * 0.85 + (Math.random() - 0.5) * 0.08,
      );
    }
    v.applyEuler(lean);
    put(s4, i, v.x, v.y, v.z);

    // Galaxy: three spiral arms, thicker at the core. Stored as radius, angle, height.
    const gr = 0.25 + Math.pow(Math.random(), 0.65) * 3.6;
    const arm = (i % 3) * ((Math.PI * 2) / 3);
    const ga = arm + gr * 1.35 + (Math.random() - 0.5) * (0.55 + 0.25 / gr);
    const gh = (Math.random() + Math.random() - 1) * 0.28 * (1.2 - gr / 3.85);
    gal[i * 3] = gr;
    gal[i * 3 + 1] = ga;
    gal[i * 3 + 2] = gh;

    const c = L.accent ? ORANGE : r < 0.12 ? PERI : r < 0.2 ? WHITE : LAVENDER;
    put(col, i, c.r, c.g, c.b);
  }
  return { s0, s1, s2, s3, s4, gal, col, rnd };
}

type Props = {
  /** Target shape, 0-5, written by the scroll story. Read every frame. */
  state: React.RefObject<number>;
  /** 0 = galaxy, 1 = the answer has formed. Tweened by the hero, read every frame. */
  intro: React.RefObject<number>;
  className?: string;
};

export const NANO_READY = "nano:ready";

export function NanoField({ state, intro, className }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const n = small ? 8000 : 18000;
    let cleanup = () => {};
    let cancelled = false;

    // Build after the first paint so the page (and the intro) can render first.
    const boot = () => {
      if (cancelled) return;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        window.dispatchEvent(new Event(NANO_READY));
        return;
      }
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 900ms ease";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.set(0, 0, 9);

      const { s0, s1, s2, s3, s4, gal, col, rnd } = buildShapes(n);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(s0.slice(), 3));
      geo.setAttribute("aS0", new THREE.BufferAttribute(s0, 3));
      geo.setAttribute("aS1", new THREE.BufferAttribute(s1, 3));
      geo.setAttribute("aS2", new THREE.BufferAttribute(s2, 3));
      geo.setAttribute("aS3", new THREE.BufferAttribute(s3, 3));
      geo.setAttribute("aS4", new THREE.BufferAttribute(s4, 3));
      geo.setAttribute("aG", new THREE.BufferAttribute(gal, 3));
      geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

      const uniforms = {
        uState: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: small ? 3.4 : 3.6 },
        uPixel: { value: dpr },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uMouseStr: { value: 0 },
        uIntro: { value: reduce ? 1 : (intro.current ?? 0) },
      };
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      const group = new THREE.Group();
      group.add(points);
      scene.add(group);

      const dustN = small ? 500 : 1400;
      const dust = new Float32Array(dustN * 3);
      for (let i = 0; i < dustN; i++) put(dust, i, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 12, -2 - Math.random() * 10);
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
      const dustMat = new THREE.PointsMaterial({
        color: "#8f8bff",
        size: 0.025,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const dustPts = new THREE.Points(dustGeo, dustMat);
      scene.add(dustPts);

      let halfW = 1;
      let halfH = 1;
      let wide = true;
      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        halfW = halfH * camera.aspect;
        wide = w >= 1024;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const pointer = { x: 0, y: 0, active: 0 };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        pointer.active = 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      // Where the object sits: centre stage for the opening, aside for the chapters.
      const layout = (side: number) => ({
        x: wide ? halfW * 0.42 * side : 0,
        y: wide ? halfH * 0.1 * (1 - side) + 0.1 * side : halfH * (0.14 + 0.14 * side),
        s: wide ? 0.88 + 0.12 * side : Math.min(0.56, (halfW * 2) / 6.4),
      });

      let current = state.current ?? 0;
      let tiltX = 0;
      let tiltY = 0;
      let spin = 0;
      const TAU = Math.PI * 2;
      const tick = (time: number) => {
        if (!visible) return;
        const target = state.current ?? 0;
        current += (target - current) * (reduce ? 1 : 0.075);
        uniforms.uState.value = current;
        uniforms.uIntro.value = reduce ? 1 : (intro.current ?? 1);
        uniforms.uTime.value = reduce ? 0 : time;
        uniforms.uMouse.value.set(pointer.x * halfW, pointer.y * halfH, 0);
        pointer.active *= 0.97;
        uniforms.uMouseStr.value += (pointer.active - uniforms.uMouseStr.value) * 0.08;

        const L = layout(Math.max(Math.min(1, Math.max(0, current)), uniforms.uIntro.value));
        group.position.x += (L.x - group.position.x) * 0.08;
        group.position.y += (L.y - group.position.y) * 0.08;
        group.scale.setScalar(group.scale.x + (L.s - group.scale.x) * 0.08);

        const facing = Math.min(1, Math.abs(current - Math.round(current / 5) * 5));
        tiltY += (pointer.x * 0.25 - tiltY) * 0.05;
        tiltX += (-pointer.y * 0.15 - tiltX) * 0.05;
        if (!reduce) {
          spin += 0.0035 * facing;
          // Near the logo, settle on the nearest full turn so the mark reads head-on.
          if (facing < 0.3) spin += (Math.round(spin / TAU) * TAU - spin) * 0.06;
        }
        group.rotation.y = tiltY + spin;
        group.rotation.x = tiltX;
        dustPts.rotation.y = time * 0.01;
        renderer.render(scene, camera);
      };

      // Snap to the first layout and compile shaders up front, so the first frame is final.
      const L0 = layout(Math.min(1, Math.max(0, current)));
      group.position.set(L0.x, L0.y, 0);
      group.scale.setScalar(L0.s);
      renderer.compile(scene, camera);
      tick(0);
      gsap.ticker.add(tick);
      requestAnimationFrame(() => {
        renderer.domElement.style.opacity = "1";
        window.dispatchEvent(new Event(NANO_READY));
      });

      cleanup = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        ro.disconnect();
        io.disconnect();
        geo.dispose();
        mat.dispose();
        dustGeo.dispose();
        dustMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const raf = requestAnimationFrame(() => requestAnimationFrame(boot));
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [state, intro]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
