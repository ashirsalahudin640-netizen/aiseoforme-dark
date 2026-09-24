"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const Experience = dynamic(() => import("./Experience"), { ssr: false });

/** If WebGL is missing or crashes, the page falls back to flat colour. */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    document.documentElement.classList.add("no-webgl");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CanvasRoot() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const supported = webglAvailable();
    if (!supported) document.documentElement.classList.add("no-webgl");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability probe
    setOk(supported);
  }, []);

  if (!ok) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <WebGLBoundary>
        <Experience />
      </WebGLBoundary>
    </div>
  );
}
