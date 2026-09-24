"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { InstancedMesh, MeshPhysicalMaterial, Object3D, TorusGeometry } from "three";
import { store } from "@/lib/store";
import { COLORS } from "@/lib/logo";
import { smoothstep } from "./math";

const SPACING = 2.4;

/** Orange rings the camera flies through in the final call to action. */
export function RingTunnel() {
  const { viewport } = useThree();
  const count = store.tier === "low" ? 18 : 34;
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const geo = useMemo(
    () => new TorusGeometry(1, 0.035, 12, store.tier === "low" ? 64 : 128),
    [],
  );
  const mat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: COLORS.pearl,
        emissive: "#FFE7CC",
        emissiveIntensity: 0.35,
        roughness: 0.3,
        clearcoat: 1,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat]);

  useFrame((state) => {
    const p = store.progress.cta;
    const vis = smoothstep(0.25, 0.5, p);
    const m = mesh.current!;
    m.visible = vis > 0.001;
    if (!m.visible) return;
    mat.opacity = vis;

    const t = store.reduced ? 0 : state.clock.elapsedTime;
    const radius = Math.max(viewport.width, viewport.height) * 0.42;
    const travel = p * SPACING * count * 0.55;

    for (let i = 0; i < count; i++) {
      const z = -i * SPACING - 6 + travel;
      const wobble = Math.sin(i * 0.7 + t * 0.6) * 0.25;
      dummy.position.set(Math.sin(i * 0.45) * 0.4, Math.cos(i * 0.38) * 0.3, z);
      dummy.rotation.set(wobble * 0.3, wobble * 0.2, i * 0.35 + t * 0.15);
      // Rings far ahead shrink into the distance; rings behind the camera vanish.
      const fade = z > 8 ? 0 : 1;
      dummy.scale.setScalar(radius * (0.85 + (i % 3) * 0.08) * fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geo, mat, count]} visible={false} frustumCulled={false} />;
}
