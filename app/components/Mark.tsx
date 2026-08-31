/**
 * The Indrakosh symbol.
 *
 * ⚠️  INTERIM ARTWORK — MUST BE REPLACED BEFORE LAUNCH.
 *
 * The Brand Guidelines forbid redrawing the mark, and the approved vector files
 * (primary / secondary / symbol) have not been supplied. This is a parametric
 * reconstruction traced from p.23–25 of the guidelines, and it exists for one
 * reason: the opening sequence has to animate the mark *component by component*
 * — ray by ray, petal by petal — which a flat exported SVG cannot do.
 *
 * The rule we hold ourselves to: the animation only ever *assembles* the mark.
 * It never displays a stretched, rotated or rearranged version at rest. The
 * final frame is the approved lockup. Get this signed off, and swap the static
 * uses (header, footer, favicon, OG image) to the official artwork.
 *
 * Geometry, so it can be checked against the source:
 *   burst centre (100, 92) · beaded dome r=27.5 · rays 30→66 · petals rise to y=115
 *   sparkle centre (100, 117) · plinth y=196
 *   The negative space between the two petals, read together with the sparkle,
 *   forms the key: the sparkle is the bow, the gap is the shaft.
 */

type MarkProps = {
  /** Drives the assembly. "on" is the resting, approved state. */
  state?: "off" | "on";
  /** Show the key that lives in the negative space. Used once, in the overture. */
  revealKey?: boolean;
  className?: string;
  title?: string;
};

const CX = 100;
const CY = 92;

/** Rays alternate long/short across a 200° arc, longest near the crown. */
function rays() {
  const out: { d: string; i: number }[] = [];
  const COUNT = 27;
  const FROM = 186;
  const TO = -6;
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const deg = FROM + (TO - FROM) * t;
    const rad = (deg * Math.PI) / 180;
    const long = i % 2 === 0;

    // Rays nearest vertical read as the crown, so they run slightly longer.
    const crown = Math.sin(rad);
    const inner = 30;
    const outer = long ? 56 + 10 * crown : 45 + 6 * crown;
    const halfW = long ? 1.5 : 1.0;

    const nx = Math.cos(rad);
    const ny = -Math.sin(rad);
    const px = -ny; // perpendicular
    const py = nx;

    const ax = CX + nx * inner + px * halfW;
    const ay = CY + ny * inner + py * halfW;
    const bx = CX + nx * inner - px * halfW;
    const by = CY + ny * inner - py * halfW;
    const tx = CX + nx * outer;
    const ty = CY + ny * outer;

    out.push({
      i,
      d: `M${ax.toFixed(2)} ${ay.toFixed(2)}L${tx.toFixed(2)} ${ty.toFixed(2)}L${bx.toFixed(2)} ${by.toFixed(2)}Z`,
    });
  }
  return out;
}

/** The beaded dome the rays spring from. */
function beads() {
  const out: { cx: number; cy: number; i: number }[] = [];
  const COUNT = 17;
  for (let i = 0; i < COUNT; i++) {
    const deg = 178 + (2 - 178) * (i / (COUNT - 1));
    const rad = (deg * Math.PI) / 180;
    out.push({
      i,
      cx: CX + Math.cos(rad) * 27.5,
      cy: CY - Math.sin(rad) * 27.5,
    });
  }
  return out;
}

const PETAL_RIGHT =
  "M103 127C110 123 120 118 128 115C131 145 131 171 125 186C121 192 111 193 103 189Z";
const PETAL_LEFT =
  "M97 127C90 123 80 118 72 115C69 145 69 171 75 186C79 192 89 193 97 189Z";
const SPARKLE =
  "M100 104C101.8 111.5 104.6 114.6 111.5 117C104.6 119.4 101.8 122.5 100 130C98.2 122.5 95.4 119.4 88.5 117C95.4 114.6 98.2 111.5 100 104Z";
const PLINTH =
  "M64 196C80 194.2 120 194.2 136 196C120 197.8 80 197.8 64 196Z";

export function Mark({ state = "on", revealKey = false, className, title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 200 250"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      data-state={state}
      data-mark
      fill="currentColor"
    >
      {/* The key living in the negative space. Shown for one beat, then gone. */}
      <g data-mark-key opacity={revealKey ? 1 : 0}>
        <circle cx={100} cy={117} r={15.5} fill="none" stroke="currentColor" strokeWidth={2.2} />
        <rect x={97.5} y={117} width={5} height={76} rx={2.5} />
      </g>

      <g data-mark-rays>
        {rays().map((r) => (
          <path key={r.i} d={r.d} data-ray style={{ ["--i" as string]: r.i }} />
        ))}
      </g>

      <g data-mark-beads>
        {beads().map((b) => (
          <circle
            key={b.i}
            cx={b.cx.toFixed(2)}
            cy={b.cy.toFixed(2)}
            r={1.9}
            data-bead
            style={{ ["--i" as string]: b.i }}
          />
        ))}
      </g>

      <path d={PETAL_LEFT} data-petal="l" />
      <path d={PETAL_RIGHT} data-petal="r" />
      <path d={SPARKLE} data-sparkle />
      <path d={PLINTH} data-plinth />
    </svg>
  );
}

export default Mark;
