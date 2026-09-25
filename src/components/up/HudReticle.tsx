/**
 * Instrument ring around the particle object: a slow tick dial, two orange
 * arcs turning the other way, and corner brackets. Wide screens only, where
 * the object sits in the right half of the hero.
 */
// Rounded so server and browser render identical attributes.
const round = (v: number) => Math.round(v * 100) / 100;

export function HudReticle({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  const R = 300;
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute hidden size-[min(44vw,640px)] -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ left: "50%", top: "45%" }}
      aria-hidden="true"
    >
      <svg viewBox="-320 -320 640 640" className="absolute inset-0 size-full overflow-visible">
        <g className="hud-spin-slow" style={{ transformOrigin: "0 0" }}>
          {ticks.map((i) => {
            const long = i % 6 === 0;
            const a = (i / ticks.length) * Math.PI * 2;
            const r1 = long ? R - 14 : R - 7;
            return (
              <line
                key={i}
                x1={round(Math.cos(a) * r1)}
                y1={round(Math.sin(a) * r1)}
                x2={round(Math.cos(a) * R)}
                y2={round(Math.sin(a) * R)}
                stroke={long ? "rgba(201,198,255,0.55)" : "rgba(201,198,255,0.22)"}
                strokeWidth={long ? 1.2 : 1}
              />
            );
          })}
        </g>
        <circle r={R - 30} fill="none" stroke="rgba(201,198,255,0.1)" />
        <g className="hud-spin-rev" style={{ transformOrigin: "0 0" }}>
          <circle
            r={R - 30}
            fill="none"
            stroke="#ff7d00"
            strokeWidth="1.5"
            strokeDasharray={`${(R - 30) * 1.1} ${(R - 30) * 2.04}`}
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
        <g className="hud-spin-slow" style={{ transformOrigin: "0 0", animationDuration: "40s" }}>
          <circle r={R + 12} fill="none" stroke="rgba(123,119,232,0.35)" strokeDasharray="1 9" />
        </g>
        {[
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ].map(([sx, sy]) => (
          <path
            key={`${sx}${sy}`}
            d={`M${sx * 316} ${sy * 276} V${sy * 316} H${sx * 276}`}
            fill="none"
            stroke="rgba(201,198,255,0.5)"
            strokeWidth="1.2"
          />
        ))}
        {[0, 90, 180, 270].map((d) => (
          <line key={d} x1="0" y1={-R - 22} x2="0" y2={-R - 34} stroke="#ff7d00" strokeWidth="1.5" transform={`rotate(${d})`} />
        ))}
      </svg>
    </div>
  );
}
