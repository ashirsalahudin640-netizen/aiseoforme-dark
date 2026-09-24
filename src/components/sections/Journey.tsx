"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { journey } from "@/content/site";
import { STAGE_ANCHORS, STAGE_ANCHORS_PORTRAIT } from "@/components/three/JourneyParticles";

/** Same mapping the particle stream uses, so labels light up with it. */
const reachFor = (p: number) => Math.min(1, 0.04 + (p / 0.9) * 0.96);

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        store.progress.journey = self.progress;
        setStage(Math.min(6, Math.floor(reachFor(self.progress) * 6 + 0.001)));
      },
      onRefresh: (self) => {
        store.progress.journey = self.progress;
      },
    });
    return () => st.kill();
  });

  return (
    <section
      ref={ref}
      id="process"
      aria-labelledby="journey-title"
      className="relative h-[420vh]"
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="frame absolute inset-x-0 top-24 flex items-start justify-between gap-6 md:top-28">
          <div>
                        <h2
              id="journey-title"
              className="display max-w-[12ch] text-[clamp(2.4rem,5vw,5rem)] text-orange"
            >
              How search finds you.
            </h2>
          </div>
          <p className="hidden pt-2 text-[1.05rem] font-semibold tabular-nums text-roast md:block">
            Step {stage + 1} <span className="text-roast-soft">of 7</span>
          </p>
        </div>

        {/* Stage labels, anchored to the same points as the particle path */}
        <ol className="absolute inset-0">
          {journey.map((s, i) => {
            const on = i <= stage;
            const a = STAGE_ANCHORS[i];
            const b = STAGE_ANCHORS_PORTRAIT[i];
            const above = a.y < 0.5;
            return (
              <li
                key={s.label}
                className="journey-label absolute"
                style={
                  {
                    "--lx": `${a.x * 100}%`,
                    "--ly": `${a.y * 100}%`,
                    "--px": `${b.x * 100}%`,
                    "--py": `${b.y * 100}%`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={`journey-tag ${above ? "is-above" : "is-below"} ${i % 2 === 0 ? "is-left" : "is-right"} flex flex-col items-center gap-1 whitespace-nowrap transition-[opacity,transform] duration-700 ease-[var(--ease-out)] ${
                    on ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span className={`text-[0.8rem] font-semibold tabular-nums ${on ? "text-orange-hot" : "text-roast-soft"}`}>{i + 1}</span>
                  <span className="text-[clamp(1rem,1.45vw,1.45rem)] font-semibold tracking-[-0.02em] text-roast">
                    {s.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="frame absolute inset-x-0 bottom-8 md:bottom-10">
          <p
            key={stage}
            aria-live="polite"
            className="journey-caption display max-w-[22ch] text-[clamp(1.8rem,3.4vw,3.6rem)] text-roast"
          >
            {journey[stage].caption}
          </p>
        </div>
      </div>

      <style>{`
        .journey-label { left: var(--lx); top: var(--ly); }
        .journey-tag { transform: translate(-50%, 0); }
        .journey-tag.is-above { transform: translate(-50%, calc(-100% - 22px)); }
        .journey-tag.is-below { transform: translate(-50%, 22px); }
        @media (max-aspect-ratio: 9/10) {
          .journey-label { left: var(--px); top: var(--py); }
          .journey-tag.is-left, .journey-tag.is-left.is-above, .journey-tag.is-left.is-below {
            transform: translate(calc(-100% - 18px), -50%); align-items: flex-end;
          }
          .journey-tag.is-right, .journey-tag.is-right.is-above, .journey-tag.is-right.is-below {
            transform: translate(18px, -50%); align-items: flex-start;
          }
        }
        @keyframes caption-in { from { opacity: 0; transform: translateY(14px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
        .journey-caption { animation: caption-in 600ms var(--ease-out) both; }
      `}</style>
    </section>
  );
}
