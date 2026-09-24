"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Points,
  PointsMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { store } from "@/lib/store";
import { COLORS } from "@/lib/logo";
import { mulberry32, windowed } from "./math";

/**
 * Stage anchors as viewport fractions. The DOM labels in the Journey section
 * use the same numbers, so particles and text line up at any screen size.
 */
export const STAGE_ANCHORS = [
  { x: 0.1, y: 0.62 },
  { x: 0.233, y: 0.38 },
  { x: 0.366, y: 0.62 },
  { x: 0.5, y: 0.38 },
  { x: 0.633, y: 0.62 },
  { x: 0.766, y: 0.38 },
  { x: 0.9, y: 0.62 },
];
export const STAGE_ANCHORS_PORTRAIT = STAGE_ANCHORS.map((_, i) => ({
  x: i % 2 === 0 ? 0.3 : 0.7,
  y: 0.32 + (i / 6) * 0.5,
}));

const SAMPLES = 256;

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

export function JourneyParticles() {
  const { viewport, size } = useThree();
  const count = store.tier === "low" ? 1600 : 5200;
  const portrait = size.width / size.height < 0.9;

  const { geometry, seeds, texture, material } = useMemo(() => {
    const rand = mulberry32(11);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 5); // t0, speed, jx, jy, jz
    const orange = new Color(COLORS.orange);
    const navy = new Color(COLORS.navy);
    for (let i = 0; i < count; i++) {
      seeds[i * 5] = rand();
      seeds[i * 5 + 1] = 0.025 + rand() * 0.05;
      const a = rand() * Math.PI * 2;
      const r = Math.pow(rand(), 1.6);
      seeds[i * 5 + 2] = Math.cos(a) * r;
      seeds[i * 5 + 3] = Math.sin(a) * r;
      seeds[i * 5 + 4] = (rand() - 0.5) * 2;
      const c = rand() < 0.14 ? navy : orange;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    const texture = dotTexture();
    const material = new PointsMaterial({
      size: store.tier === "low" ? 0.07 : 0.055,
      map: texture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      opacity: 0,
      blending: NormalBlending,
      sizeAttenuation: true,
    });
    return { geometry, seeds, texture, material };
  }, [count]);

  // Curve through the stage anchors, sampled into a lookup table.
  const { lut, nodes } = useMemo(() => {
    const anchors = portrait ? STAGE_ANCHORS_PORTRAIT : STAGE_ANCHORS;
    const pts = anchors.map(
      (a) => new Vector3((a.x - 0.5) * viewport.width, -(a.y - 0.5) * viewport.height, 0),
    );
    const curve = new CatmullRomCurve3(pts, false, "centripetal");
    const lut = new Float32Array((SAMPLES + 1) * 3);
    const v = new Vector3();
    for (let i = 0; i <= SAMPLES; i++) {
      curve.getPointAt(i / SAMPLES, v);
      lut.set([v.x, v.y, v.z], i * 3);
    }
    return { lut, nodes: pts };
  }, [portrait, viewport.width, viewport.height]);

  const nodeGeo = useMemo(() => new SphereGeometry(0.09, 20, 20), []);
  const nodeMats = useMemo(
    () => nodes.map(() => new MeshBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0 })),
    [nodes],
  );
  const glowMat = useMemo(
    () =>
      new PointsMaterial({
        size: 0.9,
        map: texture,
        color: COLORS.orange,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [texture],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
      nodeGeo.dispose();
      glowMat.dispose();
      nodeMats.forEach((m) => m.dispose());
    },
    [geometry, material, texture, nodeGeo, nodeMats, glowMat],
  );

  const points = useRef<Points>(null);
  const group = useRef<Group>(null);
  const nodeRefs = useRef<(Mesh | null)[]>([]);
  const orangeC = useMemo(() => new Color(COLORS.orange), []);
  const navyC = useMemo(() => new Color(COLORS.navy), []);

  useFrame((state) => {
    const p = store.progress.journey;
    const vis = windowed(p, 0, 0.05, 0.95, 1);
    const g = group.current!;
    g.visible = vis > 0.001;
    if (!g.visible) return;

    material.opacity = vis * 0.95;
    const t = store.reduced ? 0 : state.clock.elapsedTime;
    // The stream grows along the path as the section scrolls.
    const reach = Math.min(1, 0.04 + (p / 0.9) * 0.96);
    const pos = geometry.attributes.position.array as Float32Array;
    const thick = 0.32 * Math.min(1, viewport.width / 10);
    const nodeScale = Math.min(1, Math.max(0.45, viewport.width / 11));

    for (let i = 0; i < count; i++) {
      const s = i * 5;
      const u = ((seeds[s] + t * seeds[s + 1]) % 1) * reach;
      const f = u * SAMPLES;
      const k = Math.floor(f);
      const fr = f - k;
      const a = k * 3;
      const b = Math.min(k + 1, SAMPLES) * 3;
      // Stream breathes: thicker between stages, pinched at each stage.
      const pinch = 0.35 + 0.65 * Math.abs(Math.sin(u * Math.PI * 6));
      const wob = Math.sin(t * 1.3 + seeds[s] * 40) * 0.05;
      pos[i * 3] = lut[a] + (lut[b] - lut[a]) * fr + seeds[s + 4] * 0.05;
      pos[i * 3 + 1] = lut[a + 1] + (lut[b + 1] - lut[a + 1]) * fr + (seeds[s + 3] * thick + wob) * pinch;
      pos[i * 3 + 2] = seeds[s + 2] * thick * pinch * 1.5;
    }
    geometry.attributes.position.needsUpdate = true;

    // Stage nodes light up orange as the stream reaches them.
    nodes.forEach((_, i) => {
      const m = nodeRefs.current[i];
      if (!m) return;
      const reached = reach >= i / 6 - 0.001;
      const mat = nodeMats[i];
      mat.opacity = vis;
      mat.color.lerp(reached ? orangeC : navyC, 0.12);
      const target = (reached ? 1.6 : 1) * nodeScale;
      m.scale.setScalar(m.scale.x + (target - m.scale.x) * 0.1);
    });
    glowMat.opacity = vis * 0.35;
  });

  const glowGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(nodes.flatMap((v) => [v.x, v.y, v.z])), 3));
    return g;
  }, [nodes]);
  useEffect(() => () => glowGeo.dispose(), [glowGeo]);

  return (
    <group ref={group} visible={false}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
      <points geometry={glowGeo} material={glowMat} />
      {nodes.map((v, i) => (
        <mesh
          key={i}
          ref={(el) => void (nodeRefs.current[i] = el)}
          position={v}
          geometry={nodeGeo}
          material={nodeMats[i]}
        />
      ))}
    </group>
  );
}
