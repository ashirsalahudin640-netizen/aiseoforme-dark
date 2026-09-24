"use client";

import type { RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store, type SectionKey } from "@/lib/store";

/** Mirrors a section's scroll progress (0..1) into the shared store for WebGL. */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  key: SectionKey,
  start = "top bottom",
  end = "bottom top",
) {
  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      onUpdate: (self) => {
        store.progress[key] = self.progress;
      },
      onRefresh: (self) => {
        store.progress[key] = self.progress;
      },
    });
    return () => st.kill();
  });
}
