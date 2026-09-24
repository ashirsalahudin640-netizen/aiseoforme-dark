"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, Group, MathUtils, type Mesh } from "three";
import { store } from "@/lib/store";

/** Soft round gradient used for the coloured lights behind the prism. */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new CanvasTexture(c);
  }, []);
}

/** A horizontal band of spectrum light, like the beam leaving a real prism. */
function useSpectrumTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 64);
    ["#ff3b30", "#ff7d00", "#ffd60a", "#34c759", "#0a84ff", "#0b076e", "#5e5ce6"].forEach((col, i, a) =>
      grad.addColorStop(i / (a.length - 1), col),
    );
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 64);
    // Fade the beam in from the prism and out towards the edge.
    const fade = g.createLinearGradient(0, 0, 512, 0);
    fade.addColorStop(0, "rgba(0,0,0,1)");
    fade.addColorStop(0.12, "rgba(0,0,0,0)");
    fade.addColorStop(0.7, "rgba(0,0,0,0)");
    fade.addColorStop(1, "rgba(0,0,0,1)");
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = fade;
    g.fillRect(0, 0, 512, 64);
    return new CanvasTexture(c);
  }, []);
}

function Prism() {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const low = store.tier === "low";
  const { viewport } = useThree();
  const scale = Math.min(1, Math.max(0.58, viewport.width / 12.5));
  // Sit above the hero's lower copy row on wide screens; centred up top on phones.
  const baseY = viewport.width > 7 ? 0.75 : 1.1;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = store.heroProgress;
    // Everything eases toward its target, so scroll and pointer never snap.
    const k = 1 - Math.exp(-4 * Math.min(dt, 1 / 30));
    const reduced = store.reduced;
    const targetY = (reduced ? 0 : t * 0.18) + store.pointer.x * 0.5 + p * 1.6;
    const targetX = 0.35 - store.pointer.y * 0.25 + p * 0.5;
    g.rotation.y = MathUtils.lerp(g.rotation.y, targetY, k);
    g.rotation.x = MathUtils.lerp(g.rotation.x, targetX, k);
    g.position.y = MathUtils.lerp(g.position.y, baseY + p * 1.4, k);
    const s = scale * (1 - p * 0.25);
    g.scale.setScalar(MathUtils.lerp(g.scale.x, s, k));
  });

  return (
    <group ref={group} position={[viewport.width > 7 ? viewport.width * 0.22 : 0, 0.75, 0]} rotation={[0.35, 0.4, 0]}>
      <Float speed={store.reduced ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        {/* A triangular prism: the brand's idea of light becoming an answer */}
        <mesh ref={mesh} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.25, 1.25, 3.4, 3, 1]} />
          {low ? (
            <meshPhysicalMaterial
              transmission={1}
              thickness={1.2}
              roughness={0.05}
              ior={1.5}
              clearcoat={1}
              color="#ffd8b0"
              attenuationColor="#ff7d00"
              attenuationDistance={3}
            />
          ) : (
            <MeshTransmissionMaterial
              samples={6}
              resolution={512}
              thickness={1.4}
              roughness={0.04}
              ior={1.52}
              chromaticAberration={0.9}
              anisotropy={0.25}
              distortion={0.18}
              distortionScale={0.4}
              temporalDistortion={0.08}
              backside
              backsideThickness={0.6}
              color="#fff1e2"
              attenuationColor="#ff7d00"
              attenuationDistance={3.2}
            />
          )}
        </mesh>
      </Float>
    </group>
  );
}

// Faceted orange crystals drifting around the prism, in the logo's orange.
const GEMS = [
  { pos: [-1.3, 2.3, 0.6], s: 0.5, speed: 0.5, shape: "oct" },
  { pos: [2.5, -1.7, 0.9], s: 0.62, speed: 0.4, shape: "ico" },
  { pos: [-0.9, -2.1, -0.4], s: 0.34, speed: 0.7, shape: "oct" },
  { pos: [2.9, 1.9, -0.8], s: 0.38, speed: 0.6, shape: "ico" },
  { pos: [0.3, 2.7, -0.2], s: 0.26, speed: 0.8, shape: "oct" },
] as const;

function Crystals() {
  const group = useRef<Group>(null);
  const low = store.tier === "low";
  const { viewport } = useThree();
  const cx = viewport.width > 7 ? viewport.width * 0.22 : 0;
  const scale = Math.min(1, Math.max(0.55, viewport.width / 12.5));
  const gems = low ? GEMS.slice(0, 3) : GEMS;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g || store.reduced) return;
    const k = 1 - Math.exp(-3 * Math.min(dt, 1 / 30));
    g.children.forEach((c, i) => {
      c.rotation.x += dt * gems[i].speed * 0.6;
      c.rotation.y += dt * gems[i].speed;
    });
    g.rotation.z = MathUtils.lerp(g.rotation.z, store.pointer.x * 0.12 + state.clock.elapsedTime * 0.03, k);
    g.position.y = MathUtils.lerp(g.position.y, 0.75 + store.heroProgress * 2.2, k);
  });

  return (
    <group ref={group} position={[cx, 0.75, 0]} scale={scale}>
      {gems.map((gem, i) => (
        <mesh key={i} position={gem.pos as unknown as [number, number, number]} scale={gem.s}>
          {gem.shape === "oct" ? <octahedronGeometry args={[1, 0]} /> : <icosahedronGeometry args={[1, 0]} />}
          <meshPhysicalMaterial
            color={i % 3 === 2 ? "#ffd2a6" : "#ff7d00"}
            emissive="#ff6a00"
            emissiveIntensity={i % 3 === 2 ? 0.05 : 0.18}
            roughness={0.08}
            metalness={0.1}
            transmission={low ? 0 : 0.55}
            thickness={1}
            ior={1.6}
            clearcoat={1}
            clearcoatRoughness={0.05}
            iridescence={0.6}
            iridescenceIOR={1.4}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/** Coloured lights sitting behind the prism, which the glass bends and splits. */
function Backdrop() {
  const glow = useGlowTexture();
  const spectrum = useSpectrumTexture();
  const beam = useRef<Mesh>(null);
  const { viewport } = useThree();
  const cx = viewport.width > 7 ? viewport.width * 0.2 : 0;

  useFrame((state) => {
    if (!beam.current || store.reduced) return;
    const t = state.clock.elapsedTime;
    beam.current.rotation.z = -0.18 + Math.sin(t * 0.3) * 0.03;
  });

  return (
    <group position={[0, 0.75, -3]}>
      <sprite position={[cx - 1.4, 1.0, 0]} scale={[7, 7, 1]}>
        <spriteMaterial map={glow} color="#ff7d00" transparent opacity={0.95} depthWrite={false} />
      </sprite>
      <sprite position={[cx + 0.6, -0.4, 0.4]} scale={[4, 4, 1]}>
        <spriteMaterial map={glow} color="#ffb266" transparent opacity={0.9} depthWrite={false} />
      </sprite>
      <sprite position={[cx + 2.2, -1.4, -0.6]} scale={[6.5, 6.5, 1]}>
        <spriteMaterial map={glow} color="#0b076e" transparent opacity={0.6} depthWrite={false} />
      </sprite>
      <mesh ref={beam} position={[cx + 3.2, -0.2, 1.2]} rotation={[0, 0, -0.18]}>
        <planeGeometry args={[7, 0.55]} />
        <meshBasicMaterial map={spectrum} transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function PrismScene() {
  const low = store.tier === "low";
  return (
    <Canvas
      dpr={low ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !low, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 9], fov: 35 }}
      style={{ pointerEvents: "none" }}
    >
      {/* Same as the page, so the canvas has no visible edge and the glass refracts paper, not black. */}
      <color attach="background" args={["#FBFAF7"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={1.4} />
      <Backdrop />
      <Prism />
      <Crystals />
      <Environment resolution={low ? 64 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 3]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffd2a6" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#ff9a3c" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2.5} position={[0, 0, 6]} scale={3} />
      </Environment>
    </Canvas>
  );
}
