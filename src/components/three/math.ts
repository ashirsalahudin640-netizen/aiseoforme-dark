export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 0 → 1 → 0 window over a 0..1 progress value. */
export const windowed = (p: number, inA: number, inB: number, outA: number, outB: number) =>
  smoothstep(inA, inB, p) * (1 - smoothstep(outA, outB, p));

/** Deterministic PRNG so formations are stable between renders. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
