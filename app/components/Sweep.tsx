"use client";

import { Fragment, useEffect, useRef, type ElementType } from "react";
import { clamp, damp, onFrame, prefersReducedMotion } from "../lib/raf";

/**
 * A paragraph that lights up word by word as it crosses the screen.
 *
 * This is the reference's treatment for body copy, and it is a different idea
 * from Kinetic. Kinetic is an *arrival*: it fires once, the words rise in, done.
 * Sweep is *continuous* — the paragraph sits at a low ember and the reading
 * light travels through it under your control, so the text is tied to the
 * scroll rather than triggered by it. Stepping the reference frame by frame,
 * the tail of every paragraph is visibly dimmer than its head and resolves as
 * the block rises; that is what this is.
 *
 * All of the per-word work happens in CSS off two custom properties, so a frame
 * costs one property write on the container rather than one style write per
 * word. `--p` is the block's progress; each word carries its own index and
 * derives its own opacity from it.
 *
 * The progress itself is damped, so the light lags the scroll slightly instead
 * of being welded to it — the same response delay the rest of the page now has.
 */
export function Sweep({
  text,
  as: Tag = "p",
  className,
  /** How many words are mid-transition at once. Higher = softer gradient. */
  spread = 6,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  spread?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--p", "1");
      return;
    }

    let cur = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "25% 0px",
    });
    io.observe(el);

    const stop = onFrame((_, dt) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Runs from "the block's top has risen to 82% of the screen" to
      // "its bottom has risen to 34%" — it finishes while still comfortably in
      // view, so you never read a paragraph that is still filling in.
      const from = vh * 0.82;
      const to = vh * 0.34;
      const p = clamp((from - r.top) / Math.max(1, from - to + r.height * 0.55));
      cur = damp(cur, p, 7, dt);
      el.style.setProperty("--p", cur.toFixed(4));
    });

    return () => {
      stop();
      io.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`sw ${className ?? ""}`}
      style={{ ["--n" as string]: words.length, ["--sp" as string]: spread }}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="sw-w" style={{ ["--i" as string]: i }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export default Sweep;
