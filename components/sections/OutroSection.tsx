"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { CharReveal } from "@/components/ui/CharReveal";

const DATES = ["MAY 22", "MAY 23", "MAY 24"];

export function OutroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const vh = window.innerHeight;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${vh * 2}`,
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
        },
      });

      tl.from(logoRef.current, {
        opacity: 0,
        scale: 0.88,
        duration: 1.2,
        ease: "power3.out",
      });

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "center",
          duration: 0.9,
          ease: "cubic-bezier(0.77,0,0.175,1)",
        },
        "-=0.6"
      );

      tl.from(
        subRef.current,
        { opacity: 0, y: 12, duration: 0.7, ease: "power2.out" },
        "+=0.2"
      );

      tl.from(
        datesRef.current,
        { opacity: 0, y: 10, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle dark tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(5,5,5,0.4)", zIndex: 1 }}
      />

      {/* Deep glow — camera is far in stars */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,142,196,0.06) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div
        className="relative flex flex-col items-center text-center px-8"
        style={{ zIndex: 2 }}
      >
        {/* Logo — larger than intro */}
        <div ref={logoRef} className="mb-10">
          <Image
            src="/5pt logo .png"
            alt="5PT"
            width={260}
            height={130}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Divider */}
        <div
          ref={lineRef}
          className="mb-10"
          style={{
            width: "100px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #9B8EC4 30%, #9B8EC4 70%, transparent)",
          }}
        />

        {/* Title char reveal (triggered via visibility) */}
        <motion.div
          ref={titleRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2
            className="font-display leading-none mb-8"
            style={{ fontSize: "clamp(3.5rem, 10vw, 11rem)" }}
          >
            <span className="block">
              <CharReveal text="THE FUTURE" stagger={0.028} />
            </span>
            <span className="block" style={{ color: "#9B8EC4" }}>
              <CharReveal text="STARTS HERE." stagger={0.028} delay={0.35} />
            </span>
          </h2>
        </motion.div>

        {/* Secret location */}
        <p
          ref={subRef}
          className="font-label tracking-[0.45em] uppercase mb-14"
          style={{ fontSize: "0.75rem", color: "#9B8EC4", opacity: 0 }}
        >
          Secret Location &nbsp;·&nbsp; Dubai
        </p>

        {/* Date dots */}
        <div
          ref={datesRef}
          className="flex items-center gap-10"
          style={{ opacity: 0 }}
        >
          {DATES.map((date, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span
                className="font-label tracking-[0.4em] uppercase"
                style={{ fontSize: "0.62rem", color: "rgba(155,142,196,0.55)" }}
              >
                {date}
              </span>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "rgba(155,142,196,0.45)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
