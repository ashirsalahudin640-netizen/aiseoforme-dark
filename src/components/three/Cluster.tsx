"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, MeshPhysicalMaterial, Vector3, type BufferGeometry } from "three";
import { store } from "@/lib/store";
import { COLORS } from "@/lib/logo";
import { clamp, mulberry32, windowed, smoothstep } from "./math";
import { heroFormation, scatterFormation, serviceFormation } from "./formations";
import { createPrimitiveGeometries, logoPartGeometry, type LogoPart } from "./geometries";

type Kind = "logo" | "block" | "capsule" | "sphere" | "torus";
type Tone = "orange" | "navy" | "pearl";

type BodySpec = { kind: Kind; tone: Tone; radius: number };

const HIGH: BodySpec[] = [
  { kind: "logo", tone: "orange", radius: 1.05 },
  { kind: "block", tone: "orange", radius: 0.45 },
  { kind: "capsule", tone: "orange", radius: 0.55 },
  { kind: "sphere", tone: "pearl", radius: 0.42 },
  { kind: "torus", tone: "navy", radius: 0.55 },
  { kind: "capsule", tone: "navy", radius: 0.55 },
  { kind: "sphere", tone: "orange", radius: 0.42 },
  { kind: "block", tone: "orange", radius: 0.45 },
  { kind: "sphere", tone: "pearl", radius: 0.42 },
  { kind: "capsule", tone: "orange", radius: 0.55 },
  { kind: "torus", tone: "orange", radius: 0.55 },
  { kind: "sphere", tone: "navy", radius: 0.42 },
  { kind: "capsule", tone: "pearl", radius: 0.55 },
  { kind: "block", tone: "navy", radius: 0.45 },
  { kind: "sphere", tone: "orange", radius: 0.42 },
  { kind: "torus", tone: "pearl", radius: 0.55 },
  { kind: "capsule", tone: "orange", radius: 0.55 },
  { kind: "sphere", tone: "pearl", radius: 0.42 },
];

const LOW_COUNT = 9;

type Body = BodySpec & {
  pos: Vector3;
  vel: Vector3;
  target: Vector3;
  park: Vector3;
  parkZ: number;
  spin: Vector3;
  phase: number;
};

const tmp = new Vector3();
const tmp2 = new Vector3();

export function Cluster() {
  const { viewport, size } = useThree();
  const low = store.tier === "low";
  const specs = useMemo(() => (low ? HIGH.slice(0, LOW_COUNT) : HIGH), [low]);
  const n = specs.length;

  const geos = useMemo(() => createPrimitiveGeometries(low), [low]);
  const logoGeos = useMemo(
    () =>
      (["base", "arc", "stem", "dot"] as LogoPart[]).map((p) => ({
        part: p,
        geo: logoPartGeometry(p),
      })),
    [],
  );

  const materials = useMemo(() => {
    const make = (color: string, rough: number) =>
      new MeshPhysicalMaterial({
        color,
        roughness: rough,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.4,
        sheenColor: color,
      });
    return {
      orange: make(COLORS.orange, 0.32),
      navy: make(COLORS.navy, 0.28),
      pearl: make("#F1EBDF", 0.4),
    };
  }, []);

  // Free GPU memory when the canvas unmounts.
  useEffect(
    () => () => {
      Object.values(geos).forEach((g) => g.dispose());
      logoGeos.forEach(({ geo }) => geo.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    },
    [geos, logoGeos, materials],
  );

  const bodies = useMemo<Body[]>(() => {
    const rand = mulberry32(3);
    return specs.map((s) => {
      const a = rand() * Math.PI * 2;
      const dir = new Vector3(Math.cos(a), Math.sin(a), 0);
      const parkZ = -2 - rand() * 3;
      return {
        ...s,
        pos: dir.clone().multiplyScalar(14).setZ(parkZ),
        vel: new Vector3(),
        target: new Vector3(),
        park: dir,
        parkZ,
        spin: new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.6),
        phase: rand() * Math.PI * 2,
      };
    });
  }, [specs]);

  const hero = useMemo(() => heroFormation(n), [n]);
  const scatter = useMemo(() => scatterFormation(n, viewport.width, viewport.height), [n, viewport.width, viewport.height]);
  const serviceSets = useMemo(() => Array.from({ length: 6 }, (_, k) => serviceFormation(k, n)), [n]);

  const refs = useRef<(Group | null)[]>([]);
  const rotation = useRef(0);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const t = state.clock.elapsedTime;
    const { width: vw, height: vh } = viewport;
    const portrait = size.width / size.height < 0.9;
    const scale = clamp(vw / 11, 0.45, 1.1);
    const reduced = store.reduced;

    const p = store.progress;
    const wHero = store.ready ? 1 - smoothstep(0.08, 0.55, p.hero) : 0;
    const wServices = windowed(p.services, 0, 0.12, 0.88, 1);
    // Shapes accompany the big type only, then clear out before the paragraph.
    const wPhil = windowed(p.philosophy, 0.1, 0.24, 0.38, 0.5);
    let sum = wHero + wServices + wPhil;
    const norm = sum > 1 ? 1 / sum : 1;
    sum = Math.min(sum, 1);
    const wPark = 1 - sum;

    rotation.current += dt * (reduced ? 0 : 0.18);
    const rot = rotation.current;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const heroAnchor = portrait
      ? tmp2.set(0, vh * 0.16, 0)
      : tmp2.set(vw * 0.25, vh * 0.1, 0);
    const heroX = heroAnchor.x;
    const heroY = heroAnchor.y;
    const servX = portrait ? 0 : vw * 0.22;
    const servY = portrait ? vh * 0.2 : 0;
    const servScale = portrait ? scale * 0.75 : scale * 0.95;
    const philDrift = (0.5 - p.philosophy) * vh * 0.8;
    const service = serviceSets[store.activeService] ?? serviceSets[0];
    const parkDist = Math.max(vw, vh) * 1.05;

    // Pointer in world space on the z=0 plane.
    const px = store.pointer.x * (vw / 2);
    const py = store.pointer.y * (vh / 2);
    const pointerOn = store.pointer.active && !reduced;

    for (let i = 0; i < n; i++) {
      const b = bodies[i];
      const h = hero[i];
      const s = service[i];
      const sc = scatter[i];
      const bob = reduced ? 0 : Math.sin(t * 0.8 + b.phase) * 0.12;

      // Weighted blend of every formation this body can belong to.
      b.target.set(
        (heroX + h.x * scale) * wHero +
          (servX + (s.x * cosR - s.z * sinR) * servScale) * wServices +
          sc.x * wPhil,
        (heroY + h.y * scale + bob) * wHero + (servY + s.y * servScale + bob) * wServices + (sc.y + philDrift) * wPhil,
        h.z * scale * wHero + (s.x * sinR + s.z * cosR) * servScale * wServices + sc.z * wPhil,
      );
      if (norm !== 1) b.target.multiplyScalar(norm);
      b.target.addScaledVector(tmp.copy(b.park).multiplyScalar(parkDist).setZ(b.parkZ), wPark);

      if (reduced) {
        b.pos.copy(b.target);
        continue;
      }

      // Spring toward the target.
      tmp.copy(b.target).sub(b.pos).multiplyScalar(14 * dt);
      b.vel.add(tmp);

      // Cursor pushes bodies away, more strongly when it moves fast.
      if (pointerOn) {
        const dx = b.pos.x - px;
        const dy = b.pos.y - py;
        const d = Math.hypot(dx, dy);
        const reach = 1.8 * scale + b.radius;
        if (d < reach && d > 0.0001) {
          const speed = Math.min(Math.hypot(store.pointer.vx, store.pointer.vy) * 40, 3);
          const f = ((reach - d) / reach) * (6 + speed * 6) * dt;
          b.vel.x += (dx / d) * f;
          b.vel.y += (dy / d) * f;
          b.vel.z -= f * 0.4;
        }
      }
    }

    if (!reduced) {
      // Soft collisions so the cluster reads as physical objects.
      for (let i = 0; i < n; i++) {
        const a = bodies[i];
        for (let j = i + 1; j < n; j++) {
          const c = bodies[j];
          tmp.copy(a.pos).sub(c.pos);
          const d = tmp.length();
          const min = (a.radius + c.radius) * scale * 0.95;
          if (d < min && d > 0.0001) {
            const push = ((min - d) / d) * 0.5;
            tmp.multiplyScalar(push);
            a.pos.add(tmp);
            c.pos.sub(tmp);
            a.vel.addScaledVector(tmp, 2);
            c.vel.addScaledVector(tmp, -2);
          }
        }
      }
    }

    const damping = Math.exp(-5.5 * dt);
    for (let i = 0; i < n; i++) {
      const b = bodies[i];
      const g = refs.current[i];
      if (!g) continue;
      if (!reduced) {
        b.vel.multiplyScalar(damping);
        b.pos.addScaledVector(b.vel, dt);
        g.rotation.x += (b.spin.x * 0.4 + b.vel.y * 0.25) * dt;
        g.rotation.y += (b.spin.y * 0.4 + b.vel.x * 0.25) * dt;
        g.rotation.z += b.spin.z * 0.2 * dt;
      }
      g.position.copy(b.pos);
      g.scale.setScalar(scale);
      g.visible = Math.hypot(b.pos.x, b.pos.y) < parkDist * 0.97;
    }

    // Keep the logo facing forward so the mark stays legible.
    const logo = refs.current[0];
    if (logo && !reduced) {
      logo.rotation.x += (Math.sin(t * 0.5) * 0.18 - store.pointer.y * 0.25 - logo.rotation.x) * 0.06;
      logo.rotation.y += (Math.sin(t * 0.4) * 0.35 + store.pointer.x * 0.45 - logo.rotation.y) * 0.06;
      logo.rotation.z += (0 - logo.rotation.z) * 0.06;
    }
  });

  return (
    <group>
      {bodies.map((b, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)}>
          {b.kind === "logo" ? (
            logoGeos.map(({ part, geo }) => (
              <mesh
                key={part}
                geometry={geo}
                material={part === "base" ? materials.navy : materials.orange}
              />
            ))
          ) : (
            <mesh
              geometry={geos[b.kind as Exclude<Kind, "logo">] as BufferGeometry}
              material={materials[b.tone]}
              rotation={[b.phase, b.phase * 0.5, 0]}
            />
          )}
        </group>
      ))}
    </group>
  );
}
