"use client";

import { useEffect, useRef } from "react";

/**
 * Heading reveal: each word rises out of its own mask the first time the
 * heading scrolls into view. Transform only, so it stays smooth, and the
 * text is real text for readers and search engines from the start.
 */
export function RiseText({ text }: { text: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={el} data-in="false">
      {text.split(" ").map((w, i) => (
        <span key={i} className="mask-line !inline-block align-top">
          <span style={{ ["--i" as string]: i }}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
