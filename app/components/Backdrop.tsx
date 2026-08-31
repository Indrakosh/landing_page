"use client";

import { useEffect, useRef } from "react";
import { clamp, damp, onFrame, prefersReducedMotion } from "../lib/raf";

/**
 * The reason this page has no sections.
 *
 * One fixed, full-viewport image stack sits behind everything for the entire
 * scroll. Plates cross-fade into one another as you descend, so the ground is
 * continuous — there is never a hard edge where one block of the page stops
 * and the next begins. Content floats over it.
 *
 * Each plate also drifts and scales on a damped follow rather than snapping to
 * the raw scroll number, which is what gives the whole page the weight those
 * reference sites have. The page itself still scrolls natively — nothing is
 * pinned, nothing is hijacked, the scrollbar means what it says.
 */
export function Backdrop({ plates }: { plates: { src: string; alt: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>(".plate"));
    if (!layers.length) return;

    const reduced = prefersReducedMotion();
    let smooth = window.scrollY;

    /**
     * How much "arrival" is left, 1 → 0.
     *
     * Once the opening's windows start cutting, this decays exponentially and
     * feeds a small extra scale into every plate. The image is therefore still
     * easing to rest while you are first seeing it — the way a camera settles
     * rather than cutting. It is safe to move the picture during the reveal
     * precisely because there is only one of it now: the windows are holes in
     * black over this very element, so nothing can fall out of register.
     */
    let entry = 1;

    const apply = (p: number) => {
      // Where we are across the whole document, 0→1, mapped onto the plates.
      const pos = p * (layers.length - 1);
      layers.forEach((layer, i) => {
        const d = Math.abs(pos - i);
        const vis = clamp(1 - d);
        layer.style.opacity = String(vis);
        // The incoming plate settles from slightly over-scale; the outgoing one
        // keeps drifting. Nothing ever sits perfectly still, which is what
        // stops a fixed background reading as wallpaper.
        const k = (pos - i) * 6;
        const rest = 1.08 - vis * 0.06;
        layer.style.transform = `scale(${(rest + entry * 0.055).toFixed(4)}) translate3d(0, ${k.toFixed(2)}%, 0)`;
      });
    };

    if (reduced) {
      entry = 0;
      apply(0);
      return;
    }

    return onFrame((_, dt) => {
      // Reading one dataset flag per frame is far cheaper than a
      // MutationObserver callback, and this loop is running regardless.
      if (document.documentElement.dataset.entered === "1") {
        entry = damp(entry, 0, 3, dt);
      }
      smooth = damp(smooth, window.scrollY, 7, dt);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      apply(clamp(max > 0 ? smooth / max : 0));
    });
  }, [plates.length]);

  return (
    <div className="backdrop" ref={root} aria-hidden>
      {plates.map((p, i) => (
        <div key={p.src} className="plate">
          {/* Deliberately a plain <img>: these are decorative, always full-bleed
              at exactly one size, and never need next/image's srcset machinery.

              Only the first frame is urgent — it is what the opening reveals.
              Fetching all six at high priority put three long tasks (181ms,
              98ms, 59ms) on the main thread right where the reveal plays, and a
              181ms task drops eleven frames. The rest arrive while you read. */}
          <img
            src={p.src}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
          />
        </div>
      ))}
      <span className="backdrop-veil" />
      <span className="backdrop-grain" />
    </div>
  );
}

export default Backdrop;
