"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TIMELINE_ITEMS = [
  { time: "09:00", label: "COME TOGETHER", isAnchor: true },
  { time: null, label: "BB FUNCTIONS", isAnchor: false },
  { time: null, label: "BB LEGAL STRUCTURE", isAnchor: false },
  { time: null, label: "Q&A", isAnchor: false },
  { time: null, label: "BREAK", isAnchor: false, isBreak: true },
  { time: null, label: "SERIAL NUMBERS", isAnchor: false },
  { time: null, label: "CARD DESIGN & MANUFACTURING", isAnchor: false },
  { time: null, label: "LEDGER PHONE BB", isAnchor: false },
  { time: null, label: "PORSCHE DRIVE BB", isAnchor: false },
  { time: null, label: "WHITE LABEL BB", isAnchor: false },
  { time: null, label: "MINING", isAnchor: false },
  { time: null, label: "WATER PROJECT", isAnchor: false },
  { time: null, label: "TRADING", isAnchor: false },
  { time: "17:00", label: "FINISH", isAnchor: true },
];

export function Day1Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dayLabelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const scrollHeight = TIMELINE_ITEMS.length * 120;

      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );

      // Day label reveal
      gsap.fromTo(
        dayLabelRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );

      // Pin the section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${scrollHeight}px`,
        pin: true,
        pinSpacing: true,
      });

      // Animate each timeline item
      itemRefs.current.forEach((item, i) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 120 - 60}px top`,
              end: `top+=${i * 120 + 60}px top`,
              scrub: false,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Subtle vertical lines decoration */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #9B8EC4 0px, #9B8EC4 1px, transparent 1px, transparent 120px)",
        }}
      />

      <div
        ref={wrapperRef}
        className="relative z-10 max-w-6xl mx-auto px-8 py-20 min-h-screen flex"
      >
        {/* Left: Day label */}
        <div
          ref={dayLabelRef}
          className="flex-shrink-0 w-32 mr-16 flex flex-col pt-2"
          style={{ opacity: 0 }}
        >
          <p
            className="text-xs tracking-[0.5em] uppercase mb-2"
            style={{ color: "#9B8EC4" }}
          >
            Day
          </p>
          <p
            className="text-7xl font-bold"
            style={{ color: "rgba(155,142,196,0.15)", lineHeight: 1 }}
          >
            01
          </p>
          <div
            className="mt-4 w-px flex-1"
            style={{
              background:
                "linear-gradient(to bottom, #9B8EC4, transparent)",
              maxHeight: "200px",
            }}
          />
        </div>

        {/* Center: Header + Timeline */}
        <div className="flex-1">
          {/* Section header */}
          <div ref={headerRef} className="mb-16" style={{ opacity: 0 }}>
            <p
              className="text-xs tracking-[0.5em] uppercase mb-4"
              style={{ color: "#9B8EC4" }}
            >
              May 22, 2026 · Agenda
            </p>
            <h2 className="text-5xl sm:text-6xl font-bold uppercase tracking-[0.12em] text-white">
              Day 1
            </h2>
            <p
              className="text-sm tracking-[0.3em] uppercase mt-2 font-light"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Full Day Schedule
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[5px] top-0 bottom-0 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, #9B8EC4, rgba(155,142,196,0.1))",
              }}
            />

            {/* Items */}
            <div className="flex flex-col gap-1">
              {TIMELINE_ITEMS.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="relative flex items-center gap-6 py-3"
                  style={{ opacity: 0 }}
                >
                  {/* Dot */}
                  <div
                    className="flex-shrink-0 w-[11px] h-[11px] rounded-full border relative z-10"
                    style={{
                      borderColor: item.isAnchor ? "#9B8EC4" : "rgba(155,142,196,0.4)",
                      background: item.isAnchor ? "#9B8EC4" : "transparent",
                    }}
                  />

                  {/* Content */}
                  <div className="flex items-baseline gap-4">
                    {item.time && (
                      <span
                        className="text-sm font-mono tracking-[0.2em]"
                        style={{ color: "#9B8EC4", minWidth: "52px" }}
                      >
                        {item.time}
                      </span>
                    )}
                    <span
                      className={`uppercase tracking-[0.18em] font-${
                        item.isAnchor ? "semibold" : "light"
                      } ${
                        item.isBreak
                          ? "text-sm"
                          : item.isAnchor
                          ? "text-2xl"
                          : "text-base"
                      }`}
                      style={{
                        color: item.isAnchor
                          ? "#fff"
                          : item.isBreak
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(255,255,255,0.75)",
                        marginLeft: !item.time ? "68px" : "0",
                      }}
                    >
                      {item.label}
                    </span>
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
