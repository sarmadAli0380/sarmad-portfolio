import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const size = { width: 1200, height: 630 };

// Prerendered at build time, so this costs a static file rather than a function.
export const dynamic = "force-static";

/**
 * Generator for the social preview card at /og-preview.
 *
 * Deliberately NOT named opengraph-image.tsx: that filename is a Next metadata
 * convention that would auto-inject its own hashed og:image URL and override
 * the static public/og.png the metadata points at.
 *
 * To regenerate after changing the wording:
 *   npm run dev
 *   curl -o public/og.png http://localhost:3000/og-preview
 */
export async function GET() {
  const dir = join(process.cwd(), "src/app/_og");
  const [serif, mono] = await Promise.all([
    readFile(join(dir, "InstrumentSerif-Regular.ttf")),
    readFile(join(dir, "GeistMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08080B",
          // Stands in for the particle field, which can't be rendered here.
          backgroundImage:
            "radial-gradient(circle at 78% 42%, rgba(255,77,28,0.20) 0%, rgba(232,228,220,0.07) 26%, rgba(8,8,11,0) 58%)",
          padding: "68px 76px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 3,
              color: "#8B8880",
            }}
          >
            SARMAD ALI
          </span>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 3,
              color: "#8B8880",
            }}
          >
            PORTFOLIO — 2026
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 92,
              lineHeight: 1.02,
              color: "#E8E4DC",
              letterSpacing: -2,
            }}
          >
            Full-stack products, AI-powered tools,
          </span>
          <span
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 92,
              lineHeight: 1.02,
              color: "#FF4D1C",
              letterSpacing: -2,
            }}
          >
            Production software.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 25,
              color: "#E8E4DC",
              letterSpacing: 1,
            }}
          >
            Junior Software Engineer — Lahore, Pakistan
          </span>
          <div style={{ display: "flex", width: 150, height: 4, backgroundColor: "#FF4D1C" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
