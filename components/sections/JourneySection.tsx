"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { motion } from "framer-motion";

const ARC_PATH = "M80,230 C200,40 740,40 870,230";

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const arc = arcRef.current;
    const plane = planeRef.current;
    if (!section || !arc || !plane) return;

    const vh = window.innerHeight;
    const pinDist = vh * 2.5;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDist}`,
        pin: true,
        pinSpacing: true,
      });

      // Section label + city names stagger in
      const textEls = [titleRef.current, leftRef.current, rightRef.current];
      gsap.fromTo(
        textEls,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "cubic-bezier(0.23,1,0.32,1)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );

      // Stroke draw
      const len = arc.getTotalLength();
      gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(arc, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${pinDist}`,
          scrub: 1,
        },
      });

      // Plane travels arc
      gsap.to(plane, {
        motionPath: {
          path: "#journey-arc",
          align: "#journey-arc",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${pinDist}`,
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-5xl px-8 py-16">
        {/* Section label */}
        <div ref={titleRef} className="mb-12 text-center" style={{ opacity: 0 }}>
          <p
            className="font-label tracking-[0.5em] uppercase mb-3"
            style={{ fontSize: "0.7rem", color: "#9B8EC4" }}
          >
            The Journey
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", color: "#F0EEF5" }}
          >
            München &rarr; Dubai
          </h2>
        </div>

        {/* Flight path */}
        <div className="relative w-full" style={{ height: "280px" }}>
          {/* Left: MUC */}
          <div
            ref={leftRef}
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{ opacity: 0 }}
          >
            <p
              className="font-display leading-none"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#F0EEF5" }}
            >
              MUC
            </p>
            <p
              className="font-label tracking-[0.3em] uppercase mt-1"
              style={{ fontSize: "0.65rem", color: "#9B8EC4" }}
            >
              München
            </p>
            <p
              className="font-label tracking-[0.25em] uppercase mt-3"
              style={{ fontSize: "0.65rem", color: "rgba(240,238,245,0.4)" }}
            >
              May 22 · Departure
            </p>
          </div>

          {/* Right: DXB */}
          <div
            ref={rightRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-right"
            style={{ opacity: 0 }}
          >
            <p
              className="font-display leading-none"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#F0EEF5" }}
            >
              DXB
            </p>
            <p
              className="font-label tracking-[0.3em] uppercase mt-1"
              style={{ fontSize: "0.65rem", color: "#9B8EC4" }}
            >
              Dubai
            </p>
            <p
              className="font-label tracking-[0.25em] uppercase mt-3"
              style={{ fontSize: "0.65rem", color: "rgba(240,238,245,0.4)" }}
            >
              Arrival · 23:40
            </p>
          </div>

          {/* SVG arc */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 950 280"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            overflow="visible"
          >
            {/* Ghost dashed background */}
            <path
              d={ARC_PATH}
              stroke="rgba(155,142,196,0.18)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              fill="none"
            />

            {/* Animated stroke */}
            <path
              id="journey-arc"
              ref={arcRef}
              d={ARC_PATH}
              stroke="#9B8EC4"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* City dots */}
            <circle cx="80" cy="230" r="4" fill="#9B8EC4" />
            <circle cx="870" cy="230" r="4" fill="#9B8EC4" />

            {/* Plane — starts at MUC */}
            <g ref={planeRef} style={{ transform: "translate(80px,230px)" }}>
              <g transform="scale(0.7)">
                <path
                  d="M0 -9 L5 6 L0 3 L-5 6 Z"
                  fill="#F0EEF5"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Footer label */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="w-12 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
          <span
            className="font-label tracking-[0.4em] uppercase"
            style={{ fontSize: "0.65rem", color: "rgba(240,238,245,0.35)" }}
          >
            Flight Duration approx. 6h
          </span>
          <div className="w-12 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
        </motion.div>
      </div>
    </section>
  );
}
