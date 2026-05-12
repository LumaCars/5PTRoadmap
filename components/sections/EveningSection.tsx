"use client";

import { useRef, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const ShimmerLines = memo(function ShimmerLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full"
          style={{
            top: `${38 + i * 7}%`,
            height: "1px",
            background: `rgba(155,142,196,${0.04 + i * 0.004})`,
            animation: `shimmer-h ${10 + i * 1.8}s linear infinite`,
            animationDelay: `${i * -2.5}s`,
          }}
        />
      ))}
    </div>
  );
});

export function EveningSection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const vh = window.innerHeight;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${vh * 2}`,
          pin: true,
          pinSpacing: true,
        });
      }

      const textEls = [timeRef.current, titleRef.current, subRef.current];
      gsap.fromTo(
        textEls,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Background — Spline 3D scene on desktop only. On mobile we use a
          lightweight CSS gradient because a second WebGL context (alongside
          SpaceCanvas / R3F) reliably crashes iOS Safari and many Android
          browsers, surfacing as a "This page couldn't load" error. */}
      {!isMobile ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Spline scene="https://prod.spline.design/qs4F1eUxT8rhVinh/scene.splinecode" />
        </div>
      ) : (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(155,142,196,0.18) 0%, rgba(15,12,28,0.55) 45%, rgba(5,5,10,0.85) 100%)",
          }}
        />
      )}

      <ShimmerLines />

      <div className="relative z-10 text-center px-8">
        {/* Time */}
        <p
          ref={timeRef}
          className="font-label tracking-[0.5em] uppercase mb-8"
          style={{ fontSize: "0.8rem", color: "#9B8EC4", opacity: 0 }}
        >
          19:00 &nbsp;–&nbsp; 23:00
        </p>

        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display leading-none mb-10"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 9rem)",
            opacity: 0,
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
          }}
        >
          <span className="block" style={{ color: "#F0EEF5" }}>
            YACHT DRIVE &
          </span>
          <span className="block" style={{ color: "#9B8EC4" }}>
            NETWORKING
          </span>
          <span className="block" style={{ color: "#F0EEF5" }}>
            EVENT
          </span>
        </h2>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
          <div
            className="w-1.5 h-1.5 rotate-45"
            style={{ background: "#9B8EC4" }}
          />
          <div className="w-14 h-px" style={{ background: "rgba(155,142,196,0.35)" }} />
        </motion.div>

        {/* Sub */}
        <p
          ref={subRef}
          className="font-label tracking-[0.4em] uppercase"
          style={{ fontSize: "0.7rem", color: "rgba(240,238,245,0.4)", opacity: 0 }}
        >
          Dubai Marina &nbsp;·&nbsp; Evening Program
        </p>
      </div>
    </section>
  );
}
