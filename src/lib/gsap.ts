"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  // Signature ease for the big, deliberate moves: wipes, reveals, loader.
  CustomEase.create("hop", "0.9, 0, 0.1, 1");
}

export { gsap, ScrollTrigger, useGSAP };
