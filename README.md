# AI SEO For Me — Immersive Site

Single-page immersive website for AI SEO For Me. Built with Next.js, React Three Fiber, GSAP ScrollTrigger and Lenis.

Design spec: `docs/superpowers/specs/2026-09-24-aiseoforme-immersive-design.md`

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things live

- `src/content/site.ts` holds all copy. **The case studies and stats are sample content.** Replace them with real results before launch.
- `src/components/sections/*` has one file per page section.
- `src/components/three/*` is the single shared WebGL canvas: the hero/services cluster, the journey particles and the CTA ring tunnel.
- `src/lib/store.ts` is the shared scroll and pointer state that the DOM writes and WebGL reads.
- `public/media` holds the reel video and case-study images (free Magnific stock). `public/brand` holds the logo SVGs.

## Behaviour notes

- **Loader:** runs on the first visit per browser session only.
- **Mobile and low-power devices:** get fewer shapes and particles, and keep native touch scrolling.
- **`prefers-reduced-motion`:** turns off smooth scroll, the loader and all motion. The content stays fully readable.
- **Without WebGL:** the page falls back to flat colour.
