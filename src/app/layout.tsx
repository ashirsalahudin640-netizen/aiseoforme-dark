import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aiseoforme.com"),
  title: "AI SEO For Me — Be the source AI quotes",
  description:
    "An AI SEO studio. We get brands found on Google, cited by ChatGPT and Perplexity, and chosen by the people asking.",
  openGraph: {
    title: "AI SEO For Me — Be the source AI quotes",
    description: "AI-powered SEO and search visibility for the next generation of search.",
    images: ["/img/glass-rainbow.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FBFAF7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("antialiased font-sans", geist.variable, mono.variable)}>
      <body>{children}</body>
    </html>
  );
}
