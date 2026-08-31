import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";

/**
 * Typography, per the Brand Guidelines (p.32–34).
 *
 * The guidelines name three faces and forbid a fourth: "Don't mix several font
 * styles in one layout." So Bodoni Moda and JetBrains Mono are gone — they were
 * my choices, not the brand's.
 *
 *   Wordmark   Medusa Gothic — "used exclusively for the wordmark" (p.33).
 *              Self-hosted subset in /fonts. Header, footer and loader only.
 *   Display    Neue Haas Grotesk Display Pro, Medium — the whole spec'd
 *   + body     hierarchy (H1 64pt / H2 30pt / H3 25pt / body 20pt).
 *   Accent     Cocogoose DemiBold — small caps labels and the lockup tagline.
 *
 * Neue Haas and Cocogoose are not licensed for web yet, so both fall through.
 * Arimo is the honest stand-in and the reason it is here rather than Inter or
 * Archivo: Neue Haas Grotesk *is* Helvetica, Arial is metrically identical to
 * Helvetica, and Arimo is metrically identical to Arial. When the real licence
 * lands, dropping the woff2 into /fonts changes the rendering without moving a
 * single line of text.
 */
const grotesk = Arimo({
  subsets: ["latin"],
  variable: "--f-fallback",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indrakosh — A world of interiors, unlocked",
  description:
    "A curated home destination in Dindigul, Tamil Nadu. Structural essentials, surface finishes, ambience and living elements — every layer of a home, under one roof.",
  openGraph: {
    title: "Indrakosh — A world of interiors, unlocked",
    description: "Every layer of a home, considered together. Dindigul, Tamil Nadu.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0a04",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={grotesk.variable}>
      <head>
        {/* The opening's three windows all open onto this one frame, and the
            spinner is held until it has decoded. Preloading it at high priority
            is what lets beat 1 finish on its intended 1.7s rather than waiting
            ~2.3s for a cold fetch — without it the whole sequence slides late. */}
        <link rel="preload" as="image" href="/img/hall.webp" fetchPriority="high" />
        <noscript>
          <style>{`
            .loader { display: none !important; }
            .kin-i { transform: none !important; opacity: 1 !important; }
            .unmask { clip-path: none !important; }
            .backdrop .plate:first-child { opacity: 1 !important; }
            .backdrop { transform: none !important; }
            main { opacity: 1 !important; }
            .hero-line-w { clip-path: none !important; }
            .hero-scroll span { opacity: 1 !important; transform: none !important; }
            .top { transform: none !important; opacity: 1 !important; }
          `}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
