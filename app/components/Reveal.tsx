"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { clamp, damp, onFrame, prefersReducedMotion, viewProgress } from "../lib/raf";

/**
 * Two small primitives that carry most of the page's motion.
 *
 * `Parallax` — a damped follow of scroll position. The damping is what matters:
 * mapping scroll straight onto transform gives you that rigid, sticky feeling
 * where the image is welded to the scrollbar. Letting it lag and settle is the
 * difference between "parallax" and "weight".
 *
 * `Unmask` — an image revealed by a clip-path wipe rather than a fade. A fade
 * is what you reach for when you have not decided what the motion means.
 */

export function Parallax({
  children,
  amount = 14,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** % of its own height the element travels across the whole pass. */
  amount?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cur = 0;
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    const stop = onFrame((_, dt) => {
      if (!visible) return;
      const p = viewProgress(el);
      cur = damp(cur, (p - 0.5) * 2 * amount, 8, dt);
      el.style.transform = `translate3d(0, ${cur.toFixed(2)}%, 0)`;
    });

    return () => {
      stop();
      io.disconnect();
    };
  }, [amount]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export function Unmask({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.dataset.mask = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.mask = "in";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`unmask ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** A number that counts up once, when it first becomes visible. */
export function Tally({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let v = 0;
      stop = onFrame((_, dt) => {
        v = damp(v, to, 4, dt);
        const shown = Math.round(v);
        el.textContent = `${shown}${suffix}`;
        if (to - v < 0.4) {
          el.textContent = `${to}${suffix}`;
          stop?.();
        }
      });
    });
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
    };
  }, [to, suffix]);

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  );
}
