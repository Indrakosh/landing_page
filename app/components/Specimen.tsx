"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  n: string;
  t: string;
  sp: string;
  from: string;
  use: string;
  img: string;
  alt: string;
};

/**
 * The materials index, with a preview that follows the cursor.
 *
 * This is the signature of the paper edition and the one thing the dark site
 * genuinely could not do. Dinesen's whole site rests on the idea that a timber
 * merchant should show you the timber in an index you can actually read; a
 * dark, atmospheric page cannot carry a dense table, and a paper page can.
 * Dense tabular information, set properly, is one of the most reliably
 * well-regarded things in this niche — and unlike most hover flourishes this
 * one is useful, which is the part that matters.
 *
 * Two implementation notes worth keeping:
 *
 * 1. The follower is damped, not welded to the pointer. A preview pinned
 *    exactly to the cursor feels like a dragged tooltip; letting it trail by a
 *    few frames gives it weight and, more practically, stops it jittering on
 *    every micro-movement of the hand. Frame-rate independent, so it settles
 *    identically at 60Hz and 144Hz.
 *
 * 2. Every image is mounted at once and cross-faded by opacity rather than
 *    swapping one `src`. Swapping the source means the first hover on each row
 *    shows an empty box while the file fetches, which is exactly the moment the
 *    effect needs to feel instant.
 *
 * On touch there is no cursor to follow, so the follower is not rendered at
 * all and the table is simply a table.
 */
export function Specimen({ rows }: { rows: Row[] }) {
  const peek = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [coarse, setCoarse] = useState(true);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /**
   * Drop the preview as soon as the page scrolls.
   *
   * `pointerleave` only fires when the pointer moves, and the ordinary way to
   * leave this table is to spin the wheel with the cursor sitting perfectly
   * still — at which point the preview stays lit and floats over whatever
   * section you scroll into next. Caught it in a screenshot of the layers
   * index with a timber swatch hovering in the middle of it.
   */
  useEffect(() => {
    if (active === null) return;
    const off = () => setActive(null);
    window.addEventListener("scroll", off, { passive: true, once: true });
    return () => window.removeEventListener("scroll", off);
  }, [active]);

  useEffect(() => {
    const el = peek.current;
    if (!el || coarse) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Start off-screen so the first appearance does not fly in from 0,0.
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      // Exponential decay over real elapsed time rather than a fixed fraction
      // per frame, so a 144Hz display does not settle twice as fast.
      const k = 1 - Math.exp(-12 * (dt / 1000));
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [coarse]);

  return (
    <div className="spec" onPointerLeave={() => setActive(null)}>
      {rows.map((r, i) => (
        <a
          key={r.t}
          className="spec-row rv"
          href="#visit"
          style={{ ["--d" as string]: Math.min(i, 6) }}
          onPointerEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <span className="spec-n">{r.n}</span>
          <span className="spec-name">{r.t}</span>
          <span className="spec-meta spec-hide">{r.sp}</span>
          <span className="spec-meta spec-hide">{r.from}</span>
          <span className="spec-meta">{r.use}</span>
          <span className="spec-go" aria-hidden>
            Ask →
          </span>
        </a>
      ))}

      {!coarse && (
        <div className="spec-peek" ref={peek} data-on={active !== null ? "" : undefined} aria-hidden>
          {rows.map((r, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={r.img + r.t}
              src={r.img}
              alt=""
              data-on={active === i ? "" : undefined}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Specimen;
