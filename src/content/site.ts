/**
 * All site copy lives here.
 *
 * SAMPLE CONTENT: the case studies and stats below are realistic placeholders
 * written for launch. Replace them with real client results before publishing.
 */

export const contact = {
  email: "hello@aiseoforme.com",
  business: "partners@aiseoforme.com",
  address: "Remote-first studio · Working worldwide",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
  ],
};

export const nav = [
  { label: "Work", id: "work" },
  { label: "Services", id: "services" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export const hero = {
  lines: ["We make brands", "findable — by people", "and by AI."],
  metaLeft: "AI SEO / GEO / Technical",
  metaRight: "Search visibility studio",
  scroll: "Scroll to explore",
};

export const reel = {
  label: "Showreel 2026",
  caption: "Search, seen differently.",
};

export type CaseStudy = {
  client: string;
  title: string;
  result: string;
  tags: string[];
  image: string;
  alt: string;
  year: string;
};

export const work: CaseStudy[] = [
  {
    client: "Halden & Row",
    title: "Becoming the answer for solid-oak furniture",
    result: "Cited in 38% of AI answers for its core category",
    tags: ["GEO", "Content"],
    image: "/media/work-rings.jpg",
    alt: "Orange geometric shapes — a cone, half ring and glossy spheres — stacked on an orange set",
    year: "2026",
  },
  {
    client: "Kestrel Clinics",
    title: "Rebuilding a medical site search engines could finally read",
    result: "+212% non-brand organic sessions in seven months",
    tags: ["Technical SEO", "Schema"],
    image: "/media/work-sphere.jpg",
    alt: "A carved orange sphere resting on concentric discs",
    year: "2025",
  },
  {
    client: "Ledgerline",
    title: "From page four to the first screen for money keywords",
    result: "Average position 2.3 across 140 tracked terms",
    tags: ["AI SEO", "Search Visibility"],
    image: "/media/work-paper.jpg",
    alt: "A sheet of orange paper curling into a soft wave",
    year: "2025",
  },
  {
    client: "Oru Travel",
    title: "Automating visibility across 9,000 destination pages",
    result: "4.1× leads arriving from AI search referrals",
    tags: ["Automation", "GEO"],
    image: "/media/work-orbs.jpg",
    alt: "Warm glowing orange orbs stacked between curved wooden forms",
    year: "2024",
  },
];

export type Service = {
  n: string;
  title: string;
  short: string;
  body: string;
  points: string[];
};

export const services: Service[] = [
  {
    n: "01",
    title: "AI SEO",
    short: "AI SEO",
    body: "We shape your pages into the sources language models reach for — structured, well cited and unmistakably yours.",
    points: ["Entity mapping", "LLM visibility tracking", "Answer-ready pages"],
  },
  {
    n: "02",
    title: "Technical SEO",
    short: "Technical",
    body: "Crawl paths, rendering, Core Web Vitals. The plumbing nobody sees and every ranking depends on.",
    points: ["Full-site audits", "Structured data", "Performance budgets"],
  },
  {
    n: "03",
    title: "Generative Engine Optimization",
    short: "GEO",
    body: "Visibility inside ChatGPT, Perplexity, Gemini and AI Overviews — the engines that answer instead of list.",
    points: ["Citation engineering", "Prompt-space research", "Source authority"],
  },
  {
    n: "04",
    title: "Content Strategy",
    short: "Content",
    body: "Fewer pages, sharper ones. Topics mapped to the questions people actually ask, written for people and parsed by machines.",
    points: ["Topic architecture", "Editorial systems", "Content refreshes"],
  },
  {
    n: "05",
    title: "Search Visibility",
    short: "Visibility",
    body: "One honest view of where you appear — links, maps, answer boxes, AI summaries — and where you don't yet.",
    points: ["Share of search", "Competitor mapping", "Monthly readouts"],
  },
  {
    n: "06",
    title: "Automation",
    short: "Automation",
    body: "Pipelines that watch rankings, repair schema and brief writers while your team is asleep.",
    points: ["Rank & citation monitoring", "Internal linking at scale", "Workflow integrations"],
  },
];

export const journey = [
  { label: "Website", caption: "It starts with what you publish." },
  { label: "Crawl", caption: "Bots arrive through links, sitemaps and speed." },
  { label: "Understand", caption: "Entities, intent and context are extracted." },
  { label: "Structure", caption: "Schema turns pages into facts machines trust." },
  { label: "Optimize", caption: "Every signal that moves the needle, tuned." },
  { label: "AI Search", caption: "Models retrieve, weigh and cite their sources." },
  { label: "Visibility", caption: "You become the answer." },
];

export const philosophy = {
  lines: ["Be found", "beyond search."],
  body: "Search stopped being ten blue links. People ask assistants, scan summaries and trust whatever gets cited. We're a small team of search engineers, writers and builders making sure the brands we work with are the ones being cited — clearly, accurately and often.",
  stats: [
    { value: 312, suffix: "", label: "Sites audited" },
    { value: 47.2, suffix: "%", label: "Avg. lift in AI citations" },
    { value: 9, suffix: " yrs", label: "Working in search" },
  ],
};

export const cta = {
  lines: ["Is your brand", "ready to be", "found by AI?"],
  button: "Start a project",
};
