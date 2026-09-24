import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  ExtrudeGeometry,
  SphereGeometry,
  TorusGeometry,
} from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { LOGO_PATHS } from "@/lib/logo";

export type LogoPart = "base" | "arc" | "stem" | "dot";

/** Extrudes one piece of the official mark into a bevelled 3D solid. */
export function logoPartGeometry(part: LogoPart, width = 2.6): BufferGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 433 198"><path d="${LOGO_PATHS[part]}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => p.toShapes());
  const geo = new ExtrudeGeometry(shapes, {
    depth: 34,
    bevelEnabled: true,
    bevelThickness: 7,
    bevelSize: 4,
    bevelSegments: 4,
    curveSegments: 18,
  });
  // SVG is y-down and 433 units wide; flip and normalise to world units.
  // All parts share one scale so they reassemble into the mark.
  const s = width / 433;
  geo.scale(s, -s, s);
  geo.translate(-width / 2, (198 / 2) * s, -(34 * s) / 2);
  geo.computeVertexNormals();
  return geo;
}

export function createPrimitiveGeometries(low: boolean) {
  const seg = low ? 20 : 40;
  return {
    capsule: new CapsuleGeometry(0.28, 0.75, low ? 6 : 10, seg),
    sphere: new SphereGeometry(0.42, seg, seg),
    torus: new TorusGeometry(0.4, 0.15, low ? 12 : 20, seg * 2),
    // The square "i" dot of the mark, as a soft block.
    block: roundedBlock(0.62),
  };
}

function roundedBlock(size: number) {
  const g = new BoxGeometry(size, size, size, 6, 6, 6);
  const pos = g.attributes.position;
  const half = size / 2;
  const r = size * 0.22;
  const inner = half - r;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const cx = Math.max(-inner, Math.min(inner, x));
    const cy = Math.max(-inner, Math.min(inner, y));
    const cz = Math.max(-inner, Math.min(inner, z));
    let dx = x - cx;
    let dy = y - cy;
    let dz = z - cz;
    const len = Math.hypot(dx, dy, dz) || 1;
    dx = (dx / len) * r;
    dy = (dy / len) * r;
    dz = (dz / len) * r;
    pos.setXYZ(i, cx + dx, cy + dy, cz + dz);
  }
  g.computeVertexNormals();
  return g;
}
