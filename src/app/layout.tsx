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

const SITE_URL = "https://sarmad-portfolio-brown.vercel.app";
const OG_IMAGE = "/og.png"; // 1200x630, regenerate via /og-preview

/**
 * Exported from a server component, so every tag below lands in the initial
 * HTML. Crawlers — LinkedIn's especially — don't run JavaScript, so anything
 * injected client-side is invisible to them.
 *
 * metadataBase is what turns the relative image path into the absolute URL
 * those crawlers require; without it Next emits a relative src and LinkedIn
 * silently drops the image.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${identity.name} — ${identity.role}`,
  description: identity.statement,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: identity.statement,
    type: "website",
    url: "/",
    siteName: `${identity.name} — ${identity.role}`,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${identity.name} — ${identity.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.role}`,
    description: identity.statement,
    images: [OG_IMAGE],
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
