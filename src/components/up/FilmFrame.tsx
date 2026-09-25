"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  /** Base name in /public/video, e.g. "valley" → valley.mp4 + valley.jpg. */
  name: string;
  className?: string;
  /** Tint laid over the footage so type and cards stay legible. */
  overlay?: string;
  children?: React.ReactNode;
  priority?: boolean;
};

/**
 * Rounded, inset film window. Footage only plays while it is on screen, and
 * readers who ask for reduced motion get the still poster instead.
 */
export function FilmFrame({ name, className, overlay, children, priority }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  // The frame opens from a tighter window as it scrolls in; the footage settles from a slight zoom.
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = { trigger: frame.current, start: "top bottom", end: "top 25%", scrub: true };
    gsap.fromTo(
      frame.current,
      { clipPath: "inset(7% 6% 7% 6% round 48px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: st },
    );
    gsap.fromTo(video.current, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { ...st } });
  });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={frame} className={cn("relative isolate overflow-hidden rounded-[1.75rem] bg-navy md:rounded-[2.25rem]", className)}>
      <video
        ref={video}
        className="absolute inset-0 -z-20 size-full object-cover"
        src={`/video/${name}.mp4`}
        poster={`/video/${name}.jpg`}
        muted
        loop
        playsInline
        autoPlay
        preload={priority ? "auto" : "metadata"}
        aria-hidden="true"
      />
      {overlay && <div className={cn("pointer-events-none absolute inset-0 -z-10", overlay)} />}
      {children}
    </div>
  );
}
