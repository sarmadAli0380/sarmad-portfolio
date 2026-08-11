import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { identity } from "@/lib/content";
import Scene from "@/components/canvas/Scene";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/ui/Nav";

/**
 * A serif display against a mono data voice. The serif keeps the page from
 * reading as a dev-tool screenshot; the mono keeps the numbers honest.
 */
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${identity.name} — ${identity.role}`,
  description: identity.statement,
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: identity.statement,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Scene />
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Loader />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <main className="shell">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
