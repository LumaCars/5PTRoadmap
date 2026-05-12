"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[SpaceCanvas] WebGL error, falling back to static background:", error.message);
  }

  render() {
    if (this.state.failed) {
      // Silent fallback — page still works, just no 3D canvas
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: "#050505",
            pointerEvents: "none",
          }}
        />
      );
    }
    return this.props.children;
  }
}
