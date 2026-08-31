"use client";

import { useEffect, useRef } from "react";
import { damp, onFrame, prefersReducedMotion } from "../lib/raf";

/**
 * A horizontal rail you drag, with real momentum.
 *
 * Velocity is tracked while dragging, then released into friction with a
 * spring rubber-band at each end. It should feel like pulling a heavy,
 * well-made drawer — which is, after all, what this business sells.
 *
 * It never captures vertical scroll. A wheel event only moves the rail when
 * the gesture is clearly horizontal (trackpad swipe), so a mouse wheel still
 * scrolls the page past it. Keyboard users get real arrow-key stepping and the
 * rail is focusable, because a drag-only control is a dead end for them.
 */
export function Rail({ children }: { children: React.ReactNode }) {
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = view.current;
    const t = track.current;
    if (!v || !t) return;

    let x = 0;
    let target = 0;
    let vel = 0;
    let down = false;
    let lastX = 0;
    let lastT = 0;

    const maxScroll = () => Math.max(0, t.scrollWidth - v.clientWidth);
    const clampTarget = (n: number) => {
      const max = maxScroll();
      // Rubber-band: past the end it still moves, but at a third the rate.
      if (n > 0) return n / 3;
      if (n < -max) return -max + (n + max) / 3;
      return n;
    };

    const onDown = (e: PointerEvent) => {
      down = true;
      vel = 0;
      lastX = e.clientX;
      lastT = performance.now();
      v.setPointerCapture(e.pointerId);
      v.dataset.drag = "1";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastT);
      vel = (dx / dt) * 16;
      target = clampTarget(target + dx);
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      v.releasePointerCapture?.(e.pointerId);
      v.dataset.drag = "";
    };
    const onWheel = (e: WheelEvent) => {
      // Only claim clearly horizontal intent; leave the page's scroll alone.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      target = clampTarget(target - e.deltaX);
    };
    const onKey = (e: KeyboardEvent) => {
      const step = v.clientWidth * 0.7;
      if (e.key === "ArrowRight") target = clampTarget(target - step);
      else if (e.key === "ArrowLeft") target = clampTarget(target + step);
      else return;
      e.preventDefault();
    };

    v.addEventListener("pointerdown", onDown);
    v.addEventListener("pointermove", onMove);
    v.addEventListener("pointerup", onUp);
    v.addEventListener("pointercancel", onUp);
    v.addEventListener("wheel", onWheel, { passive: false });
    v.addEventListener("keydown", onKey);

    const reduced = prefersReducedMotion();

    const stop = onFrame((_, dt) => {
      if (!down && Math.abs(vel) > 0.05) {
        target = clampTarget(target + vel);
        vel *= 0.94; // friction
      }
      // Always pull back inside the bounds — this is the spring half of the
      // rubber band, and it runs whether or not a drag is in flight.
      const max = maxScroll();
      if (target > 0) target = damp(target, 0, 10, dt);
      else if (target < -max) target = damp(target, -max, 10, dt);

      x = reduced ? target : damp(x, target, 9, dt);
      t.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    });

    return () => {
      stop();
      v.removeEventListener("pointerdown", onDown);
      v.removeEventListener("pointermove", onMove);
      v.removeEventListener("pointerup", onUp);
      v.removeEventListener("pointercancel", onUp);
      v.removeEventListener("wheel", onWheel);
      v.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className="rail"
      ref={view}
      tabIndex={0}
      role="group"
      aria-label="Collections — drag, or use the arrow keys"
      data-cursor="drag"
    >
      <div className="rail-track" ref={track}>
        {children}
      </div>
    </div>
  );
}

export default Rail;
