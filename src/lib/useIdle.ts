"use client";

import { useEffect, type RefObject } from "react";

/** Marks an element `data-idle="true"` while offscreen so its CSS loops pause. */
export function useIdle(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.idle = entry.isIntersecting ? "false" : "true";
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
