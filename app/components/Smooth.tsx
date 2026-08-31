"use client";

import { useEffect } from "react";
import { startSmoothScroll } from "../lib/smooth";

/** Mounts the page-wide scroll spring. Renders nothing. See lib/smooth.ts. */
export function Smooth() {
  useEffect(() => startSmoothScroll(), []);
  return null;
}

export default Smooth;
