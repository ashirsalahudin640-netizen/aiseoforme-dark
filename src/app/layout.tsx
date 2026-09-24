import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aiseoforme.com"),
  title: "AI SEO For Me — Be found beyond search",
  description:
    "AI-powered SEO and search visibility studio. We make brands findable by people and by AI — across Google, answer engines and assistants.",
  openGraph: {
    title: "AI SEO For Me — Be found beyond search",
    description: "AI-powered SEO and search visibility for the next generation of search.",
    images: ["/media/reel-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFDF7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
