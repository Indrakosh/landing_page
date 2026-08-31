import Backdrop from "./components/Backdrop";
import Chapter from "./components/Chapter";
import Cursor from "./components/Cursor";
import Kinetic from "./components/Kinetic";
import LightSurface from "./components/LightSurface";
import Loader from "./components/Loader";
import Mark from "./components/Mark";
import Marquee from "./components/Marquee";
import Smooth from "./components/Smooth";
import Specimen from "./components/Specimen";
import Strip from "./components/Strip";
import Sweep from "./components/Sweep";
import {
  brand,
  chapters,
  closing,
  founder,
  hero,
  layers,
  manifesto,
  marquee,
  opening,
  plates,
  rail,
  specimens,
} from "./data";

/**
 * One continuous descent.
 *
 * There are no sections in the visual sense: a single fixed image stack runs
 * behind the entire page and cross-fades as you scroll, so the ground never
 * cuts. Everything here floats over that. The <section> elements exist for
 * screen readers and skip-links, not for the eye.
 */
export default function Page() {
  return (
    <>
      {/* Watch only the frame the opening actually reveals. Waiting on three
          images pushed beat 1 past its 1.7s mark and slid the whole sequence
          late; the rest can stream in behind the curtain. */}
      <Loader watch={[plates[0].src]} />
      <Smooth />
      <Cursor />
      <Backdrop plates={plates} />

      <header className="top">
        <a href="#top" className="top-lockup" aria-label={`${brand.name} — top of page`}>
          <Mark className="top-symbol" />
          <span className="top-mark">{brand.name}</span>
        </a>
        <div className="top-right">
          {/* Two actions, deliberately unequal. Planning a visit is what this
              business actually wants from the page, so it keeps the pill;
              browsing is the lower-commitment step and gets the quieter
              treatment. Two identical buttons would make neither primary. */}
          <a href="#products" className="top-alt">
            <span>View products</span>
          </a>
          <a href="#visit" className="top-cta">
            <span>{closing.cta}</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- hero */}
        {/* Taller than the viewport, with its contents stuck to the top. For the
            first ~55svh of scroll the hero does not move at all — only the nav
            rides up — and once the nav is home the whole thing scrolls away
            normally. Sticky rather than a scroll-jack: the scrollbar still means
            what it says and you can flick straight past. */}
        <section className="hero" aria-label="Indrakosh">
          <div className="hero-stick">
          <p className="hero-over">{hero.over}</p>

          {/* One line per element so the breaks are art direction, not
              wrapping. The reveal is CSS off `data-ready` rather than Kinetic:
              stepped at 15fps, the reference wipes each line from its RIGHT
              edge leftward — "CAN" arrives as N, AN, CAN — which is why its
              headline lands instead of appearing. */}
          <h1 className="hero-h">
            {hero.lines.map((l, i) => (
              <span className="hero-line-w" key={l} style={{ ["--l" as string]: i }}>
                {l}
              </span>
            ))}
          </h1>

          <p className="hero-scroll">
            {hero.scroll.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
          </div>
        </section>

        {/* ------------------------------------------------------- opening */}
        <section className="beats" aria-label="The moment">
          {opening.map((l, i) => (
            <Kinetic
              key={l}
              as="p"
              words={l.split(" ")}
              className={`beat ${i === opening.length - 1 ? "beat-last" : ""}`}
              style={{ ["--b" as string]: i }}
              step={50}
            />
          ))}
        </section>

        {/* ------------------------------------------------------ manifesto */}
        <section className="mani" aria-label="What makes us different">
          <Kinetic as="p" words={manifesto} className="mani-t" step={54} />
        </section>

        {/* ------------------------------------------------------- chapters
            Not stacked panels — alternating full-bleed plates with the copy
            riding over them, so the page keeps moving through one space. */}
        {chapters.map((c, i) => (
          <Chapter key={c.k} n={i} {...c} />
        ))}

        {/* ------------------------------------------------- specimen index
            This replaced the sideways-travelling materials band.

            The band was seven photographs going past and it told you nothing
            about any of them — you could not learn a single fact from it. This
            says what each material is, where it comes from and what it is for,
            which is the question somebody standing in a showroom is actually
            asking. The preview follows the cursor, so the pictures are still
            there; they have just stopped being the whole content.

            Ported from the paper edition, restyled for the night ground. */}
        <LightSurface className="specwrap" label="Materials">
          <div className="spechead">
            <h2 className="spec-h">The material, first</h2>
            <p className="spec-hint">Point at a row</p>
          </div>
          <Specimen rows={specimens} />
        </LightSurface>

        {/* --------------------------------------------------------- founder
            From the reference recording: a full-bleed monochrome portrait with
            a large thin statement lapping its edge, a narrow column of small
            copy beside it, and a signature. The portrait is B&W here for the
            same reason it is there — it separates the one person on the page
            from the warm photography around him without needing a frame.

            The reference runs a press-logo ticker under this. Not built, on
            purpose: Indrakosh is Est. 2025 and has no press, and invented
            mastheads are the kind of claim a competitor checks. */}
        <section className="founder" aria-label="The founder">
          <figure className="founder-fig">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={founder.img} alt={founder.alt} loading="lazy" decoding="async" />
          </figure>

          <h2 className="founder-h">
            {founder.h.map((l, i) => (
              <span key={l} style={{ ["--l" as string]: i }}>
                {i === founder.h.length - 1 ? <em>{l}</em> : l}
              </span>
            ))}
          </h2>

          <div className="founder-side">
            {founder.body.map((b, i) => (
              <Sweep key={i} text={b} className="founder-b" spread={7} />
            ))}
            <p className="founder-sign">
              <Mark className="founder-symbol" />
              <span>
                <b>{founder.by}</b>
                {founder.role}
              </span>
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- marquee
            Drifts at rest, accelerates with the scroll, reverses when you
            scroll up, and eases back. */}
        <Marquee items={marquee} />

        {/* ------------------------------------------------------------ wall
            "Everything, under one roof" as a wall of work rather than a tidy
            row of cards — see the .wall block in globals.css for why it is
            cream, tilted and overlapping. Same physics as the materials band
            (pinned, sprung, centre-focused); a completely different skin. */}
        <section className="wall" id="products" aria-label="Collections">
          <Strip
            wrapClass="wallwrap"
            focus={0.2}
            light
            label={
              <div className="wall-head">
                <p className="wall-over">Under one roof</p>
                <h2 className="wall-h">
                  Every layer, <em>together</em>
                </h2>
              </div>
            }
          >
            {rail.map((r, i) => (
              <figure className="plate-card" key={r.src} style={{ ["--c" as string]: i }}>
                <div className="plate-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.src} alt={r.alt} loading="lazy" decoding="async" />
                </div>
                <figcaption>
                  <span className="plate-n">{r.n}</span>
                  <span className="plate-t">{r.t}</span>
                </figcaption>
              </figure>
            ))}
          </Strip>
        </section>

        {/* ---------------------------------------------------------- layers
            A quadriptych: four tall panels standing side by side, each with its
            own picture. Nothing else on the page is composed this way, which is
            the point — it was four headings floating on a photograph with the
            body copy unreadable underneath, and it is the brand's actual
            spine. */}
        <section className="lays" aria-label="The four layers">
          <div className="lays-head">
            <h2 className="lays-h">Every layer of a home</h2>
            <p className="lays-hint">Four, considered together</p>
          </div>
          <div className="lays-row">
            {layers.map((l, i) => (
              <article className="lay" key={l.n} style={{ ["--i" as string]: i }}>
                <div className="lay-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.img} alt={l.alt} loading="lazy" decoding="async" />
                </div>
                <div className="lay-body">
                  <span className="lay-n">{l.n}</span>
                  <h3 className="lay-t">{l.t}</h3>
                  <p className="lay-b">{l.b}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- closing */}
        <section className="close" id="visit" aria-label="Visit">
          <Kinetic as="p" words={closing.q.split(" ")} className="close-q" step={46} />
          <a className="big-cta" href="#visit">
            <span>{closing.cta}</span>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </section>
      </main>

      <footer className="foot">
        <Mark className="foot-symbol" />
        <span className="foot-word" aria-hidden>
          {brand.name}
        </span>
        <div className="foot-row">
          <span>{brand.place}</span>
          <span>{brand.line}</span>
          <span>© {brand.name} 2025</span>
        </div>
      </footer>
    </>
  );
}
