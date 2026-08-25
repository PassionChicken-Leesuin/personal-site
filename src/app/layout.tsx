import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/content";
import ScrollDriver from "@/components/ScrollDriver";

// Jost: 기하학적 그로테스크. 원이 정원(正圓)에 가까워 제도 도구로 그은 듯한
//       인상을 준다 — 이 사이트가 빌려온 도면 언어와 같은 계열이다.
// Inter: 본문. 작은 크기에서 흐트러지지 않는다.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
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
      className={`${jost.variable} ${inter.variable} min-h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollDriver />
        {children}
      </body>
    </html>
  );
}
