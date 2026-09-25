import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const body = Funnel_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face" });
const display = Funnel_Display({ subsets: ["latin"], variable: "--font-display-face" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aiseoforme.com"),
  title: "AI SEO For Me — Be the answer AI gives",
  description:
    "AI SEO For Me gets brands found on Google and cited by ChatGPT, Perplexity, Gemini and AI Overviews.",
  openGraph: {
    title: "AI SEO For Me — Be the answer AI gives",
    description: "AI SEO, generative engine optimization and technical SEO for brands that want to be cited.",
    images: ["/stock/team-laptop.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eef0f5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("antialiased font-sans", body.variable, display.variable, mono.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
