"use client";

import { useRef } from "react";

// Wraps any card and gives it a real-time 3D tilt that follows the cursor,
// plus a soft light "glare" that moves with the mouse. Uses direct DOM
// mutation (not React state) on mousemove so it stays smooth at 60fps
// without triggering re-renders.
export default function TiltCard({ children, maxTilt = 9, liftScale = 1.025 }) {
  const wrapRef = useRef(null);
  const glareRef = useRef(null);

  const onMouseMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 2 * maxTilt;
    const rotateX = (0.5 - py) * 2 * maxTilt;

    el.style.transition = "transform 0.1s ease-out";
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${liftScale}, ${liftScale}, ${liftScale})`;

    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.55), transparent 55%)`;
    }
  };

  const onMouseLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(.22,1,.36,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative",
        height: "100%",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      <div
        ref={glareRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--radius)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}