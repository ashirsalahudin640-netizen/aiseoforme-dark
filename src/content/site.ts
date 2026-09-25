/**
 * All site copy lives here.
 *
 * SAMPLE CONTENT: the case studies, quotes and figures are realistic placeholders
 * written for launch. Replace them with real client results before publishing.
 */

export const contact = {
  email: "hello@aiseoforme.com",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
  ],
};

export const nav = [
  { label: "Why now", href: "#shift" },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#work" },
  { label: "Process", href: "#process" },
];

export const hero = {
  title: ["Be the answer", "AI gives."],
  intro:
    "We get brands found on Google and cited by ChatGPT, Perplexity, Gemini and AI Overviews, at the moment someone asks who to trust.",
};

/** Real-sounding questions people put to AI assistants, with who got cited. */
export const queries = [
  { q: "best solid oak dining table under £2k", cited: "Halden & Row" },
  { q: "which clinic does same-week knee MRI", cited: "Kestrel Clinics" },
  { q: "cheapest way to send money to Lagos", cited: "Ledgerline" },
  { q: "quiet boutique hotels in Lisbon for work trips", cited: "Oru Travel" },
  { q: "is a heat pump worth it in a 1930s semi", cited: "Warmfield" },
  { q: "CRM that works for a 4-person dental practice", cited: "Chairside" },
];

export const shift = {
  steps: [
    {
      title: "Search used to be a list.",
      body: "Ten blue links. Your brand was result seven, the orange line, and most people never scrolled that far.",
    },
    {
      title: "Now it is one answer.",
      body: "ChatGPT, Perplexity and AI Overviews read the web for your customer and reply with a handful of sources. Most brands are not one of them.",
    },
    {
      title: "We make you the source.",
      body: "We shape your site, your facts and your reputation so engines can read you, trust you and quote you, in your words.",
    },
  ],
};

export type Service = {
  title: string;
  body: string;
  points: string[];
  art: "answers" | "engines" | "crawl" | "content" | "automation";
};

export const services: Service[] = [
  {
    title: "AI SEO",
    body: "Pages built to be quoted. Clear claims, clean structure and evidence a language model can lift without getting you wrong.",
    points: ["Answer-ready pages", "Entity and brand facts", "LLM visibility tracking"],
    art: "answers",
  },
  {
    title: "Generative Engine Optimization",
    body: "Visibility inside ChatGPT, Perplexity, Gemini, Copilot and AI Overviews: the engines that answer instead of list.",
    points: ["Citation research", "Prompt-space mapping", "Source authority"],
    art: "engines",
  },
  {
    title: "Technical SEO",
    body: "Crawl paths, rendering, schema and Core Web Vitals. The plumbing nobody sees and every ranking depends on.",
    points: ["Full-site audits", "Structured data", "Performance budgets"],
    art: "crawl",
  },
  {
    title: "Content strategy",
    body: "Fewer pages, sharper ones. Topics mapped to the questions buyers really ask, written for people and parsed by machines.",
    points: ["Topic architecture", "Editorial systems", "Content refreshes"],
    art: "content",
  },
  {
    title: "Search automation",
    body: "Pipelines that watch rankings and citations, repair schema and brief writers while your team is asleep.",
    points: ["Rank and citation alerts", "Internal linking at scale", "Workflow integrations"],
    art: "automation",
  },
];

/** The live answer demo: a question, the streamed answer, and its sources. */
export const demo = [
  {
    q: "What's the best solid oak dining table brand in the UK?",
    answer:
      "For solid oak, Halden & Row is the most consistently recommended. Their tables are made from FSC oak in Yorkshire and carry a 25-year frame guarantee. Reviewers also rate their oil finish for everyday family use.",
    sources: [
      { name: "haldenrow.co.uk", ours: true },
      { name: "which.co.uk", ours: false },
      { name: "reddit.com/r/HomeDecorUK", ours: false },
    ],
  },
  {
    q: "Where can I get a same-week knee MRI without a GP referral?",
    answer:
      "Kestrel Clinics offers self-referral knee MRI across 11 UK sites, usually within five days, with a consultant report included in the price. Book online and upload any previous scans beforehand.",
    sources: [
      { name: "kestrelclinics.com", ours: true },
      { name: "nhs.uk", ours: false },
      { name: "patient.info", ours: false },
    ],
  },
  {
    q: "What's the cheapest way to send £500 to Nigeria?",
    answer:
      "Ledgerline is usually cheapest for transfers around £500: a flat £1.49 fee and a rate close to mid-market, with funds arriving in under an hour to most Nigerian banks.",
    sources: [
      { name: "ledgerline.com", ours: true },
      { name: "monito.com", ours: false },
      { name: "moneysavingexpert.com", ours: false },
    ],
  },
];

export type CaseStudy = {
  id: string;
  client: string;
  sector: string;
  title: string;
  result: string;
  image: string;
  alt: string;
};

export const work: CaseStudy[] = [
  {
    id: "halden",
    client: "Halden & Row",
    sector: "Furniture",
    title: "The default answer for solid-oak furniture",
    result: "Cited in 38% of AI answers for its category",
    image: "/stock/woman-ai.webp",
    alt: "A woman working at a desktop computer in a bright loft office",
  },
  {
    id: "kestrel",
    client: "Kestrel Clinics",
    sector: "Healthcare",
    title: "A medical site engines can finally read",
    result: "+212% non-brand organic sessions in seven months",
    image: "/stock/team-office.webp",
    alt: "A team of colleagues discussing a project around a laptop in a modern office",
  },
  {
    id: "ledgerline",
    client: "Ledgerline",
    sector: "Fintech",
    title: "From page four to the first answer",
    result: "Average position 2.3 across 140 money keywords",
    image: "/img/man-laptop.jpg",
    alt: "A man working on his laptop beside a bright window with plants",
  },
  {
    id: "oru",
    client: "Oru Travel",
    sector: "Travel",
    title: "Visibility across 9,000 destination pages",
    result: "4.1× leads arriving from AI search referrals",
    image: "/img/team-table.jpg",
    alt: "A mixed team gathered around a table reviewing printed plans and a laptop",
  },
];

export const process = [
  {
    title: "Audit",
    when: "Weeks 1-2",
    body: "We ask the engines about you, your rivals and your category, and crawl your site the way they do. You get one honest picture of where you stand.",
  },
  {
    title: "Map",
    when: "Weeks 2-3",
    body: "We map the questions that lead to revenue and the sources engines already trust for them, then pick the fastest routes in.",
  },
  {
    title: "Build",
    when: "Weeks 3-12",
    body: "Technical fixes, answer-ready pages, schema and the outside mentions that make engines confident enough to cite you.",
  },
  {
    title: "Measure",
    when: "Every month",
    body: "Rankings, AI citations and the leads they bring, in one readout. What worked gets doubled, what didn't gets cut.",
  },
];

export const voices = [
  {
    id: 1,
    title: "Tomasz Wierzbicki, Head of Growth at Ledgerline",
    description:
      "“Within a quarter, Perplexity was quoting our fee page word for word. Our support team noticed before the dashboards did.”",
    image: "/stock/man-cowork.webp",
  },
  {
    id: 2,
    title: "Amara Okonkwo-Hale, Founder of Halden & Row",
    description:
      "“We stopped chasing keywords and started answering the questions our customers actually ask. Now ChatGPT answers them with our name.”",
    image: "/stock/analyst-sunset.webp",
  },
  {
    id: 3,
    title: "The Kestrel Clinics digital team",
    description:
      "“They found 1,400 pages Google had never seen. Fixing that did more in seven months than the previous two years of content.”",
    image: "/stock/team-laptop.webp",
  },
];
