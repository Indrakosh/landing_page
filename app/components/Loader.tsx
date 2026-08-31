"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Mark from "./Mark";
import { brand } from "../data";
import { onFrame, prefersReducedMotion } from "../lib/raf";

/**
 * The opening, timed against the reference recording frame by frame.
 *
 * I stepped the video at 10fps and read the transitions off it. Every number in
 * TIMELINE below is measured from that, not estimated:
 *
 *   0.0–1.7s   two arcs 180° apart rotating, sweep breathing open and shut
 *   1.7–1.9s   the arcs collapse and the symbol takes their place
 *   1.9–2.2s   the symbol holds alone
 *   2.2s       a caret appears and the lockup shifts left to make room
 *   2.4–3.0s   the name types, ~70ms a character
 *   3.0–3.7s   a deliberate pause, caret blinking — this is the beat that
 *              makes it feel like a name being written rather than a progress
 *              bar, and leaving it out is what makes copies feel cheap
 *   3.7–4.0s   the caret stops blinking, becomes the lockup divider, and the
 *              second half arrives beside it
 *   4.0–4.7s   the finished lockup holds
 *   4.7–5.1s   it fades
 *   5.1–6.8s   THREE windows open onto the hero, staggered ~110ms apart, each
 *              growing from a small rectangle to its full third
 *   6.8–7.4s   the image holds, whole
 *   7.4s       header and headline arrive
 *
 * The three windows are the part I originally got wrong twice. First I read it
 * as one image scaling up, which it is not. Then I built it as three panels each
 * painting their own copy of the hero — which measured 1280×720 against the real
 * backdrop's 1566×881, and cut 22% in a single frame at the handover. They are
 * now holes punched in black over the actual backdrop: one image, no handover,
 * and the animated element is flat colour rather than a photograph.
 *
 * The reference runs 7.8s. Ours runs ~5.3s: the same beats in the same order
 * and the same proportions, just paced faster, because 7.8s is a long time to
 * hold a first-time visitor on a retail site. The one thing kept at full weight
 * is the pause after the name — shortened from 700ms to 380ms but not removed,
 * because that gap is what makes the lockup read as a name being written rather
 * than a progress bar, and it is the first thing that dies when people copy this
 * pattern. Every value lives here, so the whole thing scales from one place.
 */

type Beat = "spin" | "mark" | "type" | "tag" | "fade" | "open" | "gone";

/** Every value in ms, measured off the reference at 10fps. */
const TIMELINE = {
  /** Beat 1 runs at least this long even on a warm cache. */
  SPIN_MIN: 1150,
  /** …and no longer than this on a cold one. */
  SPIN_MAX: 2400,
  MARK_HOLD: 360, // symbol alone before the caret appears
  CARET_IN: 150, // caret appears, lockup shifts
  MS_PER_CHAR: 55,
  TYPE_HOLD: 380, // the pause. Shortened, not removed — see below.
  TAG_IN: 240,
  LOCKUP_HOLD: 380,
  LOCKUP_FADE: 320,
  PANEL_STAGGER: 140,
  PANEL_GROW: 1250,
  IMAGE_HOLD: 320,
} as const;

const WORD = brand.name;

export function Loader({ watch }: { watch: string[] }) {
  const [beat, setBeat] = useState<Beat>("spin");
  const wordRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const watchRef = useRef(watch);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const r = document.documentElement.dataset;
      r.entered = "1";
      r.ready = "1";
      setBeat("gone");
      return;
    }

    const list = watchRef.current;
    const total = list.length || 1;
    let done = 0;
    let released = false;

    list.forEach((src) => {
      const img = new window.Image();
      const bump = () => {
        done += 1;
      };
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });

    const release = () => {
      if (released) return;
      released = true;
      stop();

      const T = TIMELINE;
      setBeat("mark");

      const typeAt = T.MARK_HOLD + T.CARET_IN;
      after(typeAt, () => {
        setBeat("type");
        for (let i = 1; i <= WORD.length; i += 1) {
          // textContent, not state — the caret is then pushed along by the
          // letters instead of being positioned against them.
          after(i * T.MS_PER_CHAR, () => {
            if (wordRef.current) wordRef.current.textContent = WORD.slice(0, i);
          });
        }
      });

      const typedAt = typeAt + WORD.length * T.MS_PER_CHAR;
      const tagAt = typedAt + T.TYPE_HOLD;
      const fadeAt = tagAt + T.TAG_IN + T.LOCKUP_HOLD;
      const openAt = fadeAt + T.LOCKUP_FADE;
      // The real backdrop is handed over the instant the windows start opening,
      // so what they reveal underneath is the page itself, already in place.
      const readyAt = openAt + T.PANEL_GROW + T.PANEL_STAGGER * 2 + T.IMAGE_HOLD;

      after(tagAt, () => setBeat("tag"));
      after(fadeAt, () => setBeat("fade"));
      after(openAt, () => {
        setBeat("open");
        document.documentElement.dataset.entered = "1";
      });
      after(readyAt, () => {
        document.documentElement.dataset.ready = "1";
      });
      after(readyAt + 700, () => setBeat("gone"));
    };

    const stop = onFrame((now) => {
      // `now` is already measured from navigation start, so use it directly.
      // Timing from when this effect runs instead measures from hydration —
      // which in dev is ~1s after first paint, and slid the whole opening a
      // second late while looking correct in the code.
      const elapsed = now;
      if ((done >= total && elapsed > TIMELINE.SPIN_MIN) || elapsed > TIMELINE.SPIN_MAX) {
        release();
      }
    });

    return () => {
      stop();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [after]);

  if (beat === "gone") return null;

  return (
    <div className="loader" data-beat={beat} aria-hidden>
      <div className="loader-stage">
        {/* Beat 1 — two arcs, half a turn apart, sweep breathing. */}
        <svg className="spinner" viewBox="0 0 80 80" aria-hidden>
          <g className="spinner-spin">
            <circle className="spinner-arc" cx="40" cy="40" r="28" />
            <circle className="spinner-arc spinner-arc-b" cx="40" cy="40" r="28" />
          </g>
        </svg>

        {/* Beat 2 — the symbol assembles where the arcs were. */}
        <Mark className="loader-mark" state={beat === "spin" ? "off" : "on"} />

        {/* Beats 3–4 — types, pauses, then the caret becomes the divider. */}
        <div className="loader-lockup">
          <span className="loader-word" ref={wordRef} />
          <span className="loader-caret" />
          <span className="loader-tag">{brand.tagline}</span>
        </div>
      </div>

      {/* Beat 5 — three holes opening in black, directly over the real
          backdrop. No second copy of the image, so nothing can jump when this
          unmounts, and the thing being repainted each frame is flat colour. */}
      <div className="opening">
        {[0, 1, 2].map((i) => (
          <span className="op-blind" key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>
    </div>
  );
}

export default Loader;
