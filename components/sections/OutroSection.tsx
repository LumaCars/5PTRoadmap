"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function splitToChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="char" style={{ display: "inline-block" }}>
      {char === " " ? " " : char}
    </span>
  ));
}

export function OutroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      // Logo
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      );

      // Divider line
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.5"
      );

      // Title letters
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 24, rotateX: -30 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.03,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        );
      }

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.2"
      );

      // Ambient glow pulse
      gsap.to(".outro-glow", {
        opacity: 0.15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Background space image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/5pt space.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Heavier overlay for outro */}
      <div className="absolute inset-0 z-10 bg-black/80" />

      {/* Ambient glow */}
      <div
        className="outro-glow absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(155,142,196,0.08) 0%, transparent 70%)",
          opacity: 0.05,
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-8">
        {/* Logo */}
        <div ref={logoRef} className="mb-10" style={{ opacity: 0 }}>
          <Image
            src="/5pt logo .png"
            alt="5PT"
            width={140}
            height={70}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Divider */}
        <div
          ref={lineRef}
          className="mb-10"
          style={{
            width: "80px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #9B8EC4, transparent)",
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />

        {/* Main title */}
        <h2
          ref={titleRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-[0.15em] text-white mb-8 leading-tight"
          style={{ perspective: "800px" }}
        >
          {splitToChars("THE FUTURE")}
          <br />
          {splitToChars("STARTS HERE.")}
        </h2>

        {/* Secret location */}
        <p
          ref={subtitleRef}
          className="text-sm tracking-[0.45em] uppercase font-light"
          style={{ color: "#9B8EC4", opacity: 0 }}
        >
          Secret Location &nbsp;·&nbsp; Dubai
        </p>

        {/* Bottom dates */}
        <div className="mt-16 flex items-center gap-8">
          {["May 22", "May 23", "May 24"].map((date, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className="text-xs tracking-[0.4em] uppercase"
                style={{ color: "rgba(155,142,196,0.5)" }}
              >
                {date}
              </span>
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(155,142,196,0.4)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
