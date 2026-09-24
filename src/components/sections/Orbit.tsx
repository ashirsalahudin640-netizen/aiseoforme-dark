"use client";

import dynamic from "next/dynamic";
import StatsCounter from "@/components/ui/stats-counter";
import { gallery, stats } from "@/content/site";

// VengeanceUI CircularGallery: a tilted 3D ring of images that spins on its own,
// follows the pointer, and previews any image you hover.
const CircularGallery = dynamic(
  () => import("@/components/ui/circular-gallery").then((m) => m.CircularGallery),
  { ssr: false, loading: () => <div className="h-[80vh]" /> },
);

export function Orbit() {
  return (
    <section id="about" aria-labelledby="orbit-title" className="relative overflow-hidden py-28 md:py-36">
      <div className="frame grid gap-10 md:grid-cols-12">
        <p className="eyebrow md:col-span-3">The studio</p>
        <div className="md:col-span-9">
          <h2 id="orbit-title" className="display text-[clamp(2.6rem,5.6vw,6rem)] text-ink">
            Search engineers, writers and builders in one orbit.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-soft">
            A small, senior team. No account managers relaying messages — the people who audit your
            site are the people who fix it. Hover the ring to look closer.
          </p>
        </div>
      </div>

      <div className="frame mt-8 md:mt-12">
        <div className="relative h-[76vh] min-h-[520px] overflow-hidden rounded-[2rem] bg-[#f0f0f2] ring-1 ring-orange/15">
        <CircularGallery
          images={gallery}
          count={90}
          radius={440}
          tilt={58}
          itemWidth={52}
          itemHeight={70}
          autoRotateSpeed={2.2}
          className="h-full w-full"
        />
        </div>
      </div>

      <dl className="frame mt-14 grid gap-10 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border-t border-line pt-6">
            <dt className="eyebrow">{s.label}</dt>
            <dd className="display text-crystal mt-3 text-[clamp(3rem,6vw,5.5rem)]">
              <StatsCounter value={s.value} suffix={s.suffix} decimals={s.decimals} duration={2} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
