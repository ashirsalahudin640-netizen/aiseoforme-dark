/**
 * All site copy lives here.
 *
 * SAMPLE CONTENT: the case studies and stats are realistic placeholders written
 * for launch. Replace them with real client results before publishing.
 */

export const contact = {
  email: "hello@aiseoforme.com",
  business: "partners@aiseoforme.com",
  address: "Remote-first studio, working worldwide",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
  ],
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  lines: ["Search is being rewritten.", "Be the source it quotes."],
  intro:
    "AI SEO For Me is a search studio. We get brands found on Google, cited by ChatGPT and Perplexity, and chosen by the people asking.",
  engines: ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews", "Copilot"],
};

export const statement =
  "People no longer scroll ten blue links. They ask, and an engine answers with a handful of sources. We make sure yours is one of them — accurately, consistently, and in your own words.";

export type CaseStudy = {
  id: string;
  client: string;
  sector: string;
  title: string;
  result: string;
  detail: string;
  tags: string[];
  image: string;
  alt: string;
  year: string;
};

export const work: CaseStudy[] = [
  {
    id: "halden",
    client: "Halden & Row",
    sector: "Furniture",
    title: "Becoming the answer for solid-oak furniture",
    result: "Cited in 38% of AI answers for its category",
    detail: "Entity cleanup, product schema and buying guides written around the questions shoppers actually ask assistants.",
    tags: ["GEO", "Content"],
    image: "/img/people-plants.jpg",
    alt: "A woman working on a laptop at a wooden desk beside plants and a window",
    year: "2026",
  },
  {
    id: "kestrel",
    client: "Kestrel Clinics",
    sector: "Healthcare",
    title: "A medical site search engines can finally read",
    result: "+212% non-brand organic sessions in seven months",
    detail: "Rebuilt rendering, clinic-level structured data and a crawl path that stopped burying 1,400 pages.",
    tags: ["Technical SEO", "Schema"],
    image: "/img/team-meeting.jpg",
    alt: "A small team of colleagues talking through a plan around a desk",
    year: "2025",
  },
  {
    id: "ledgerline",
    client: "Ledgerline",
    sector: "Fintech",
    title: "From page four to the first screen",
    result: "Average position 2.3 across 140 money keywords",
    detail: "Topic architecture, expert review workflows and comparison pages that earn links on their own.",
    tags: ["AI SEO", "Visibility"],
    image: "/img/man-laptop.jpg",
    alt: "A man in a white t-shirt typing on a laptop beside a sunny window",
    year: "2025",
  },
  {
    id: "oru",
    client: "Oru Travel",
    sector: "Travel",
    title: "Automating visibility across 9,000 pages",
    result: "4.1× leads arriving from AI search referrals",
    detail: "Programmatic templates, internal linking at scale and monitoring that flags drops before traffic does.",
    tags: ["Automation", "GEO"],
    image: "/img/man-desk.jpg",
    alt: "A man working on a laptop while sitting on a red desk in a warm-toned room",
    year: "2024",
  },
];

export type Service = {
  title: string;
  body: string;
  points: string[];
  image: string;
  alt: string;
};

export const services: Service[] = [
  {
    title: "AI SEO",
    body: "We shape your pages into the sources language models reach for — structured, well cited and unmistakably yours.",
    points: ["Entity mapping", "LLM visibility tracking", "Answer-ready pages"],
    image: "/img/glass-rainbow.jpg",
    alt: "Light passing through a glass prism and splitting into a rainbow",
  },
  {
    title: "Technical SEO",
    body: "Crawl paths, rendering and Core Web Vitals. The plumbing nobody sees and every ranking depends on.",
    points: ["Full-site audits", "Structured data", "Performance budgets"],
    image: "/img/arch-stairs.jpg",
    alt: "A concrete stairway seen from below against a pale sky",
  },
  {
    title: "Generative Engine Optimization",
    body: "Visibility inside ChatGPT, Perplexity, Gemini and AI Overviews — the engines that answer instead of list.",
    points: ["Citation engineering", "Prompt-space research", "Source authority"],
    image: "/img/glass-color.jpg",
    alt: "Coloured light bending through glass prisms",
  },
  {
    title: "Content Strategy",
    body: "Fewer pages, sharper ones. Topics mapped to the questions people ask, written for people and parsed by machines.",
    points: ["Topic architecture", "Editorial systems", "Content refreshes"],
    image: "/img/arch-interior.jpg",
    alt: "A bright white interior with angled walls and skylights",
  },
  {
    title: "Search Visibility",
    body: "One honest view of where you appear — links, maps, answer boxes, AI summaries — and where you don't yet.",
    points: ["Share of search", "Competitor mapping", "Monthly readouts"],
    image: "/img/arch-sky.jpg",
    alt: "A white wall with a circular opening framing blue sky",
  },
  {
    title: "Automation",
    body: "Pipelines that watch rankings, repair schema and brief writers while your team is asleep.",
    points: ["Rank and citation monitoring", "Internal linking at scale", "Workflow integrations"],
    image: "/img/arch-spiral.jpg",
    alt: "Looking up a white triangular stairwell",
  },
];

export const process = [
  {
    step: "Listen",
    title: "We ask the engines about you",
    body: "Hundreds of real prompts across ChatGPT, Perplexity, Gemini and Google show who gets cited today, and why.",
  },
  {
    step: "Map",
    title: "We find the gaps that matter",
    body: "Missing entities, weak sources, pages machines can't parse. Ranked by the revenue they're costing you.",
  },
  {
    step: "Build",
    title: "We fix, write and structure",
    body: "Technical repairs, schema and content shipped in weekly releases alongside your team.",
  },
  {
    step: "Compound",
    title: "We watch it grow",
    body: "Citation and ranking monitoring, with a short readout each month on what moved and what's next.",
  },
];

export const stats = [
  { value: 312, suffix: "", decimals: 0, label: "Sites audited" },
  { value: 47.2, suffix: "%", decimals: 1, label: "Average lift in AI citations" },
  { value: 9, suffix: " yrs", decimals: 0, label: "Working in search" },
];

export const gallery = [
  "/img/arch-brick.jpg",
  "/img/glass-long.jpg",
  "/img/people-stairs.jpg",
  "/img/arch-facade.jpg",
  "/img/glass-rainbow.jpg",
  "/img/people-plants.jpg",
  "/img/arch-sky.jpg",
  "/img/glass-dark.jpg",
  "/img/team-table.jpg",
  "/img/arch-spiral.jpg",
  "/img/glass-color.jpg",
  "/img/man-window.jpg",
  "/img/arch-interior.jpg",
  "/img/team-cafe.jpg",
  "/img/arch-stairs.jpg",
  "/img/man-desk.jpg",
  "/img/people-window.jpg",
  "/img/team-meeting.jpg",
  "/img/man-laptop.jpg",
];
