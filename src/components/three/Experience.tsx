"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Color, Fog } from "three";
import { store } from "@/lib/store";
import { COLORS } from "@/lib/logo";
import { detectTier } from "@/lib/device";
import { Cluster } from "./Cluster";
import { JourneyParticles } from "./JourneyParticles";
import { windowed } from "./math";

/** Background, fog and camera all follow the scroll story. */
function Director() {
  const { scene, camera } = useThree();
  const pearl = useMemo(() => new Color(COLORS.pearl), []);
  const orange = useMemo(() => new Color(COLORS.orange), []);
  const bg = useMemo(() => new Color(COLORS.pearl), []);
  const amount = useRef(0);

  useEffect(() => {
    scene.background = bg;
    scene.fog = new Fog(bg, 12, 60);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, bg]);

  useFrame(() => {
    // Orange ground behind Services; eased so it never snaps with the scroll.
    const target = windowed(store.progress.servicesBg, 0, 0.1, 0.9, 1);
    amount.current += (target - amount.current) * 0.1;
    bg.copy(pearl).lerp(orange, amount.current);
    (scene.fog as Fog).color.copy(bg);

    if (store.reduced) return;
    const px = store.pointer.x * 0.35;
    const py = store.pointer.y * 0.25;
    camera.position.x += (px - camera.position.x) * 0.04;
    camera.position.y += (py - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Experience() {
  const tier = useMemo(() => {
    store.tier = detectTier();
    return store.tier;
  }, []);

  return (
    <Canvas
      className="!fixed inset-0 !h-[100lvh] !w-full"
      style={{ pointerEvents: "none" }}
      dpr={tier === "low" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: tier === "high", powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 120 }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.15;
      }}
    >
      <Director />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} color="#fff6e8" />
      <directionalLight position={[-6, -2, 3]} intensity={0.5} color="#ffd2a8" />
      <Environment resolution={tier === "low" ? 64 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-6, 0, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffb070" position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={2} position={[0, 0, 6]} scale={3} />
      </Environment>
      <Cluster />
      <JourneyParticles />
    </Canvas>
  );
}
