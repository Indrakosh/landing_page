"use client";

import { useEffect, useRef, useState } from "react";
import { Parallax } from "./Reveal";
import Kinetic from "./Kinetic";
import Sweep from "./Sweep";
import { onFrame, prefersReducedMotion } from "../lib/raf";

type Frame = { src: string; alt: string };

/**
 * One chapter, as a cluster.
 *
 * The previous version was one pinned picture beside one column of copy —
 * a layout. This is three frames at three different sizes, bleeding off
 * opposite edges at different heights, with the statement dropped into the
 * negative space between them. That is a composition, and the difference is
 * the whole reason the reference has more pull than we did.
 *
 * The sticky pin is gone with it, and deliberately: pinning made sense when
 * there was exactly one picture to hold still, and it cannot survive three
 * frames that are meant to drift past each other at different rates. What
 * replaces it is parallax at three different speeds, which is what makes the
 * cluster read as depth rather than as a collage.
 *
 * The copy still waits — but for the lead frame arriving rather than for a
 * timer, and it latches, because text that re-hides when you scroll back up
 * reads as a bug rather than as an effect.
 */
export function Chapter({
  n,
  k,
  t,
  q,
  b,
  img,
  alt,
  more,
}: {
  n: number;
  k: string;
  t: string;
  q: string;
  b: string;
  img: string;
  alt: string;
  more: Frame[];
}) {
  const lead = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const el = lead.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setArrived(true);
      return;
    }
    const stop = onFrame(() => {
      // Open once the lead frame is meaningfully on screen — its top has risen
      // past three quarters of the viewport.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.75) {
        setArrived(true);
        stop();
      }
    });
    return stop;
  }, []);

  return (
    <section className="ch" data-n={n} data-arrived={arrived ? "" : undefined} aria-label={t}>
      {/* Three frames, three parallax rates. No two pictures on this page move
          at the same speed — that difference is what makes the cluster read as
          depth instead of as a pile. */}
      <figure className="ch-a" ref={lead}>
        <Parallax amount={7} className="ch-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={alt} loading="lazy" decoding="async" />
        </Parallax>
      </figure>

      <figure className="ch-b2">
        <Parallax amount={16} className="ch-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={more[0].src} alt={more[0].alt} loading="lazy" decoding="async" />
        </Parallax>
      </figure>

      <figure className="ch-c">
        <Parallax amount={26} className="ch-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={more[1].src} alt={more[1].alt} loading="lazy" decoding="async" />
        </Parallax>
      </figure>

      {/* The statement sits in the gap the frames leave, and laps their edges.
          Type that never touches a picture is a caption; type the pictures run
          under is a layer. */}
      <div className="ch-copy">
        <p className="ch-k">
          <span>{k}</span>
          {t}
        </p>
        <Kinetic
          as="h2"
          words={q.replace(/\.$/, "").split(" ")}
          className="ch-q"
          step={46}
          play={arrived}
        />
      </div>

      {/* Body copy is tucked into its own corner of the cluster, small, the way
          the reference keeps its micro-labels well away from the statement. */}
      <Sweep text={b} className="ch-b" spread={7} />
    </section>
  );
}

export default Chapter;
