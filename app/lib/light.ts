import { onFrame } from "./raf";

/**
 * Which sections are light, and whether one is under the chrome right now.
 *
 * The header is cream. Over a cream section it is cream on cream and simply
 * vanishes, so it has to invert to ink for exactly as long as a light surface
 * is beneath it — and there is now more than one such surface (the wall and
 * the specimen index), which is why this is a shared registry rather than
 * something the wall owns.
 *
 * The test is COVERAGE, not overlap. An earlier version used an
 * IntersectionObserver against the top 9% of the viewport, which fires the
 * moment a band *touches* the header — so on the way out the chrome stayed
 * inked while only its top edge was still over cream and its lower half was
 * already over the dark section beneath. Ink on ink. The question is whether
 * the band covers the header's box, so that is what gets measured.
 *
 * One frame loop for all registrants, started on the first and stopped on the
 * last, so an empty registry costs nothing.
 */

const surfaces = new Set<HTMLElement>();
let stop: (() => void) | undefined;
let on = false;

function tick() {
  const header = document.querySelector<HTMLElement>(".top");
  if (!header) return;
  const h = header.getBoundingClientRect();

  let covered = false;
  for (const el of surfaces) {
    const r = el.getBoundingClientRect();
    // A pixel of tolerance: sticky elements routinely land on fractional
    // pixels and an exact comparison simply never matches.
    if (r.top <= h.top + 1 && r.bottom >= h.bottom - 1) {
      covered = true;
      break;
    }
  }

  if (covered === on) return;
  on = covered;
  const root = document.documentElement;
  if (covered) root.dataset.light = "";
  else delete root.dataset.light;
}

/** Register a light surface. Returns an unregister function. */
export function addLightSurface(el: HTMLElement) {
  surfaces.add(el);
  if (!stop) stop = onFrame(tick);

  return () => {
    surfaces.delete(el);
    if (surfaces.size === 0) {
      stop?.();
      stop = undefined;
      on = false;
      delete document.documentElement.dataset.light;
    }
  };
}
