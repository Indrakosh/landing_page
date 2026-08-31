"use client";

import { useEffect, useRef } from "react";
import { damp, onFrame, prefersReducedMotion } from "../lib/raf";

/**
 * A custom cursor that trails the pointer and swells over anything
 * interactive.
 *
 * Two rules keep this from being the usual annoyance:
 *   · The real cursor is never hidden on touch, on coarse pointers, or when
 *     reduced motion is set — this is an addition, not a replacement.
 *   · It is `pointer-events: none` and outside the tab order, so it cannot
 *     intercept a click or confuse a screen reader.
 *
 * The ring lags the dot. That gap is the whole effect: the dot tells you where
 * you are, the ring tells you how fast you got there.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    document.documentElement.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    // Delegated, so elements added later still light the cursor up.
    const over = (e: PointerEvent) => {
      const t = (e.target as Element)?.closest?.("a,button,[data-cursor]");
      targetScale = t ? 2.6 : 1;
      r.dataset.hot = t ? "1" : "";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });

    const stop = onFrame((_, dt) => {
      dx = damp(dx, mx, 40, dt);
      dy = damp(dy, my, 40, dt);
      rx = damp(rx, mx, 11, dt);
      ry = damp(ry, my, 11, dt);
      scale = damp(scale, targetScale, 14, dt);
      d.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      r.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
    });

    return () => {
      stop();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cur-ring" aria-hidden />
      <div ref={dot} className="cur-dot" aria-hidden />
    </>
  );
}

export default Cursor;
