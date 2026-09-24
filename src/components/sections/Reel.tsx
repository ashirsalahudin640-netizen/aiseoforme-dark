"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { reel } from "@/content/site";

export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const full = useRef<HTMLVideoElement>(null);

  // The card opens up to full bleed as the section scrolls through.
  useGSAP(
    () => {
      if (store.reduced) {
        gsap.set(card.current, { clipPath: "inset(0% 0% 0% 0% round 0px)" });
        return;
      }
      gsap.fromTo(
        card.current,
        { clipPath: "inset(18% 22% 18% 22% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "60% bottom", scrub: true },
        },
      );
      gsap.fromTo(
        ".reel-title",
        { yPercent: 40 },
        {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  // Only decode video while it's on screen.
  useEffect(() => {
    const v = video.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const d = dialog.current!;
    if (open) {
      d.showModal();
      store.lenis?.stop();
      full.current?.play().catch(() => {});
    } else if (d.open) {
      full.current?.pause();
      d.close();
      store.lenis?.start();
    }
  }, [open]);

  return (
    <section ref={ref} aria-label="Showreel" className="relative h-[200vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        <button
          ref={card}
          type="button"
          data-cursor="Play"
          onClick={() => setOpen(true)}
          aria-label="Play the showreel"
          className="group absolute inset-0 block overflow-hidden bg-orange"
          style={{ clipPath: "inset(18% 22% 18% 22% round 28px)" }}
        >
          <video
            ref={video}
            className="h-full w-full scale-[1.02] object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.06]"
            src="/media/reel.mp4"
            poster="/media/reel-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-navy/45 via-navy/5 to-transparent" />
          <span className="reel-title display pointer-events-none absolute inset-x-0 bottom-[8%] text-center text-[clamp(3rem,11vw,12rem)] text-pearl">
            {reel.caption}
          </span>
          <span className="meta absolute left-[var(--gutter)] top-[6%] text-pearl">{reel.label}</span>
          <span className="meta absolute right-[var(--gutter)] top-[6%] flex items-center gap-2 text-pearl">
            <span className="block h-2 w-2 animate-pulse rounded-full bg-pearl" /> Play with sound
          </span>
        </button>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-navy/95 p-0 backdrop:bg-transparent"
        aria-label="Showreel"
      >
        <div className="flex h-full w-full items-center justify-center p-4 md:p-12">
          <video
            ref={full}
            className="max-h-full w-full max-w-[1400px] rounded-2xl"
            src="/media/reel.mp4"
            poster="/media/reel-poster.jpg"
            controls
            loop
            playsInline
            preload="none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="press meta absolute right-5 top-5 rounded-full bg-pearl px-5 py-3 font-semibold text-navy"
          >
            Close
          </button>
        </div>
      </dialog>
    </section>
  );
}
