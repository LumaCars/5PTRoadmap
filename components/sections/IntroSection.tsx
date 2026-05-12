"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CharReveal } from "@/components/ui/CharReveal";

const LINE1 = "FROM THE EARTH";
const LINE2 = "TO THE FUTURE.";
const TOTAL_CHARS = LINE1.length + LINE2.length;

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [blackoutGone, setBlackoutGone] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      pinSpacing: true,
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 800ms blackout fade-out */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none"
        style={{ zIndex: 60 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationComplete={() => setBlackoutGone(true)}
      />

      {/* Subtle dark tint so text is readable over canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(5,5,5,0.45)", zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6" style={{ zIndex: 2 }}>
        {/* 5PT Logo */}
        {blackoutGone && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            onAnimationComplete={() => setLogoReady(true)}
          >
            <Image
              src="/5pt logo .png"
              alt="5PT"
              width={200}
              height={100}
              priority
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        )}

        {/* Headline */}
        {logoReady && (
          <>
            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
            >
              <span className="block">
                <CharReveal text={LINE1} stagger={0.035} delay={0} />
              </span>
              <span className="block" style={{ color: "#9B8EC4" }}>
                <CharReveal text={LINE2} stagger={0.035} delay={LINE1.length * 0.035 + 0.05} />
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="font-label tracking-[0.4em] uppercase"
              style={{ fontSize: "0.85rem", color: "#9B8EC4", opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: TOTAL_CHARS * 0.035 + 0.5,
                duration: 0.7,
              }}
            >
              MAY 22–24, 2026 &nbsp;·&nbsp; DUBAI
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: TOTAL_CHARS * 0.035 + 1.1, duration: 0.6 }}
            >
              <motion.div
                style={{
                  width: "1px",
                  height: "44px",
                  background: "#9B8EC4",
                  transformOrigin: "top",
                  animation: "vertical-pulse 2s ease-in-out infinite",
                }}
              />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1L6 7L11 1"
                  stroke="#9B8EC4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
