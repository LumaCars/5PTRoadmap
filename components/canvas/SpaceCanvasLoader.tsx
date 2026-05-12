"use client";

import dynamic from "next/dynamic";

const SpaceCanvas = dynamic(
  () => import("./SpaceCanvas").then((m) => m.SpaceCanvas),
  { ssr: false }
);

export function SpaceCanvasLoader() {
  return <SpaceCanvas />;
}
