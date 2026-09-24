import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
