"use client";

import { useState, useEffect } from "react";

/**
 * Mobile detection hook.
 *
 * The entire <App /> tree is loaded with `ssr: false` (see DynamicApp.tsx),
 * so `window` is always defined when this runs — meaning we can safely
 * resolve the initial value synchronously on the very first render. This
 * avoids the costly Desktop → Mobile remount cascade (which on mobile
 * Safari/Chrome was causing GSAP ScrollTrigger pin instability and
 * intermittent "page couldn't load" client exceptions).
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
