# Brand fonts — drop-in

The site is already wired for the fonts named in the Brand Guidelines. Drop the
licensed files into **this folder** with the exact filenames below and they take
effect on next load. No code change needed.

| Filename to drop here | Face | Used for |
|---|---|---|
| `NHaasGroteskDSPro-45Lt.woff2` | Neue Haas Grotesk Display Pro, 45 Light | body, long copy |
| `NHaasGroteskDSPro-65Md.woff2` | Neue Haas Grotesk Display Pro, 65 Medium | H1 / H2 / H3, spec'd weight |
| `Cocogoose-DemiBold.woff2` | Cocogoose DemiBold | the lockup tagline, accents |
| ~~`MedusaGothic.woff2`~~ | Medusa Gothic | ✅ **already here** — subset, 8 KB |

`@font-face` rules live in `app/globals.css`. Each one tries `local()` first, so
if you have the fonts installed on your machine they already render for you
without any file here.

## Medusa Gothic — wordmark only

Guidelines p.33: *"Used exclusively for the wordmark."* It is wired to
`--font-wordmark` and applied to exactly three places — the hero lockup, the
header, and the footer. **Never set copy in it.**

Preferred long-term: the approved **SVG logo artwork** (primary, secondary,
symbol), which is sharper, lighter, and keeps the mark from being re-rendered
by a font substitution. Ask the client for those files.
`app/components/Opening.tsx` carries an interim symbol that must be replaced —
the guidelines forbid redrawing the official mark.

## Status as of 20 Aug 2026 — installed locally, NOT shippable

Fonts were installed per-user on the dev machine. Read from the actual name
records in the files:

| Installed file | Family name | Verdict |
|---|---|---|
| `NeueHaasGrotDisp-45Light-Trial.otf` | `HaasGrot Disp 45 Lt Trial` | ⚠️ **Trial** |
| `NeueHaasGrotDisp-65Medium-Trial.otf` | `HaasGrot Disp 65 Md Trial` | ⚠️ **Trial** |
| `Cocogoose Pro-trial.ttf` (+ 9 more) | `Cocogoose` | ⚠️ **Trial, and no DemiBold** |
| `MedusaGothic D.otf` | `Medusa Gothic` | ✅ Subset + shipped as `MedusaGothic.woff2`. Empty licence field — likely the free/personal build, so **confirm a Sharkshock commercial licence before public launch**. |

Three blockers before launch:

1. **The Neue Haas and Cocogoose files are trial builds.** Their EULA is the
   Commercial Type agreement; trial licences cover evaluation and comping
   only — not production, and never web serving. They cannot be converted to
   woff2 and put in this folder.
2. **Cocogoose DemiBold is not installed.** The trial pack ships Thin,
   UltraLight, Light, Semilight, Regular and italics. DemiBold — the one weight
   the guidelines actually specify — is a paid weight.
3. **Neue Haas Grotesk Display is published by [Commercial Type](https://commercialtype.com),
   not Monotype.** Buy the webfont licence there.

Trial family names are listed in the CSS stacks so the design renders correctly
on a machine that has them installed. Newly installed fonts require a **full
browser restart** before Chrome will see them.

## Licensing

Neue Haas Grotesk Display Pro is a commercial Monotype/Linotype face and
Cocogoose is commercial (Zetafonts). **A desktop licence does not cover web
use** — webfont licences are sold separately and usually metered by pageviews.

The fonts *are* embedded in `4 - INDRAKOSH - Brand Guidelines - Draft 01.pdf`,
but they must not be extracted from it:

1. They are **subsets** (`CNKQUK+NHaasGroteskDSPro-65Md`) containing only the
   glyphs that document happens to use — most characters are missing, so text
   would break unpredictably.
2. Embedding for document viewing is not a licence to serve the font from a
   web server.

Confirm with the client who holds the licence before launch.

## Until then

The stack falls back to Geist (bundled in `app/fonts/`), a neutral grotesk in a
similar register. The site is fully usable; the type is just not yet on-brand.
