"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScheduleItem {
  time: string | null;
  label: string;
  subs: string[];
  isBreak?: boolean;
  isAnchor?: boolean;
}

const SCHEDULE: ScheduleItem[] = [
  { time: "09:00", label: "COME TOGETHER", subs: [], isAnchor: true },
  {
    time: "09:15",
    label: "BB FUNCTIONS",
    subs: ["Platform Overview", "Banking Features", "Crypto Integration", "Card Infrastructure"],
  },
  {
    time: null,
    label: "BB LEGAL STRUCTURE",
    subs: ["International Structure", "Compliance", "Licensing"],
  },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: null, label: "BREAK", subs: [], isBreak: true },
  {
    time: null,
    label: "SERIAL NUMBERS",
    subs: ["Limited Editions", "High-End Numbering", "Collector Concepts"],
  },
  {
    time: null,
    label: "CARD DESIGN",
    subs: ["Metal Cards", "Diamond Cards", "Luxury Production"],
  },
  { time: null, label: "LEDGER PHONE BB", subs: ["Secure Device", "Self Custody"] },
  { time: null, label: "PORSCHE DRIVE BB", subs: ["Mobility", "Luxury Integration"] },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: null, label: "BREAK", subs: [], isBreak: true },
  { time: null, label: "WHITE LABEL BB", subs: ["Partner Structure", "Revenue Streams"] },
  { time: null, label: "MINING", subs: ["Infrastructure", "Revenue Models"] },
  {
    time: null,
    label: "WATER PROJECT",
    subs: ["Infrastructure", "International Expansion"],
  },
  { time: null, label: "TRADING", subs: ["Market Concepts", "Opportunities"] },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: "17:00", label: "FINISH", subs: [], isAnchor: true },
];

export function Day1Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const vh = window.innerHeight;
    const pinDist = vh * 9;
    const step = pinDist / SCHEDULE.length;

    const ctx = gsap.context(() => {
      // Pin section for 900vh
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDist}`,
        pin: true,
        pinSpacing: true,
      });

      // Header
      gsap.from(headerRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Vertical timeline line grows with scroll progress
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${pinDist}`,
            scrub: 0.4,
          },
        }
      );

      // Per-item reveal with current/past/future state
      SCHEDULE.forEach((_, i) => {
        const itemEl = itemRefs.current[i];
        if (!itemEl) return;

        // Set initial state: hidden off-left
        gsap.set(itemEl, { x: -50, opacity: 0 });

        const enterStart = i * step;
        const enterEnd = (i + 1) * step;

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${enterStart} top`,
          end: `top+=${enterEnd} top`,
          onEnter: () => {
            // Become active
            gsap.to(itemEl, {
              x: 0,
              opacity: 1,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out",
              willChange: "transform",
              onComplete: () => gsap.set(itemEl, { willChange: "auto" }),
            });
          },
          onLeave: () => {
            // Become past: dimmed
            gsap.to(itemEl, {
              opacity: 0.3,
              scale: 1,
              duration: 0.35,
              ease: "power1.out",
            });
          },
          onEnterBack: () => {
            // Re-activate when scrolling back
            gsap.to(itemEl, {
              opacity: 1,
              scale: 1.02,
              duration: 0.4,
              ease: "power2.out",
            });
            // Hide items ahead that had been revealed
            for (let j = i + 1; j < SCHEDULE.length; j++) {
              const nextEl = itemRefs.current[j];
              if (nextEl) gsap.to(nextEl, { opacity: 0, x: -50, scale: 1, duration: 0.2 });
            }
          },
          onLeaveBack: () => {
            // Hide again when scrolling back before this item
            gsap.to(itemEl, {
              opacity: 0,
              x: -50,
              scale: 1,
              duration: 0.3,
              ease: "power1.in",
            });
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ background: "rgba(5,5,5,0.82)" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-20 min-h-[100dvh] flex gap-16">
        {/* Left: Day label */}
        <div className="flex-shrink-0 w-24 pt-1 flex flex-col">
          <p
            className="font-label tracking-[0.5em] uppercase"
            style={{ fontSize: "0.6rem", color: "#9B8EC4" }}
          >
            Day
          </p>
          <p
            className="font-display"
            style={{ fontSize: "5rem", color: "rgba(155,142,196,0.1)", lineHeight: 1 }}
          >
            01
          </p>
          <p
            className="font-label tracking-[0.35em] uppercase mt-2"
            style={{ fontSize: "0.6rem", color: "rgba(240,238,245,0.25)" }}
          >
            May 22
          </p>
        </div>

        {/* Right: timeline */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div ref={headerRef} className="mb-14" style={{ opacity: 0 }}>
            <p
              className="font-label tracking-[0.5em] uppercase mb-3"
              style={{ fontSize: "0.65rem", color: "#9B8EC4" }}
            >
              May 22, 2026 · Full Day Schedule
            </p>
            <h2
              className="font-display leading-none"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#F0EEF5" }}
            >
              Day 1
            </h2>
          </div>

          {/* Timeline wrapper */}
          <div className="relative">
            {/* Vertical line */}
            <div
              ref={lineRef}
              className="absolute left-0 top-0 bottom-0"
              style={{
                width: "1px",
                background: "linear-gradient(to bottom, #9B8EC4, rgba(155,142,196,0.15))",
                transformOrigin: "top",
              }}
            />

            {/* Items */}
            <div className="flex flex-col pl-8">
              {SCHEDULE.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => setItemRef(el, i)}
                  className="relative py-4 flex items-start gap-5"
                >
                  {/* Dot on timeline */}
                  <div
                    className="absolute -left-8 top-[22px] -translate-x-[4.5px] flex-shrink-0"
                    style={{ width: "9px", height: "9px" }}
                  >
                    <div
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        border: `1px solid ${item.isAnchor ? "#9B8EC4" : "rgba(155,142,196,0.4)"}`,
                        background: item.isAnchor ? "#9B8EC4" : "transparent",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-4 flex-wrap">
                      {item.time && (
                        <span
                          className="font-label tracking-[0.2em] flex-shrink-0"
                          style={{ fontSize: "0.78rem", color: "#9B8EC4" }}
                        >
                          {item.time}
                        </span>
                      )}
                      <span
                        className={`font-display leading-none ${item.isBreak ? "" : ""}`}
                        style={{
                          fontSize: item.isAnchor
                            ? "clamp(1.6rem, 3vw, 2.4rem)"
                            : item.isBreak
                            ? "1.1rem"
                            : "clamp(1.4rem, 2.5vw, 2rem)",
                          color: item.isBreak
                            ? "rgba(240,238,245,0.3)"
                            : item.isAnchor
                            ? "#F0EEF5"
                            : "#F0EEF5",
                          letterSpacing: item.isBreak ? "0.35em" : "0.06em",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {item.subs.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
                        {item.subs.map((sub, j) => (
                          <span
                            key={j}
                            className="font-label"
                            style={{
                              fontSize: "0.65rem",
                              color: "rgba(155,142,196,0.6)",
                              letterSpacing: "0.25em",
                              textTransform: "uppercase",
                            }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
