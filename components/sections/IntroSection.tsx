"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function splitToChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="char" style={{ display: "inline-block" }}>
      {char === " " ? " " : char}
    </span>
  ));
}

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Logo fades in
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.4 }
      );

      // Title letters animate in
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 30, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.025,
            duration: 0.6,
          },
          "-=0.6"
        );
      }

      // Subtitle fades in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      );

      // Scroll indicator continuous pulse
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        opacity: 0.2,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });

      // Fade out on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          gsap.set(sectionRef.current, {
            opacity: 1 - self.progress * 0.8,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bg-space.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/70" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-8">
        {/* Logo */}
        <div ref={logoRef} className="mb-12" style={{ opacity: 0 }}>
          <Image
            src="/5pt-logo.png"
            alt="5PT"
            width={180}
            height={90}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-[0.18em] text-white leading-tight mb-8"
          style={{ perspective: "800px" }}
        >
          {splitToChars("FROM THE EARTH")}
          <br />
          {splitToChars("TO THE FUTURE.")}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg tracking-[0.35em] uppercase font-light"
          style={{ color: "#9B8EC4", opacity: 0 }}
        >
          May 22–24, 2026 &nbsp;·&nbsp; Dubai
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ opacity: 0.8 }}
      >
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "#9B8EC4" }}
        >
          Scroll
        </span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0V20M8 20L2 14M8 20L14 14"
            stroke="#9B8EC4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
