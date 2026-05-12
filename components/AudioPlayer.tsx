"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { markInteracted } from "@/lib/audioInteraction";

const AUDIO_URL =
  "https://d6gmlk5qn4ikdodg.public.blob.vercel-storage.com/Track.mp3";
const TARGET_VOL = 0.3;
const FADE_MS = 2000;

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [muted, setMuted] = useState(false);

  const start = useCallback(() => {
    if (startedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    startedRef.current = true;
    markInteracted();
    audio.volume = 0;

    audio.play().catch(() => {
      // Browser still blocked — reset so next interaction retries
      startedRef.current = false;
    });

    // Fade in volume 0 → TARGET_VOL over FADE_MS
    const steps = 60;
    const interval = FADE_MS / steps;
    const step = TARGET_VOL / steps;
    let tick = 0;
    fadeRef.current = setInterval(() => {
      tick++;
      if (!audioRef.current) return;
      audioRef.current.volume = Math.min(step * tick, TARGET_VOL);
      if (tick >= steps) clearInterval(fadeRef.current!);
    }, interval);
  }, []);

  useEffect(() => {
    // Fire on first scroll, click, or touch — whichever comes first
    const once = { once: true, passive: true } as const;
    window.addEventListener("scroll", start, once);
    window.addEventListener("click", start, { once: true });
    window.addEventListener("touchstart", start, once);

    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("click", start);
      window.removeEventListener("touchstart", start);
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [start]);

  const toggle = () => {
    if (!startedRef.current) {
      start();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_URL} loop preload="none" />

      <button
        onClick={toggle}
        aria-label={muted ? "Unmute music" : "Mute music"}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 100,
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "50%",
          border: "1px solid rgba(155,142,196,0.25)",
          background: "rgba(5,5,5,0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          color: "#9B8EC4",
          flexShrink: 0,
        }}
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </>
  );
}

function SoundIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
