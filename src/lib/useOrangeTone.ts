"use client";

import type { RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Flips the header to its pearl variant while `ref` sits under it. */
export function useOrangeTone(ref: RefObject<HTMLElement | null>, start = "top 64px", end = "bottom 64px") {
  useGSAP(() => {
    const root = document.documentElement;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      onToggle: (self) => root.classList.toggle("tone-orange", self.isActive),
    });
    return () => {
      st.kill();
      root.classList.remove("tone-orange");
    };
  });
}
