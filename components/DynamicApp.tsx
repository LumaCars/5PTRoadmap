"use client";

import dynamic from "next/dynamic";

// Single ssr:false boundary. Nothing inside App.tsx — or any of its transitive
// imports (three, @react-three/fiber, gsap, lenis, framer-motion) — will ever
// be evaluated during the server-side render pass.
const App = dynamic(() => import("./App"), {
  ssr: false,
  loading: () => (
    <div style={{ background: "#050505", minHeight: "100vh" }} />
  ),
});

export function DynamicApp() {
  return <App />;
}
