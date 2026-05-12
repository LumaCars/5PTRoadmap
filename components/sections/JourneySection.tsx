"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function splitToChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="char" style={{ display: "inline-block" }}>
      {char === " " ? " " : char}
    </span>
  ));
}

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftInfoRef = useRef<HTMLDivElement>(null);
  const rightInfoRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal title on scroll enter
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.fromTo(
          chars,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // Reveal city info
      gsap.fromTo(
        [leftInfoRef.current, rightInfoRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      // Animate path drawing
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });
      }

      // Plane travels across flight path on scroll
      if (planeRef.current && pathRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          scrub: 1.5,
          onUpdate: (self) => {
            if (!pathRef.current || !planeRef.current) return;
            const progress = self.progress;
            const pathLength = pathRef.current.getTotalLength();
            const point = pathRef.current.getPointAtLength(
              progress * pathLength
            );
            const angle = getAngleAtPoint(pathRef.current, progress, pathLength);
            gsap.set(planeRef.current, {
              x: point.x - 12,
              y: point.y - 12,
              rotation: angle,
              transformOrigin: "center center",
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(155,142,196,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(155,142,196,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl px-8 py-20">
        {/* Section label */}
        <div ref={titleRef} className="mb-16 text-center">
          <p
            className="text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: "#9B8EC4" }}
          >
            {splitToChars("The Journey")}
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold uppercase tracking-[0.15em] text-white">
            München → Dubai
          </h2>
        </div>

        {/* Flight path visualization */}
        <div className="relative w-full" style={{ height: "260px" }}>
          {/* City labels */}
          <div
            ref={leftInfoRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-left"
            style={{ opacity: 0 }}
          >
            <p
              className="text-4xl font-bold tracking-[0.1em] uppercase"
              style={{ color: "#fff" }}
            >
              MUC
            </p>
            <p
              className="text-xs tracking-[0.35em] uppercase mt-1"
              style={{ color: "#9B8EC4" }}
            >
              München
            </p>
            <p
              className="text-sm tracking-[0.2em] uppercase mt-3 font-light"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              May 22 · Departure
            </p>
          </div>

          <div
            ref={rightInfoRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-right"
            style={{ opacity: 0 }}
          >
            <p
              className="text-4xl font-bold tracking-[0.1em] uppercase"
              style={{ color: "#fff" }}
            >
              DXB
            </p>
            <p
              className="text-xs tracking-[0.35em] uppercase mt-1"
              style={{ color: "#9B8EC4" }}
            >
              Dubai
            </p>
            <p
              className="text-sm tracking-[0.2em] uppercase mt-3 font-light"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Arrival · 23:40
            </p>
          </div>

          {/* SVG flight path */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 900 260"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashed background path */}
            <path
              d="M 100 200 Q 250 40 450 80 Q 650 120 800 190"
              stroke="rgba(155,142,196,0.2)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              fill="none"
            />
            {/* Animated foreground path */}
            <path
              ref={pathRef}
              d="M 100 200 Q 250 40 450 80 Q 650 120 800 190"
              stroke="#9B8EC4"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Departure dot */}
            <circle cx="100" cy="200" r="4" fill="#9B8EC4" />
            {/* Arrival dot */}
            <circle cx="800" cy="190" r="4" fill="#9B8EC4" />

            {/* Plane icon */}
            <g ref={planeRef} style={{ transform: "translate(-999px, -999px)" }}>
              <svg
                x="0"
                y="0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </g>
          </svg>
        </div>

        {/* Bottom detail strip */}
        <div className="mt-12 flex items-center justify-center gap-12">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-px"
              style={{ background: "#9B8EC4" }}
            />
            <span
              className="text-xs tracking-[0.4em] uppercase font-light"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Flight Duration ~6h
            </span>
            <div
              className="w-8 h-px"
              style={{ background: "#9B8EC4" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function getAngleAtPoint(
  path: SVGPathElement,
  progress: number,
  totalLength: number
): number {
  const delta = 2;
  const p1 = path.getPointAtLength(
    Math.max(0, progress * totalLength - delta)
  );
  const p2 = path.getPointAtLength(
    Math.min(totalLength, progress * totalLength + delta)
  );
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}
