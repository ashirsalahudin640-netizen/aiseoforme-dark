"use client";

import dynamic from "next/dynamic";

const ScrollDissolveReveal = dynamic(
  () => import("@/components/ui/scroll-dissolve-reveal").then((m) => m.ScrollDissolveReveal),
  { ssr: false, loading: () => <div className="h-[260vh] bg-mist" /> },
);

/**
 * VengeanceUI ScrollDissolveReveal: one image burns away into the next as the
 * section scrolls — unseen architecture dissolving into refracted light.
 */
export function Showcase() {
  return (
    <section aria-labelledby="showcase-title" className="relative">
      <ScrollDissolveReveal
        imageFront="/img/arch-spiral.jpg"
        imageBack="/img/glass-rainbow.jpg"
        containerClassName="h-[260vh]"
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 flex h-[100dvh] items-end">
          <div className="frame w-full pb-28 md:pb-32">
            <div className="crystal max-w-[34rem] rounded-3xl p-6 md:p-8">
              <h2 id="showcase-title" className="display text-[clamp(2rem,4vw,3.6rem)] text-ink">
                From unseen to <span className="text-crystal">cited.</span>
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                Most sites are built for crawlers that no longer decide who gets read. We rebuild how
                machines understand you, so the answer engines pass the light through.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
