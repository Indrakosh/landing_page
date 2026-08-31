"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { addLightSurface } from "../lib/light";

/**
 * A section that is a light surface.
 *
 * Its only job beyond rendering the section is to register itself so the page
 * chrome inverts to ink while this section is under it — see lib/light.ts for
 * why that is a coverage test rather than a visibility one.
 */
export function LightSurface({
  children,
  className,
  label,
  id,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return addLightSurface(el);
  }, []);

  return (
    <section ref={ref} className={className} id={id} aria-label={label}>
      {children}
    </section>
  );
}

export default LightSurface;
