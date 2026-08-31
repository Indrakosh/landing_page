"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { prefersReducedMotion } from "../lib/raf";

/**
 * Type that arrives a word at a time, each word rising out of a mask.
 *
 * Every word sits in a clipped box and starts translated fully below it, so
 * what you see is the line being *revealed* rather than sliding in from
 * nowhere. The stagger is eased rather than linear — a constant delay per word
 * reads mechanical, a decelerating one reads like a voice.
 *
 * The words are always in the DOM as real text: this decorates the reveal, it
 * never gates the content. If JS fails, the CSS default is fully visible.
 */
export function Kinetic({
  words,
  as: Tag = "span",
  className,
  delay = 0,
  step = 62,
  play,
  style,
}: {
  words: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  step?: number;
  /**
   * Optional external gate. When supplied, the words wait for THIS rather than
   * for their own visibility — the chapter copy has to hold until the picture
   * beside it has actually finished arriving and come to rest, and "is on
   * screen" is not the same question.
   */
  play?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    if (play !== undefined) {
      el.dataset.kin = play ? "in" : "wait";
      return;
    }

    el.dataset.kin = "wait";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.kin = "in";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <Tag ref={ref} className={`kin ${className ?? ""}`} style={style}>
      {words.map((w, i) => (
        // The space MUST sit outside .kin-w. Inside it, the clipping box eats
        // the trailing whitespace and every word runs into the next —
        // "Everylayerofahome". Learned that one on a 190px headline.
        <Fragment key={`${w}-${i}`}>
          <span className="kin-w">
            <span
              className="kin-i"
              style={{
                // Ease the stagger so late words catch up — sqrt spacing.
                transitionDelay: `${delay + Math.sqrt(i) * step}ms`,
              }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export default Kinetic;
