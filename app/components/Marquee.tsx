"use client";

import { useEffect, useRef } from "react";
import { damp, onFrame, prefersReducedMotion } from "../lib/raf";

/**
 * A marquee that answers to the scroll.
 *
 * A CSS-keyframe marquee runs at one speed forever and reads as a decoration
 * bolted on top of the page. This one is a body with momentum: it always has a
 * baseline drift, scrolling down pushes it faster, scrolling up drags it the
 * other way, and when you stop it eases back to its resting speed instead of
 * snapping.
 *
 * The physics:
 *   · scroll velocity in px/frame is measured, then damped so a trackpad's
 *     jitter does not make the strip stutter;
 *   · that damped velocity is added to a constant base speed;
 *   · position accumulates and wraps at half the track width, which is why the
 *     children are rendered twice — the wrap is then invisible.
 *
 * Wrapping on the *modulus* rather than resetting to zero is what keeps it
 * seamless in both directions; a reset-to-zero marquee visibly jumps the moment
 * you scroll upward.
 */
export function Marquee({
  items,
  base = 0.6,
}: {
  items: string[];
  /** Resting drift in px/frame. Negative runs right-to-left. */
  base?: number;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;

    let x = 0;
    let vel = 0;
    let lastScroll = window.scrollY;

    return onFrame((_, dt) => {
      const now = window.scrollY;
      const raw = now - lastScroll;
      lastScroll = now;

      // Damp the raw delta so a flick does not spike the strip across the page.
      vel = damp(vel, raw * 0.55, 6, dt);

      const half = el.scrollWidth / 2;
      if (half > 0) {
        x -= base + vel;
        // True modulus, so it stays seamless scrolling up as well as down.
        x = ((x % half) + half) % half;
        el.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
      }
    });
  }, [base]);

  return (
    <div className="marq" aria-hidden>
      <div className="marq-in" ref={track}>
        {[0, 1].map((dup) => (
          <span className="marq-set" key={dup}>
            {items.map((m) => (
              <span className="marq-item" key={m}>
                {m}
                <i>✦</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
