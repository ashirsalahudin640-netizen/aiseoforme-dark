"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { store } from "@/lib/store";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export const SCENE_EVENT = "scene:ready";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * One fixed WebGL layer behind the hero and the "why now" chapter. Scroll
 * positions are written to the store; the scene eases toward them itself.
 */
export function SceneLayer() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers = [
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          store.scene.hero = self.progress;
        },
      }),
      ScrollTrigger.create({
        trigger: "#shift",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          store.scene.list = smooth(0.04, 0.26, p) * (1 - smooth(0.5, 0.66, p));
          store.scene.answer = smooth(0.52, 0.72, p);
        },
        onLeaveBack: () => {
          store.scene.list = 0;
          store.scene.answer = 0;
        },
      }),
      // Fade the layer away as the services panel rises over it, then stop rendering.
      ScrollTrigger.create({
        trigger: "#services",
        start: "top bottom",
        end: "top 20%",
        onUpdate: (self) => {
          const p = self.progress;
          if (wrap.current) {
            wrap.current.style.opacity = String(1 - p);
            wrap.current.style.transform = `translate3d(0, ${-p * 8}vh, 0)`;
          }
          store.scene.active = p < 0.999;
        },
      }),
    ];
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 will-change-[opacity,transform]"
    >
      <Scene onReady={() => window.dispatchEvent(new Event(SCENE_EVENT))} />
    </div>
  );
}
