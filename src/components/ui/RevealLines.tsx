"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onReady, store } from "@/lib/store";

type Props = {
  lines: string[];
  id?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  /** "scroll" reveals when scrolled into view, "ready" after the loader. */
  trigger?: "scroll" | "ready";
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start for trigger="scroll". */
  start?: string;
};

/** Masked line-by-line reveal for display type. */
export function RevealLines({
  lines,
  id,
  as: Tag = "h2",
  className,
  lineClassName,
  trigger = "scroll",
  delay = 0,
  stagger = 0.08,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const inners = ref.current!.querySelectorAll(".line-inner");
      if (store.reduced) return;
      // One explicit from→to tween; `y: 0` on both ends guarantees no pixel
      // offset survives a Strict Mode revert/re-run.
      const tween = gsap.fromTo(
        inners,
        { y: 0, yPercent: 110, rotate: 2.5, transformOrigin: "0% 0%" },
        {
          y: 0,
          yPercent: 0,
          rotate: 0,
          duration: 1.1,
          delay,
          stagger,
          ease: "expo.out",
          paused: true,
          immediateRender: true,
        },
      );

      if (trigger === "ready") return onReady(() => tween.play());
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start,
        once: true,
        onEnter: () => tween.play(),
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className={`line-inner ${lineClassName ?? ""}`}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
