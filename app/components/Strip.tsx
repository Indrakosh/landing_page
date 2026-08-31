"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, onFrame, prefersReducedMotion } from "../lib/raf";
import { addLightSurface } from "../lib/light";

/**
 * The materials band: travels sideways, but only once it has arrived.
 *
 * Two things were wrong with the first version and both were about *when*.
 *
 * It started moving the instant its top edge crossed the bottom of the screen,
 * so the band was already half spent by the time you could see it — you met it
 * mid-gesture. Now the section is taller than the viewport and the band is
 * pinned in the middle of it: the strip holds dead still until it is centred on
 * screen, and only then does the sideways travel begin. Progress is measured
 * off the tall wrapper, whose top edge meets the top of the viewport at exactly
 * the moment the pin engages, so "centred" and "zero" are the same instant.
 *
 * And it had no runway. Mapping the whole horizontal distance onto the band's
 * own height meant a few hundred pixels of scroll dragged the strip several
 * thousand pixels sideways. The pin is what buys the runway back.
 *
 * The mapping is sprung, not direct. A rigid `translateX = progress * distance`
 * welds the strip to the scrollbar and feels like dragging a window; an
 * exponential follow only decays toward its target, so it has no momentum and
 * starts and stops abruptly. A second-order spring gives the strip mass — it
 * takes a moment to get going, keeps travelling when the scroll stops, and
 * settles with a trace of overshoot.
 */
export function Strip({
  children,
  label,
  className,
  wrapClass,
  /** Fraction of the strip's overflow to travel. 1 = last frame lands flush. */
  overscroll = 1,
  /** How much the centred frame grows. 0 turns the focus effect off. */
  focus = 0.14,
  light = false,
}: {
  children: ReactNode;
  label?: ReactNode;
  className?: string;
  wrapClass?: string;
  overscroll?: number;
  focus?: number;
  /**
   * Marks this band as a LIGHT surface. The fixed header is cream, so over a
   * cream section it is cream-on-cream and simply vanishes — which is exactly
   * what happened the first time this section was built. Setting this flips the
   * chrome to ink for as long as the band is under it.
   */
  light?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const b = band.current;
    const t = track.current;
    if (!w || !b || !t) return;

    if (prefersReducedMotion()) {
      t.style.transform = "none";
      b.style.overflowX = "auto";
      return;
    }

    let x = 0;
    let vel = 0;
    let visible = false;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "20% 0px",
    });
    io.observe(w);

    const STIFFNESS = 96; // pull toward target, per second²
    const DAMPING = 15.5; // resistance to velocity, per second — ζ ≈ 0.79

    /**
     * The centre of the screen is where the band is in focus.
     *
     * Each frame grows as it reaches the middle and returns to its normal size
     * as it carries on left, so there is always exactly one subject and the
     * rest are context. It is a spotlight travelling along the band rather than
     * a row of equals sliding past — which is the difference between a strip of
     * material samples and a shop window.
     *
     * The measurement is cached. Reading getBoundingClientRect() on every slab
     * on every frame is a forced synchronous layout per slab per frame, and it
     * is entirely avoidable: the slabs never move relative to the track, so
     * their centres are constants plus the track's translate.
     */
    let slabs: HTMLElement[] = [];
    let centres: number[] = [];
    const measure = () => {
      slabs = [...t.children] as HTMLElement[];
      centres = slabs.map((el) => el.offsetLeft + el.offsetWidth / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);

    const stop = onFrame((_, dt) => {
      if (!visible) return;
      const h = Math.min(dt / 1000, 1 / 30);
      const r = w.getBoundingClientRect();
      const runway = Math.max(1, r.height - window.innerHeight);
      // 0 the instant the pin engages (band centred), 1 when the section ends.
      const p = clamp(-r.top / runway);
      const distance = Math.max(0, t.scrollWidth - b.clientWidth) * overscroll;
      const target = -p * distance;

      const accel = (target - x) * STIFFNESS - vel * DAMPING;
      vel += accel * h;
      x += vel * h;

      t.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      w.style.setProperty("--sp", p.toFixed(4));

      if (focus > 0 && slabs.length) {
        const originX = b.getBoundingClientRect().left;
        const mid = window.innerWidth / 2;
        // Falls off over 42% of the viewport either side — wide enough that the
        // change is a drift rather than a snap as a frame crosses the middle.
        const reach = window.innerWidth * 0.42;
        for (let i = 0; i < slabs.length; i++) {
          const d = Math.abs(originX + centres[i] + x - mid);
          const f = 1 - clamp(d / reach);
          // Smoothstep, so the peak is rounded instead of a cone with a point
          // on it at dead centre.
          const e = f * f * (3 - 2 * f);
          slabs[i].style.setProperty("--f", e.toFixed(3));
          slabs[i].style.zIndex = String(Math.round(e * 10));
        }
      }
    });

    // Register this band as a light surface so the page chrome inverts to ink
    // while it is under the header. The measurement and the reasoning now live
    // in lib/light.ts, shared with the specimen index, which is also light.
    const dropLight = light && w.firstElementChild
      ? addLightSurface(w.firstElementChild as HTMLElement)
      : undefined;

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      dropLight?.();
    };
  }, [overscroll, focus, light]);

  return (
    <div className={`stripwrap ${wrapClass ?? ""}`} ref={wrap}>
      <div className="strip-pin">
        {label}
        <div className={`strip ${className ?? ""}`} ref={band}>
          <div className="strip-track" ref={track}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Strip;
