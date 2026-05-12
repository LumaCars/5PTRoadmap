"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

const ARC_PATH = "M80,230 C200,40 740,40 870,230";

export function JourneySection() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <JourneyMobile />;
  }

  return <JourneyDesktop />;
}

/* -------------------------------------------------------------------------- */
/*  DESKTOP — original pinned, arc-draw + plane-on-path layout                 */
/* -------------------------------------------------------------------------- */
function JourneyDesktop() {
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
      <div className="relative z-10 w-full max-w-6xl px-10 py-16 flex flex-col items-center">
        {/* Section label */}
        <div ref={titleRef} className="mb-16 text-center" style={{ opacity: 0 }}>
          <p
            className="font-label tracking-[0.5em] uppercase mb-3"
            style={{ fontSize: "0.75rem", color: "#9B8EC4" }}
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

        {/* City panels + arc — flex row */}
        <div className="flex items-center w-full gap-10 mb-14">
          {/* Left: MUC */}
          <div ref={leftRef} className="flex-shrink-0 w-56" style={{ opacity: 0 }}>
            <p
              className="font-display leading-none"
              style={{ fontSize: "clamp(3rem, 5vw, 5rem)", color: "#F0EEF5" }}
            >
              MUC
            </p>
            <p
              className="font-label tracking-[0.3em] uppercase mt-3"
              style={{ fontSize: "1rem", color: "#9B8EC4" }}
            >
              MÜNCHEN
            </p>
            <p
              className="font-label tracking-[0.28em] uppercase mt-4"
              style={{ fontSize: "0.9rem", color: "#F0EEF5" }}
            >
              MAY 22 · DEPARTURE
            </p>
          </div>

          {/* SVG arc */}
          <div className="flex-1 relative" style={{ height: "190px" }}>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 950 280"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              overflow="visible"
            >
              <path
                d={ARC_PATH}
                stroke="rgba(155,142,196,0.18)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                fill="none"
              />
              <path
                id="journey-arc"
                ref={arcRef}
                d={ARC_PATH}
                stroke="#9B8EC4"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="80" cy="230" r="4" fill="#9B8EC4" />
              <circle cx="870" cy="230" r="4" fill="#9B8EC4" />
              <g ref={planeRef} style={{ transform: "translate(80px,230px)" }}>
                <g transform="scale(0.7)">
                  <path d="M0 -9 L5 6 L0 3 L-5 6 Z" fill="#F0EEF5" />
                </g>
              </g>
            </svg>
          </div>

          {/* Right: DXB */}
          <div ref={rightRef} className="flex-shrink-0 w-56 text-right" style={{ opacity: 0 }}>
            <p
              className="font-display leading-none"
              style={{ fontSize: "clamp(3rem, 5vw, 5rem)", color: "#F0EEF5" }}
            >
              DXB
            </p>
            <p
              className="font-label tracking-[0.3em] uppercase mt-3"
              style={{ fontSize: "1rem", color: "#9B8EC4" }}
            >
              DUBAI
            </p>
            <p
              className="font-label tracking-[0.28em] uppercase mt-4"
              style={{ fontSize: "0.9rem", color: "#F0EEF5" }}
            >
              ARRIVAL · 23:40
            </p>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="w-16 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
          <span
            className="font-label tracking-[0.4em] uppercase"
            style={{ fontSize: "0.85rem", color: "rgba(240,238,245,0.6)" }}
          >
            FLIGHT DURATION APPROX. 6H
          </span>
          <div className="w-16 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  MOBILE — vertical stacked layout, no pin, smooth scroll                    */
/* -------------------------------------------------------------------------- */
function JourneyMobile() {
  const arcRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const arc = arcRef.current;
    if (!arc) return;

    const ctx = gsap.context(() => {
      const len = arc.getTotalLength();
      gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(arc, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: arc,
          start: "top 80%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: "4.5rem",
        paddingBottom: "4.5rem",
      }}
    >
      <div
        className="relative z-10"
        style={{
          width: "100%",
          maxWidth: "100vw",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        {/* Section label */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="font-label tracking-[0.45em] uppercase mb-2"
            style={{ fontSize: "0.65rem", color: "#9B8EC4" }}
          >
            The Journey
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: "2.5rem", color: "#F0EEF5" }}
          >
            München <span style={{ color: "#9B8EC4" }}>&rarr;</span> Dubai
          </h2>
        </motion.div>

        {/* MUC */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <p
            className="font-display leading-none"
            style={{ fontSize: "3.75rem", color: "#F0EEF5" }}
          >
            MUC
          </p>
          <p
            className="font-label tracking-[0.3em] uppercase mt-2"
            style={{ fontSize: "0.85rem", color: "#9B8EC4" }}
          >
            MÜNCHEN
          </p>
          <p
            className="font-label tracking-[0.28em] uppercase mt-2"
            style={{ fontSize: "0.7rem", color: "rgba(240,238,245,0.7)" }}
          >
            MAY 22 · DEPARTURE
          </p>
        </motion.div>

        {/* Vertical arc connector */}
        <div
          style={{
            position: "relative",
            width: "120px",
            height: "180px",
          }}
        >
          <svg
            viewBox="0 0 120 180"
            width="120"
            height="180"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              d="M60 5 C 10 60, 110 120, 60 175"
              stroke="rgba(155,142,196,0.18)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              ref={arcRef}
              d="M60 5 C 10 60, 110 120, 60 175"
              stroke="#9B8EC4"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="60" cy="5" r="4" fill="#9B8EC4" />
            <circle cx="60" cy="175" r="4" fill="#9B8EC4" />
          </svg>
        </div>

        {/* DXB */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <p
            className="font-display leading-none"
            style={{ fontSize: "3.75rem", color: "#F0EEF5" }}
          >
            DXB
          </p>
          <p
            className="font-label tracking-[0.3em] uppercase mt-2"
            style={{ fontSize: "0.85rem", color: "#9B8EC4" }}
          >
            DUBAI
          </p>
          <p
            className="font-label tracking-[0.28em] uppercase mt-2"
            style={{ fontSize: "0.7rem", color: "rgba(240,238,245,0.7)" }}
          >
            ARRIVAL · 23:40
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-8 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
          <span
            className="font-label tracking-[0.35em] uppercase"
            style={{ fontSize: "0.6rem", color: "rgba(240,238,245,0.6)" }}
          >
            FLIGHT ≈ 6H
          </span>
          <div className="w-8 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
        </motion.div>
      </div>
    </section>
  );
}
