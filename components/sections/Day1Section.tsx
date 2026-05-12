"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hasInteracted } from "@/lib/audioInteraction";

interface ScheduleItem {
  time: string | null;
  label: string;
  subs: string[];
  isBreak?: boolean;
}

const SCHEDULE: ScheduleItem[] = [
  { time: "09:00", label: "COME TOGETHER", subs: [] },
  {
    time: "09:15",
    label: "BORDERLESS BANKING FUNCTIONS",
    subs: ["Platform Overview", "Banking Features", "Crypto Integration", "Card Infrastructure"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING LEGAL STRUCTURE",
    subs: ["International Structure", "Compliance & Regulations", "Licensing Overview"],
  },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: null, label: "— BREAK —", subs: [], isBreak: true },
  {
    time: null,
    label: "BORDERLESS BANKING SERIAL NUMBERS",
    subs: ["Limited Editions", "High-End Numbering System", "Collector Concepts"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING CARD DESIGN & MANUFACTURING",
    subs: ["Metal Cards", "Diamond Cards", "Luxury Production Process"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING LEDGER PHONE",
    subs: ["Secure Device Concept", "Self Custody & Security"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING PORSCHE DRIVE",
    subs: ["Mobility & Luxury Integration", "Partnership Concepts"],
  },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: null, label: "— BREAK —", subs: [], isBreak: true },
  {
    time: null,
    label: "BORDERLESS BANKING WHITE LABEL — DISTRIBUTION MODEL",
    subs: ["Partner Structure", "White Label Opportunities", "Revenue Streams"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING MINING",
    subs: ["Mining Infrastructure", "Mining Concepts", "Revenue Models"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING WATER PROJECT",
    subs: ["Infrastructure Overview", "International Expansion Concepts"],
  },
  {
    time: null,
    label: "BORDERLESS BANKING TRADING",
    subs: ["Trading Structures", "Market Concepts", "Opportunities"],
  },
  { time: null, label: "Q&A SESSION", subs: [] },
  { time: "17:00", label: "FINISH", subs: [] },
];

const N = SCHEDULE.length; // 17
const PIN_VH = 180;        // vh per item

export function Day1Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swipeRef = useRef<HTMLAudioElement | null>(null);

  const setItemRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    // Single reusable swipe sound instance
    const swipe = new Audio(
      "https://d6gmlk5qn4ikdodg.public.blob.vercel-storage.com/swipe.mp3"
    );
    swipe.volume = 0.5;
    swipeRef.current = swipe;

    // 17 items × 180vh
    const pinDist = (window.innerHeight * N * PIN_VH) / 100;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      SCHEDULE.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        // Odd indices (0,2,4…) nudge from LEFT; even from RIGHT — subtle fade, not off-screen
        const nudge = i % 2 === 0 ? -80 : 80;

        // Fade in [i → i+0.15]
        tl.fromTo(
          el,
          { x: nudge, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
            onStart: () => {
              if (!hasInteracted()) return;
              const s = swipeRef.current;
              if (!s) return;
              s.currentTime = 0;
              s.play().catch(() => {});
            },
          },
          i
        );

        // Fade out [i+0.85 → i+1] — back the same direction
        tl.to(
          el,
          { x: nudge, opacity: 0, duration: 0.15, ease: "power2.in" },
          i + 0.85
        );
      });

      // Progress bar scaleX 0→1 across the full timeline
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: N, ease: "none" },
        0
      );

      // Fade out the entire progress bar (track + fill) near the end
      tl.to(
        progressTrackRef.current,
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        N - 0.5
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDist}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        animation: tl,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh]"
      style={{ background: "transparent", overflow: "hidden" }}
    >
      {/* Top-left corner label — always visible */}
      <p
        aria-hidden
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.65rem",
          color: "#9B8EC4",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        DAY 01 &nbsp;·&nbsp; MAY 23, 2026 &nbsp;·&nbsp; FULL DAY SCHEDULE
      </p>

      {/* DAY 1 watermark — massive, left side */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-bebas-neue)",
          fontSize: "25vw",
          color: "rgba(255,255,255,0.12)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          paddingLeft: "1rem",
          zIndex: 1,
        }}
      >
        DAY 1
      </div>

      {/* Items — absolutely stacked, overflow hidden clips fly animations */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {SCHEDULE.map((item, i) => (
          <div
            key={i}
            ref={(el) => setItemRef(el, i)}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 8vw",
              opacity: 0,
            }}
          >
            {/* Time */}
            {item.time && (
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.75rem",
                  color: "#9B8EC4",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {item.time}
              </p>
            )}

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-bebas-neue)",
                fontSize: item.isBreak ? "4vw" : "7vw",
                color: item.isBreak ? "rgba(240,238,245,0.3)" : "#F0EEF5",
                lineHeight: 1,
                letterSpacing: item.isBreak ? "0.4em" : "0.05em",
                marginBottom: item.subs.length > 0 ? "1.5rem" : 0,
                textShadow: "0 0 40px rgba(0,0,0,0.8)",
              }}
            >
              {item.label}
            </h2>

            {/* Sub-items */}
            {item.subs.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.375rem 1.5rem",
                }}
              >
                {item.subs.map((sub, j) => (
                  <span
                    key={j}
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: "0.85rem",
                      color: "rgba(240,238,245,0.5)",
                      letterSpacing: "0.2em",
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

      {/* Progress bar — lavender, scaleX 0→1, fades out when complete */}
      <div
        ref={progressTrackRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(155,142,196,0.15)",
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: "100%",
            background: "#9B8EC4",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </section>
  );
}
