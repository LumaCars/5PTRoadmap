"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function splitToChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="char" style={{ display: "inline-block" }}>
      {char === " " ? " " : char}
    </span>
  ));
}

export function EveningSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailRef = useRef<HTMLParagraphElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Time label
      gsap.fromTo(
        timeRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Title letter animation
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.fromTo(
          chars,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
          }
        );
      }

      // Details
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
        }
      );

      // Water shimmer continuous animation
      gsap.to(waterRef.current, {
        backgroundPosition: "100% 50%",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax on scroll
      gsap.to(waterRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#020208" }}
    >
      {/* Water reflection background */}
      <div
        ref={waterRef}
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #000 0%, #050515 30%, #0a0a2e 60%, #050518 80%, #000 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 60% at 50% 80%, rgba(155,142,196,0.06) 0%, transparent 70%)",
          animation: "water-shimmer 8s ease infinite",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Horizontal light lines (water reflections) */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full pointer-events-none"
          style={{
            top: `${55 + i * 8}%`,
            height: "1px",
            background: `rgba(155,142,196,${0.03 + i * 0.005})`,
            transform: `scaleX(${0.4 + i * 0.1})`,
            filter: "blur(1px)",
            animation: `breathe ${3 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-20 text-center px-8">
        {/* Time */}
        <p
          ref={timeRef}
          className="text-sm tracking-[0.5em] uppercase mb-8 font-light"
          style={{ color: "#9B8EC4", opacity: 0 }}
        >
          19:00 &nbsp;–&nbsp; 23:00
        </p>

        {/* Main title */}
        <h2
          ref={titleRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-[0.15em] text-white mb-10 leading-tight"
        >
          {splitToChars("YACHT DRIVE")}
          <br />
          <span style={{ color: "#9B8EC4" }}>
            {splitToChars("& NETWORKING")}
          </span>
          <br />
          {splitToChars("EVENT")}
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className="w-16 h-px"
            style={{ background: "rgba(155,142,196,0.4)" }}
          />
          <div
            className="w-2 h-2 rotate-45"
            style={{ background: "#9B8EC4" }}
          />
          <div
            className="w-16 h-px"
            style={{ background: "rgba(155,142,196,0.4)" }}
          />
        </div>

        {/* Detail */}
        <p
          ref={detailRef}
          className="text-base tracking-[0.35em] uppercase font-light"
          style={{ color: "rgba(255,255,255,0.45)", opacity: 0 }}
        >
          Dubai Marina &nbsp;·&nbsp; Evening Program
        </p>

        {/* Yacht icon */}
        <div className="mt-12 flex justify-center">
          <svg
            width="48"
            height="32"
            viewBox="0 0 48 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.4 }}
          >
            <path
              d="M4 24 Q24 8 44 24"
              stroke="#9B8EC4"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M2 26 H46"
              stroke="#9B8EC4"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d="M24 4 L24 24"
              stroke="#9B8EC4"
              strokeWidth="1"
            />
            <path
              d="M24 6 L36 22"
              stroke="#9B8EC4"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
