import type { ReactNode } from "react";
import type { Service } from "@/content/site";

/*
 * Isometric illustrations drawn as plain SVG: stacked slabs with a lit top,
 * a shaded left face and a darker right face. Content drawn in a flat square
 * (x, y in [-s/2, s/2]) is projected onto the slab's top face.
 */

type Tone = "white" | "orange" | "pearl";
const TONES: Record<Tone, [string, string, string]> = {
  white: ["#ffffff", "#e3e5ea", "#d2d5dc"],
  pearl: ["#eceef1", "#d9dce2", "#c7cbd3"],
  orange: ["#ff6a26", "#d9430a", "#b33505"],
};

function Slab({
  cx,
  cy,
  s,
  t = 14,
  tone = "white",
  className,
  children,
}: {
  cx: number;
  cy: number;
  s: number;
  t?: number;
  tone?: Tone;
  className?: string;
  children?: ReactNode;
}) {
  const w = s * 0.866;
  const h = s / 2;
  const [top, left, right] = TONES[tone];
  return (
    <g className={className}>
      <polygon points={`${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx - w},${cy + t}`} fill={left} />
      <polygon points={`${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + t} ${cx},${cy + h + t}`} fill={right} />
      <polygon
        points={`${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`}
        fill={top}
        stroke="rgba(22,23,27,0.06)"
      />
      {children && <g transform={`matrix(0.866 0.5 -0.866 0.5 ${cx} ${cy})`}>{children}</g>}
    </g>
  );
}

/** A flat label floating in screen space above the illustration. */
function Chip({ x, y, label, accent = false }: { x: number; y: number; label: string; accent?: boolean }) {
  const width = label.length * 6.6 + 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height={28} rx={14} fill={accent ? "#16171b" : "#ffffff"} stroke="rgba(22,23,27,0.1)" />
      <circle cx={14} cy={14} r={4} fill="#ff5b14" />
      <text x={25} y={18.5} fontSize={11.5} fill={accent ? "#ffffff" : "#16171b"} fontFamily="var(--font-geist)">
        {label}
      </text>
    </g>
  );
}

const ORANGE = "#ff5b14";
const INK = "#16171b";

function Answers() {
  return (
    <>
      <Slab cx={200} cy={262} s={170} tone="pearl" className="float-c" />
      <Slab cx={200} cy={206} s={150} className="float-b">
        {[-44, -18, 8].map((y, i) => (
          <rect key={y} x={-52} y={y} width={i === 1 ? 70 : 96} height={12} rx={6} fill="#e3e5ea" />
        ))}
      </Slab>
      <Slab cx={200} cy={146} s={120} tone="orange" className="float-a">
        <rect x={-38} y={-30} width={76} height={11} rx={5.5} fill="#ffffff" opacity={0.95} />
        <rect x={-38} y={-10} width={56} height={11} rx={5.5} fill="#ffffff" opacity={0.7} />
        <circle cx={28} cy={20} r={11} fill="#ffffff" />
        <text x={28} y={24} fontSize={12} textAnchor="middle" fill={ORANGE} fontWeight={700}>1</text>
      </Slab>
      <Chip x={232} y={62} label="Cited by ChatGPT" accent />
    </>
  );
}

function Engines() {
  return (
    <>
      <Slab cx={200} cy={250} s={200} tone="pearl" className="float-c">
        <g className="spin-slow">
          <circle r={78} fill="none" stroke="rgba(22,23,27,0.14)" strokeDasharray="3 7" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={Math.cos((a * Math.PI) / 180) * 78}
              cy={Math.sin((a * Math.PI) / 180) * 78}
              r={a === 0 ? 9 : 6}
              fill={a === 0 ? ORANGE : INK}
            />
          ))}
        </g>
        <circle r={44} fill="none" stroke="rgba(255,91,20,0.35)" />
      </Slab>
      <Slab cx={200} cy={190} s={80} tone="orange" t={34} className="float-a" />
      <Chip x={40} y={70} label="Perplexity" />
      <Chip x={250} y={96} label="Gemini" />
      <Chip x={236} y={318} label="AI Overviews" accent />
    </>
  );
}

function Crawl() {
  const nodes: [number, number][] = [[-50, -50], [0, -50], [50, -50], [-25, 0], [25, 0], [0, 50]];
  return (
    <>
      <Slab cx={200} cy={250} s={210} tone="pearl" className="float-c">
        <path d="M-50 -50 L-25 0 L0 50 M0 -50 L-25 0 M50 -50 L25 0 L0 50" stroke="rgba(22,23,27,0.22)" strokeWidth={2} fill="none" />
        <path d="M50 -50 L25 0 L0 50" stroke={ORANGE} strokeWidth={3} fill="none" className="dash-flow" />
        {nodes.map(([x, y], i) => (
          <g key={i}>
            {i === 5 && <circle cx={x} cy={y} r={10} fill={ORANGE} className="pulse-ring" />}
            <circle cx={x} cy={y} r={i === 5 ? 10 : 7} fill={i === 5 ? ORANGE : "#ffffff"} stroke={INK} strokeOpacity={0.25} />
          </g>
        ))}
      </Slab>
      <Slab cx={120} cy={150} s={70} t={22} className="float-a" />
      <Slab cx={292} cy={140} s={60} t={40} tone="orange" className="float-b" />
      <Chip x={34} y={60} label="1,400 pages found" />
      <Chip x={230} y={330} label="LCP 1.8s" accent />
    </>
  );
}

function Content() {
  return (
    <>
      <Slab cx={200} cy={262} s={180} tone="pearl" className="float-c" />
      <Slab cx={186} cy={200} s={150} t={10} className="float-b">
        {[-54, -36, -18, 0, 18, 36].map((y, i) => (
          <rect
            key={y}
            x={-58}
            y={y}
            width={i === 2 ? 84 : i === 5 ? 60 : 110}
            height={8}
            rx={4}
            fill={i === 2 ? ORANGE : "#e3e5ea"}
          />
        ))}
      </Slab>
      <Slab cx={232} cy={132} s={90} t={10} tone="white" className="float-a">
        <rect x={-30} y={-28} width={60} height={8} rx={4} fill={INK} />
        <rect x={-30} y={-12} width={44} height={8} rx={4} fill="#e3e5ea" />
        <rect x={-30} y={4} width={52} height={8} rx={4} fill="#e3e5ea" />
      </Slab>
      <Chip x={40} y={78} label="Answers the real question" accent />
    </>
  );
}

function Automation() {
  return (
    <>
      <Slab cx={200} cy={250} s={220} tone="pearl" className="float-c">
        <path d="M-60 -40 L40 -40 L40 50 L-60 50 Z" fill="none" stroke={ORANGE} strokeWidth={3} className="dash-flow" />
        {[[-60, -40], [40, -40], [40, 50], [-60, 50]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={i === 0 ? ORANGE : "#ffffff"} stroke={INK} strokeOpacity={0.25} />
        ))}
      </Slab>
      <Slab cx={150} cy={170} s={64} t={26} tone="orange" className="float-a" />
      <Slab cx={262} cy={184} s={58} t={30} className="float-b" />
      <Chip x={196} y={70} label="Schema repaired 3:12am" />
      <Chip x={36} y={326} label="Rank alert: +4" accent />
    </>
  );
}

const ART: Record<Service["art"], () => ReactNode> = {
  answers: Answers,
  engines: Engines,
  crawl: Crawl,
  content: Content,
  automation: Automation,
};

export function IsoArt({ art, className }: { art: Service["art"]; className?: string }) {
  const Art = ART[art];
  return (
    <svg viewBox="0 0 400 380" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={200} cy={318} rx={150} ry={26} fill="rgba(217,67,10,0.12)" />
      <Art />
    </svg>
  );
}
