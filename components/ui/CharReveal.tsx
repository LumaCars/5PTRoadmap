"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  onComplete?: () => void;
}

export function CharReveal({
  text,
  delay = 0,
  stagger = 0.035,
  className,
  onComplete,
}: Props) {
  const chars = text.split("");

  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block" }}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 0.45,
            delay: delay + i * stagger,
            ease: [0.23, 1, 0.32, 1],
          }}
          onAnimationComplete={
            i === chars.length - 1 ? onComplete : undefined
          }
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}
