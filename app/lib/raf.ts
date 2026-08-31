/**
 * One animation loop for the whole page.
 *
 * Every component that needs per-frame work subscribes here instead of calling
 * requestAnimationFrame itself. Twelve components each running their own loop
 * is twelve callbacks, twelve layout reads and twelve chances to force a
 * synchronous reflow every frame; one loop reads the scroll position once and
 * hands the same number to everybody.
 *
 * The loop parks itself when nothing is subscribed, so an idle page costs zero.
 */

type Frame = (t: number, dt: number) => void;

const subs = new Set<Frame>();
let running = false;
let prev = 0;

function tick(now: number) {
  const dt = Math.min(64, now - prev) || 16;
  prev = now;
  for (const fn of subs) fn(now, dt);
  if (subs.size) requestAnimationFrame(tick);
  else running = false;
}

export function onFrame(fn: Frame) {
  subs.add(fn);
  if (!running) {
    running = true;
    prev = performance.now();
    requestAnimationFrame(tick);
  }
  return () => {
    subs.delete(fn);
  };
}

/**
 * Frame-rate independent damping.
 *
 * The naive `a += (b - a) * 0.1` is tied to frame rate: it settles twice as
 * fast on a 120Hz display as on a 60Hz one, so the whole site feels different
 * on a gaming monitor. Exponential decay over real elapsed time fixes that.
 */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return target + (current - target) * Math.exp(-lambda * (dt / 1000));
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);

/** 0→1 progress of `el` through the viewport. 0 = just entering, 1 = just left. */
export function viewProgress(el: Element) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return clamp((vh - r.top) / (vh + r.height));
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
