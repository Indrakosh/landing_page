import { clamp, onFrame, prefersReducedMotion } from "./raf";

/**
 * Smooth scroll — the thing that makes every other animation feel expensive.
 *
 * The reference site (nabilissa.com) runs Lenis. That single fact explains most
 * of what the client kept describing as "response delay" and "ultra smooth":
 * on that site the scroll *position itself* is a damped follow of the wheel,
 * so every scroll-linked animation on the page inherits the smoothing for free.
 * Ours were reacting to raw wheel deltas, which arrive as coarse ~100px steps —
 * you cannot ease your way out of a stepped input.
 *
 * So we smooth at the source instead of at each animation.
 *
 * The implementation deliberately drives the REAL scroll position via
 * scrollTo() rather than transforming a wrapper. Transforming the page is the
 * common shortcut and it silently kills `position: sticky` and
 * `animation-timeline: scroll()`, both of which this page depends on. Moving
 * the actual scrollport keeps native semantics: the scrollbar is real, anchors
 * work, find-in-page works, and sticky pins where it should.
 *
 * Physics: a critically damped spring, not an exponential lerp. A lerp starts
 * moving at full speed on the first frame — it has no inertia, so the beginning
 * of every scroll is a step. A second-order spring starts from zero velocity,
 * so the page takes a moment to gather itself and then glides. ζ = 1 exactly:
 * any overshoot at all would mean the page drifts past where you stopped, which
 * reads as broken rather than as luxury.
 */

/** rad/s. ~600ms to rest — long enough to feel weighted, short enough to obey. */
const OMEGA = 12;

/** Touch is left alone on purpose: native momentum scrolling on a phone is
 *  better than anything we can synthesise, and "sync touch" implementations are
 *  where smooth-scroll libraries earn their bad reputation. */
const isCoarse = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export function startSmoothScroll() {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion() || isCoarse()) return () => {};

  const doc = document.documentElement;
  const maxScroll = () => Math.max(0, doc.scrollHeight - window.innerHeight);

  let target = window.scrollY;
  let current = target;
  let vel = 0;
  /** What we last wrote. Anything else means the user moved it another way. */
  let written = Math.round(current);
  let running = false;

  // The CSS `scroll-behavior: smooth` would fight us on every anchor jump.
  const priorBehavior = doc.style.scrollBehavior;
  doc.style.scrollBehavior = "auto";

  const wake = () => {
    running = true;
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // pinch-zoom
    // Let anything with its own horizontal/scrollable behaviour keep it.
    const path = e.composedPath?.() ?? [];
    for (const n of path) {
      if (!(n instanceof HTMLElement)) continue;
      if (n.dataset.noSmooth !== undefined) return;
    }
    e.preventDefault();
    // Lines and pages arrive in different units; normalise to px.
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    target = clamp(target + e.deltaY * k, 0, maxScroll());
    wake();
  };

  const KEYS: Record<string, () => number> = {
    ArrowDown: () => 90,
    ArrowUp: () => -90,
    PageDown: () => window.innerHeight * 0.9,
    PageUp: () => -window.innerHeight * 0.9,
    " ": () => window.innerHeight * 0.9,
    Home: () => -Infinity,
    End: () => Infinity,
  };

  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    const d = KEYS[e.key];
    if (!d) return;
    e.preventDefault();
    const v = d();
    target = clamp(v === Infinity ? maxScroll() : v === -Infinity ? 0 : target + v, 0, maxScroll());
    wake();
  };

  /** Scrollbar drags, find-in-page, focus jumps: adopt the new position
   *  instead of yanking it back to where we thought we were. */
  const onScroll = () => {
    if (Math.abs(window.scrollY - written) <= 1) return;
    current = target = window.scrollY;
    vel = 0;
  };

  /** In-page anchors go through the spring so they arrive like everything else. */
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const to = id ? document.getElementById(id) : doc;
    if (!to) return;
    e.preventDefault();
    target = clamp(window.scrollY + to.getBoundingClientRect().top, 0, maxScroll());
    wake();
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", onClick);

  const stop = onFrame((_, dt) => {
    if (!running) return;
    // Clamp the step. A spring integrated across a backgrounded tab's dt does
    // not settle, it detonates.
    const h = Math.min(dt, 1000 / 30) / 1000;
    // Critically damped: accel = ω²·(target−x) − 2ω·v
    const accel = (target - current) * OMEGA * OMEGA - vel * 2 * OMEGA;
    vel += accel * h;
    current += vel * h;

    if (Math.abs(target - current) < 0.08 && Math.abs(vel) < 0.5) {
      current = target;
      vel = 0;
      running = false;
    }
    written = Math.round(current);
    window.scrollTo(0, written);
  });

  return () => {
    stop();
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("click", onClick);
    doc.style.scrollBehavior = priorBehavior;
  };
}
