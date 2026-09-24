# AI SEO For Me — Immersive Website Design

Date: 2026-09-24
Status: Approved in conversation, awaiting written-spec review

## Goal

A single-page, award-level immersive website for **AI SEO For Me** (AI-powered SEO and search visibility). It follows the structure, interaction patterns and feel of lusion.co, but every asset, 3D form and line of copy is original. It must never read as a generic AI SaaS template.

Success means:

- It feels like a creative studio's digital-art experience, with one continuous 3D camera journey.
- It holds 60fps on a mid-range laptop and stays smooth on mobile.
- The production build passes with no console errors.

## Brand

| Token | Value | Use |
|---|---|---|
| `--pearl` | `#FFFDF7` | Page background, light surfaces |
| `--orange` | `#FF7D00` | Brand accent: 3D materials, buttons, cursor, highlights |
| `--navy` | `#0B076E` | Headlines, body text, final CTA section background |
| `--navy-soft` | navy at 60% opacity | Secondary/meta text |

- No purple, cyan or blue SaaS gradients, and no dark theme apart from the navy CTA.
- **Logo:** use the original SVGs from `Downloads/AI SEO FOR ME/AI SEO FOR ME/` without recolouring. Use the light-background version on pearl sections and the dark-background version on navy.
- **Favicon:** `Fav-icon white.jpg`.
- **Font:** one grotesk family, Geist (via `next/font`). Headlines are huge with tight tracking; meta labels are tiny, uppercase and monospaced (Geist Mono).

## Page Structure (in order)

1. **Loader.** Pearl screen with a small counter from 0 to 100 tied to real asset loading. An orange panel then wipes up with a clip-path to reveal the hero, and nav and headline stagger in. The total is under about 2.5s, and the loader is skipped after the first visit in a session.
2. **Header (fixed).**
   - Logo on the left.
   - On the right, an orange pill button "LET'S TALK" (magnetic) and a round menu button.
   - The menu opens a full-screen pearl overlay with huge links (Work, Services, About, Contact), revealed by a clip-path, plus contact meta.
   - The header hides on scroll down and shows on scroll up.
3. **Hero.**
   - Full viewport with the shared 3D canvas behind it.
   - The scene is a loose floating cluster of glossy shapes in orange, navy and pearl: capsules, spheres, and extruded shapes built from the logo's "A" and "B" paths (the brand signature).
   - The cursor pushes shapes away with spring physics (no physics engine; simple per-body springs).
   - The cluster slowly drifts and rotates.
   - Headline at the bottom left: "We make brands findable — by people and by AI." Tiny meta in the corners: "AI SEO / GEO / TECHNICAL", "SCROLL TO EXPLORE".
4. **Reel.** A Magnific free-stock video in a rounded card, about 60% wide, that scales to full-bleed as you scroll (ScrollTrigger scrub). The cursor becomes "PLAY" and a click opens it full-screen with sound controls. Nothing autoplays with sound; the inline preview is muted.
5. **Featured Work.**
   - Heading "Featured Work", with 4 case studies laid out in two staggered columns (right column offset down).
   - Each card has a large image, title, client and tags (e.g. GEO, Technical SEO, Content), plus a result line such as "+212% AI citations".
   - On hover the image scales, an orange overlay tints it, the title slides and the cursor becomes "VIEW".
   - The case studies are realistic but fictional (no real client claims) and are marked in the content file as sample content.
6. **Services.**
   - Six full-width lines: 01 AI SEO, 02 Technical SEO, 03 Generative Engine Optimization, 04 Content Strategy, 05 Search Visibility, 06 Automation.
   - Hovering a line highlights it (the others dim), reveals a one-sentence description and a small detail list, and sends a "service index" to the 3D scene, which morphs the cluster into a distinct formation per service.
   - On touch devices, tapping expands a line.
7. **Search Journey.**
   - A pinned section. As you scroll, orange particles stream through seven labelled stages: Website → Crawl → Understand → Structure → Optimize → AI Search → Visibility.
   - Each stage label activates in turn with a short caption.
   - The particles are rendered in the shared canvas along a curved 3D path, not as a flowchart.
8. **Philosophy.**
   - A huge two-line statement, "Be found / beyond search.", whose words drift apart and skew with scroll velocity, with orange shapes passing behind.
   - A short about paragraph and three stat numbers.
9. **Navy CTA.**
   - Navy background with an orange 3D ring tunnel that the camera flies into on scroll.
   - Text: "Is your brand ready to be found by AI?" and a large magnetic "Start a project" button that links to the email.
10. **Footer (navy).** General email, business email, address line, socials, a newsletter input (client-side validation only, no backend) and © line.

## Architecture

- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS v4, and a single route `/`.
- **One persistent WebGL canvas** (`<Experience />`, React Three Fiber, dynamically imported with `ssr: false`) fixed behind the DOM.
  - Scene modules (Hero cluster, Service formations, Journey particles, Ring tunnel) read a shared scroll/interaction store and position themselves by section.
  - The camera follows a scroll-driven path.
- **Shared state:** a plain mutable module (no extra dependency) holding scroll progress per section, pointer position, active service and device tier. Components read it inside `useFrame` so there are no React re-renders per frame.
- **Scroll:** Lenis (light settings: `lerp` ~0.1, native feel on touch) drives the GSAP ticker, and ScrollTrigger handles DOM animations and writes section progress to the store.
- **Motion:** GSAP for scroll and timelines. Framer Motion only where it simplifies component enter/exit (menu overlay).
- **Folder layout:**
  - `src/app` (layout, page, globals.css with tokens)
  - `src/components/sections/*` (one file per section)
  - `src/components/ui/*` (Cursor, MagneticButton, Logo, SplitText)
  - `src/components/three/*` (Experience, HeroCluster, ServiceForms, JourneyParticles, RingTunnel, materials)
  - `src/lib` (store, content, device tier, lenis setup)
  - `src/content/site.ts` (all copy in one place)

## Interaction Details

- **Cursor:**
  - A small orange dot follows the pointer immediately (no lag on the dot).
  - A ring trails it with slight easing.
  - On `[data-cursor]` elements the ring grows and shows the label (VIEW, PLAY, OPEN, DRAG).
  - Hidden on touch and coarse pointers, and native cursor stays on text inputs.
- **Magnetic buttons:** the button translates toward the pointer within a radius and springs back on leave.
- **Split-text reveals:** mask-and-translate per line for headlines. Body text uses a single fade and translate, not per-word.
- **Pacing:** calm → dramatic → calm → interactive → dramatic. Not every element animates.

## Media

- Images and the reel video come only from the Magnific free stock library (download free assets; never generate, never premium).
- Images are converted to WebP/AVIF through `next/image`. The video is compressed MP4 (≤ 8MB) with a poster image.

## Performance and Accessibility

- **Device tier:** "high" (desktop GPU) or "low" (mobile/touch or low `hardwareConcurrency`).
  - Low tier: fewer shapes (~8 vs ~18), particles 1.5k vs 6k, no transmission/refraction materials, DPR capped at 1.5.
  - High tier caps DPR at 2.
- The canvas pauses rendering when the tab is hidden.
- Geometries and materials are created once and disposed on unmount.
- **`prefers-reduced-motion`:**
  - No Lenis (native scroll), no scroll-scrubbed transforms, a static 3D frame, and the loader goes straight to content.
  - Everything stays readable.
- **Accessibility:**
  - Semantic landmarks, a real `<nav>`, and a focus trap in the menu overlay.
  - Visible focus rings (orange).
  - All interactive elements work with the keyboard.
  - Colour contrast: navy on pearl for text. Orange is never used for body text on pearl.
- Scrolling must never feel delayed. If Lenis feels laggy on a device, fall back to native scroll for that tier.

## Testing and Verification

- `npm run build` and `npm run lint` pass.
- Manual check in the browser at 1440px and 390px widths: every section renders, and hover, cursor, menu, reel and services interactions work.
- No console errors or warnings in the dev server.
- FPS spot-check with the browser performance monitor on desktop.
- Reduced-motion check via DevTools emulation.

## Out of Scope

- Case-study detail pages, a CMS, a backend for the newsletter or contact form, sound design, and multiple languages.
