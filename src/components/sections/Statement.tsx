"use client";

import { statement } from "@/content/site";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";

/** A single idea, read line by line as it scrolls into focus. */
export function Statement() {
  return (
    <section aria-label="What we believe" className="frame relative py-36 md:py-56">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="eyebrow md:col-span-3">Why it matters now</p>
        <GooeyTextReveal
          mode="scrub"
          start="top 85%"
          end="bottom 55%"
          blurAmount={0.9}
          className="md:col-span-9"
        >
          <p className="text-[clamp(1.8rem,3.6vw,3.6rem)] font-light leading-[1.12] tracking-[-0.035em] text-ink">
            {statement}
          </p>
        </GooeyTextReveal>
      </div>
    </section>
  );
}
