"use client";

import { useState, useEffect } from "react";

/**
 * Mobile detection hook.
 * Returns false on the server and on first client render so the desktop
 * markup is rendered initially. Then re-checks after mount and on resize.
 * `null` is never returned — defaults to `false` to keep desktop layout
 * stable when hydrating.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
