"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { store } from "@/lib/store";
import { coreFragment, coreVertex, pointsFragment, pointsVertex } from "./shaders";

const ORANGE = new THREE.Color("#ff5b14");
const DEEP = new THREE.Color("#d23c06");
const EMBER = new THREE.Color("#ffa066");
const PEARL = new THREE.Color("#f2f3f5");
const INK = new THREE.Color("#2a2c33");

/** The row the brand sits on in the "ten blue links" chapter. */
const BRAND_ROW = 6;

function buildParticles(count: number) {
  const orbit = new Float32Array(count * 3);
  const list = new Float32Array(count * 3);
  const answer = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const mark = new Float32Array(count);
  const rowWidths = [2.9, 2.3, 2.7, 2.0, 2.5, 2.2, 2.8, 2.1, 2.6, 1.9];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const s = Math.random();
    seed[i] = s;

    // Orbit: a wide, uneven disc of queries circling the core.
    const r = 1.55 + Math.pow(Math.random(), 1.6) * 1.9;
    orbit[i * 3] = r;
    orbit[i * 3 + 1] = Math.random() * Math.PI * 2;
    orbit[i * 3 + 2] = (Math.random() - 0.5) * 0.35 * (r / 2);

    // List: ten rows, each a title bar with a thinner snippet line under it.
    const row = i % 10;
    const y = 1.8 - row * 0.4;
    const w = rowWidths[row];
    const isTitle = Math.random() < 0.62;
    const x0 = -1.5;
    list[i * 3] = x0 + Math.random() * (isTitle ? w : w * 0.82);
    list[i * 3 + 1] = (isTitle ? y : y - 0.13) + (Math.random() - 0.5) * (isTitle ? 0.06 : 0.025);
    list[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    mark[i] = row === BRAND_ROW ? 1 : 0;

    // Answer: an even shell around the core (Fibonacci sphere with a little depth).
    const t = (i + 0.5) / count;
    const inc = Math.acos(1 - 2 * t);
    const az = golden * i;
    const rr = 1.28 + (Math.random() - 0.5) * 0.08;
    answer[i * 3] = Math.sin(inc) * Math.cos(az) * rr;
    answer[i * 3 + 1] = Math.cos(inc) * rr;
    answer[i * 3 + 2] = Math.sin(inc) * Math.sin(az) * rr;
  }

  const geo = new THREE.BufferGeometry();
  // position is required by three for bounds; the shader ignores it.
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute("aOrbit", new THREE.BufferAttribute(orbit, 3));
  geo.setAttribute("aList", new THREE.BufferAttribute(list, 3));
  geo.setAttribute("aAnswer", new THREE.BufferAttribute(answer, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geo.setAttribute("aMark", new THREE.BufferAttribute(mark, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
  return geo;
}

const damp = (a: number, b: number, lambda: number, dt: number) =>
  a + (b - a) * (1 - Math.exp(-lambda * dt));

function World() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const low = store.tier === "low";

  const geometry = useMemo(() => buildParticles(low ? 3200 : 7000), [low]);
  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(1, low ? 24 : 48), [low]);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uDeep: { value: DEEP },
      uOrange: { value: ORANGE },
      uEmber: { value: EMBER },
      uPearl: { value: PEARL },
    }),
    [],
  );
  const pointUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uList: { value: 0 },
      uAnswer: { value: 0 },
      uSize: { value: 11 },
      uPixel: { value: 1 },
      uInk: { value: INK },
      uOrange: { value: ORANGE },
    }),
    [],
  );

  useEffect(() => () => {
    geometry.dispose();
    coreGeo.dispose();
  }, [geometry, coreGeo]);

  // Eased copies of the scroll targets: scroll stays instant, the scene glides.
  const cur = useRef({ hero: 0, list: 0, answer: 0, px: 0, py: 0, amp: 1 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const c = cur.current;
    const s = store.scene;
    const t = state.clock.elapsedTime;
    const mobile = size.width < 768;

    c.hero = damp(c.hero, s.hero, 7, dt);
    c.list = damp(c.list, s.list, 5, dt);
    c.answer = damp(c.answer, s.answer, 5, dt);
    c.px = damp(c.px, store.pointer.x, 3, dt);
    c.py = damp(c.py, store.pointer.y, 3, dt);
    const vel = Math.min(Math.abs(store.scrollVelocity) * 0.015, 0.6);
    c.amp = damp(c.amp, 1 + vel, 4, dt);

    coreUniforms.uTime.value = t;
    coreUniforms.uAmp.value = c.amp;
    pointUniforms.uTime.value = t;
    pointUniforms.uList.value = c.list;
    pointUniforms.uAnswer.value = c.answer;
    pointUniforms.uPixel.value = dpr * (size.height / 900);

    const g = group.current;
    if (g) {
      const story = Math.max(c.list, c.answer);
      // Desktop: the core sits right of the headline; mobile: above the copy.
      const heroX = mobile ? 0 : 1.75;
      const heroY = mobile ? 1.15 : 0.05;
      const storyX = mobile ? 0 : 1.55;
      const storyY = mobile ? 1.05 : 0;
      g.position.x = THREE.MathUtils.lerp(heroX, storyX, story);
      g.position.y = THREE.MathUtils.lerp(heroY + c.hero * 0.5, storyY, story);
      const baseScale = mobile ? 0.62 : 1;
      g.scale.setScalar(baseScale * (1 - c.hero * 0.12 * (1 - story)));

      // The list faces the reader; everything else leans toward the pointer.
      const lean = 1 - c.list * (1 - c.answer);
      g.rotation.y = c.px * 0.28 * lean + (1 - lean) * 0.0;
      g.rotation.x = -c.py * 0.16 * lean;
      g.rotation.z = c.hero * -0.12 * lean;
    }
    const m = core.current;
    if (m) {
      // The core sets while the list is on screen, then rises inside the answer.
      const coreScale = THREE.MathUtils.lerp(1, 0.08, c.list * (1 - c.answer)) * (1 - c.answer * 0.28);
      m.scale.setScalar(Math.max(coreScale, 0.0001));
      m.rotation.y = t * 0.12;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={core} geometry={coreGeo}>
        <shaderMaterial vertexShader={coreVertex} fragmentShader={coreFragment} uniforms={coreUniforms} />
      </mesh>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/** Stops the render loop when the scene is hidden or the tab is in the background. */
function FrameGate() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    let running = true;
    const check = () => {
      const on = store.scene.active && !document.hidden;
      if (on !== running) {
        running = on;
        setFrameloop(on ? "always" : "never");
      }
    };
    gsap.ticker.add(check);
    document.addEventListener("visibilitychange", check);
    return () => {
      gsap.ticker.remove(check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [setFrameloop]);
  return null;
}

export default function Scene({ onReady }: { onReady?: () => void }) {
  const high = store.tier === "high";
  return (
    <Canvas
      dpr={[1, high ? 1.75 : 1.25]}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={() => onReady?.()}
    >
      <FrameGate />
      <World />
    </Canvas>
  );
}
