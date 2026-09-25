"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { voices } from "@/content/site";
import { RiseText } from "./RiseText";

/**
 * The Upstream feedback card, in AIB colours: a white panel inside a
 * navy-to-orange hairline, lit from behind by two soft brand glows.
 */
export function Feedback() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const v = voices[i];
  const [name, role] = v.title.split(", ");

  const go = (d: number) => {
    setDir(d);
    setI((n) => (n + d + voices.length) % voices.length);
  };

  return (
    <section id="voices" className="frame relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute left-[8%] top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-navy-soft/25 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[6%] top-[30%] size-[26rem] rounded-full bg-orange/25 blur-[110px]" aria-hidden="true" />

      <div className="brand-ring mx-auto max-w-[1240px] shadow-[0_40px_80px_-40px_rgba(11,7,110,0.35)]">
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-white">
          <BorderBeam size={260} duration={14} colorFrom="#ff7d00" colorTo="#2b27a3" borderWidth={1.5} />
          <div className="grid gap-10 p-7 md:grid-cols-[0.8fr_1.2fr] md:p-14">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <h2 className="display text-[clamp(2.2rem,3.6vw,3.2rem)] font-medium text-navy"><RiseText text="What clients noticed first" /></h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="press grid size-11 place-items-center rounded-full border border-line text-ink transition-colors duration-200 hover:border-navy/30 hover:bg-pearl"
                >
                  <ArrowLeft size={16} weight="bold" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="press grid size-11 place-items-center rounded-full bg-navy text-white transition-colors duration-200 hover:bg-navy-soft"
                >
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </button>
                <span className="tabular ml-2 text-[0.9rem] text-ink-faint">
                  {i + 1} of {voices.length}
                </span>
              </div>
            </div>

            <div className="relative min-h-[17rem]" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.figure
                  key={v.id}
                  custom={dir}
                  initial={{ opacity: 0, transform: `translateX(${dir * 24}px)` }}
                  animate={{ opacity: 1, transform: "translateX(0px)" }}
                  exit={{ opacity: 0, transform: `translateX(${dir * -16}px)`, transition: { duration: 0.16 } }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                >
                  <blockquote className="text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.55] text-ink">
                    {v.description}
                  </blockquote>
                  <figcaption className="mt-9 flex items-center gap-4">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-4 ring-pearl">
                      <Image src={v.image} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span>
                      <span className="block text-[1rem] font-semibold text-ink">{name}</span>
                      <span className="block text-[0.92rem] text-ink-soft">{role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
