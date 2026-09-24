import { Vector3 } from "three";
import { mulberry32 } from "./math";

/**
 * Local offsets (unit-ish scale, centred on 0) for each body in a formation.
 * The cluster positions these around a section-specific anchor.
 */

export function heroFormation(n: number): Vector3[] {
  const rand = mulberry32(7);
  const out: Vector3[] = [new Vector3(0, 0, 0.4)]; // the logo sits at the heart
  for (let i = 1; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const r = 0.9 + Math.pow(rand(), 0.7) * 1.7;
    out.push(new Vector3(Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.85, (rand() - 0.5) * 2.2));
  }
  return out;
}

export function scatterFormation(n: number, w: number, h: number): Vector3[] {
  const rand = mulberry32(19);
  return Array.from({ length: n }, (_, i) => {
    // Keep the middle band clearer so the headline stays readable.
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * (0.3 + rand() * 0.2) * w;
    const y = (rand() - 0.5) * h * 1.3;
    return new Vector3(x, y, -2 - rand() * 2.5);
  });
}

/** One formation per service (index matches content order). */
export function serviceFormation(kind: number, n: number): Vector3[] {
  const out: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0;
    switch (kind) {
      case 0: {
        // AI SEO — a sphere of knowledge (fibonacci lattice)
        const y = 1 - t * 2;
        const r = Math.sqrt(1 - y * y);
        const a = golden * i;
        out.push(new Vector3(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(1.9));
        break;
      }
      case 1: {
        // Technical — an ordered grid
        const cols = 4;
        const x = (i % cols) - (cols - 1) / 2;
        const row = Math.floor(i / cols);
        const rows = Math.ceil(n / cols);
        out.push(new Vector3(x * 0.95, (rows - 1) / 2 - row, (row % 2) * 0.6 - 0.3).multiplyScalar(0.95));
        break;
      }
      case 2: {
        // GEO — an orbit, tilted
        const a = t * Math.PI * 2;
        out.push(new Vector3(Math.cos(a) * 2.2, Math.sin(a) * 0.5, Math.sin(a) * 1.4));
        break;
      }
      case 3: {
        // Content — a rising helix of ideas
        const a = t * Math.PI * 4;
        out.push(new Vector3(Math.cos(a) * 1.1, t * 4 - 2, Math.sin(a) * 1.1));
        break;
      }
      case 4: {
        // Visibility — a wave, rising to the right
        const x = t * 5 - 2.5;
        out.push(new Vector3(x, Math.sin(t * Math.PI * 2) * 0.6 + t * 1.2 - 0.6, Math.cos(t * Math.PI * 3) * 0.6));
        break;
      }
      default: {
        // Automation — a loop that feeds itself (lemniscate)
        const a = t * Math.PI * 2;
        const d = 1 + Math.sin(a) ** 2;
        out.push(new Vector3((2.3 * Math.cos(a)) / d, (2.3 * Math.sin(a) * Math.cos(a)) / d, Math.sin(a * 2) * 0.5));
        break;
      }
    }
  }
  return out;
}
