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
    label: "BORDERLESS BANKING FUNCTIONS",
    subs: ["Platform Overview", "Banking Features", "Crypto Integration", "Card Infrastructure"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING LEGAL STRUCTURE",
    subs: ["International Structure", "Compliance", "Licensing"],
  },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: null, label: "BREAK", subs: [], isBreak: true },
  {
    time: null,
    label: "BORDERLESS BANKING SERIAL NUMBERS",
    subs: ["Limited Editions", "High-End Numbering", "Collector Concepts"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING CARD DESIGN & MANUFACTURING",
    subs: ["Metal Cards", "Diamond Cards", "Luxury Production"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING LEDGER PHONE",
    subs: ["Secure Device", "Self Custody"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING PORSCHE DRIVE",
    subs: ["Mobility", "Luxury Integration"],
  },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: null, label: "BREAK", subs: [], isBreak: true },
  {
    time: null,
    label: "BORDERLESS BANKING WHITE LABEL",
    subs: ["Partner Structure", "Revenue Streams"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING MINING",
    subs: ["Infrastructure", "Revenue Models"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING WATER PROJECT",
    subs: ["Infrastructure", "International Expansion"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING TRADING",
    subs: ["Market Concepts", "Opportunities"],
  },
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

    const ctx = gsap.context(() => {
      // Header — fromTo so the explicit opacity:1 target is used
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );

      // Vertical line grows alongside scroll progress through the pin
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

      // Set all items hidden up front
      itemRefs.current.forEach((el) => {
        if (el) gsap.set(el, { x: -50, opacity: 0 });
      });

      // Build a timeline that reveals items one-by-one, then scrub it across the pin.
      // Using a timeline + scrub avoids the "pinned element position = 0" measurement
      // problem that makes individual per-item ScrollTriggers unreliable.
      const itemTl = gsap.timeline();
      SCHEDULE.forEach((_, i) => {
        const itemEl = itemRefs.current[i];
        if (!itemEl) return;
        // Slide-in the current item
        itemTl.to(
          itemEl,
          { x: 0, opacity: 1, scale: 1.02, duration: 0.5, ease: "power2.out" },
          i
        );
        // Dim the previous item as the next one arrives
        if (i > 0) {
          const prevEl = itemRefs.current[i - 1];
          if (prevEl) itemTl.to(prevEl, { opacity: 0.3, scale: 1, duration: 0.3 }, i);
        }
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDist}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        animation: itemTl,
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
      <div className="relative z-10 max-w-3xl mx-auto px-10 min-h-[100dvh] flex flex-col justify-center py-20">
        {/* Header — centered */}
        <div ref={headerRef} className="mb-16 text-center" style={{ opacity: 0 }}>
          <p
            className="font-label tracking-[0.5em] uppercase mb-3"
            style={{ fontSize: "0.65rem", color: "#9B8EC4" }}
          >
            Day 01 &nbsp;·&nbsp; May 22, 2026 &nbsp;·&nbsp; Full Day Schedule
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#F0EEF5" }}
          >
            Day 1
          </h2>
        </div>

        {/* Timeline — items are absolutely stacked so each gets the full container.
            Only the active item is visible at a time, no overflow clipping issues. */}
        <div className="relative" style={{ minHeight: "50vh" }}>
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

          {SCHEDULE.map((item, i) => (
            <div
              key={i}
              ref={(el) => setItemRef(el, i)}
              className="absolute inset-0 flex flex-col justify-center pl-12"
              style={{ opacity: 0 }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4.5px]"
                style={{ width: "9px", height: "9px", flexShrink: 0 }}
              >
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    border: `1px solid ${item.isAnchor ? "#9B8EC4" : "rgba(155,142,196,0.5)"}`,
                    background: item.isAnchor ? "#9B8EC4" : "transparent",
                  }}
                />
              </div>

              {/* Time + label row */}
              <div className="flex items-baseline gap-5 flex-wrap mb-4">
                {item.time && (
                  <span
                    className="font-label tracking-[0.2em] flex-shrink-0"
                    style={{ fontSize: "1rem", color: "#9B8EC4" }}
                  >
                    {item.time}
                  </span>
                )}
                <span
                  className="font-display leading-none"
                  style={{
                    fontSize: item.isAnchor
                      ? "clamp(2rem, 4.5vw, 4rem)"
                      : item.isBreak
                      ? "1.4rem"
                      : "clamp(1.6rem, 3.5vw, 3rem)",
                    color: item.isBreak ? "rgba(240,238,245,0.35)" : "#F0EEF5",
                    letterSpacing: item.isBreak ? "0.35em" : "0.06em",
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Sub-items */}
              {item.subs.length > 0 && (
                <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                  {item.subs.map((sub, j) => (
                    <span
                      key={j}
                      className="font-label"
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(155,142,196,0.7)",
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
          ))}
        </div>
      </div>
    </section>
  );
}
