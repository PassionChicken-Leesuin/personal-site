import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/content";
import ScrollDriver from "@/components/ScrollDriver";
import MistLayers from "@/components/MistLayers";

// Claude DESIGN.md 의 Copernicus / StyreneB 는 유료 서체라 대체한다.
// Fraunces: SOFT·WONK 축이 있어 유기적인 인상을 만든다 (구름·나무 컨셉)
// Inter:    원본 DESIGN.md 가 스스로 명시한 fallback
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollDriver />
        <MistLayers />
        {children}
      </body>
    </html>
  );
}
