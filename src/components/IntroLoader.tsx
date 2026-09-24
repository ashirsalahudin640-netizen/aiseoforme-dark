"use client";

import { useEffect, useState } from "react";
import RevealLoader from "@/components/ui/reveal-loader";
import { markReady } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/device";

const SEEN_KEY = "aisfm:intro-seen";

/**
 * VengeanceUI RevealLoader on first visit: the wordmark, then ten ink-to-navy
 * bars lift away to uncover the page. Skipped on repeat visits and for reduced
 * motion.
 */
export function IntroLoader() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const skip = seen || prefersReducedMotion();
    if (skip) markReady();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client check
    setShow(!skip);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[90]" aria-hidden="true">
      <RevealLoader
        text="AI SEO FOR ME"
        textSize="clamp(3rem, 11vw, 10rem)"
        textColor="#FBFAF7"
        bgColors={["#17171B", "#0B076E"]}
        angle={160}
        staggerOrder="center-out"
        movementDirection="bottom-up"
        textFadeDelay={0.2}
        onComplete={() => {
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {}
          setShow(false);
        }}
      />
      <ReadyAtReveal />
    </div>
  );
}

/** Start the page's own entrance just as the bars begin to lift. */
function ReadyAtReveal() {
  useEffect(() => {
    const t = window.setTimeout(markReady, 1500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
