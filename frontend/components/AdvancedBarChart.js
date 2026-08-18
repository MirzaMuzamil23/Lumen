"use client";

import { useEffect, useRef, useState } from "react";

// Advanced SVG bar+line combo chart:
// - Bars animate in (scaleY) when scrolled into view
// - A smooth trend line traces across bar tops, drawn in with a stroke animation
// - Value labels sit above each bar
// - Tooltip works on both hover (desktop) AND tap (mobile/touch)
export default function AdvancedBarChart({ data, height = 180, color = "#c9932a" }) {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const barWidth = 100 / n;
  const padTop = 22;
  const padBottom = 20;
  const usableHeight = height - padTop - padBottom;

  const points = data.map((d, i) => ({
    x: i * barWidth + barWidth / 2,
    y: padTop + (usableHeight - (d.value / max) * usableHeight),
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .abc-bar { transform-origin: bottom; transform: scaleY(0); transition: transform 0.7s cubic-bezier(.22,1,.36,1); }
        .abc-bar.abc-visible { transform: scaleY(1); }
        .abc-line { stroke-dasharray: 300; stroke-dashoffset: 300; transition: stroke-dashoffset 1.1s ease 0.3s; }
        .abc-line.abc-visible { stroke-dashoffset: 0; }
        .abc-dot { opacity: 0; transition: opacity 0.4s ease 0.9s; }
        .abc-dot.abc-visible { opacity: 1; }
      `}} />

      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, overflow: "visible" }}>
        <defs>
          <linearGradient id="abcGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {Array.from({ length: 4 }).map((_, i) => {
          const y = padTop + (usableHeight / 3) * i;
          return (
            <line key={i} x1="0" y1={y} x2="100" y2={y} stroke="rgba(23,32,29,0.07)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          );
        })}

        {data.map((d, i) => {
          const barHeight = (d.value / max) * usableHeight;
          const x = i * barWidth + barWidth * 0.24;
          const w = barWidth * 0.52;
          const y = height - padBottom - barHeight;
          const isActive = active === i;
          return (
            <g key={i}>
              <rect
                className={`abc-bar ${visible ? "abc-visible" : ""}`}
                x={x}
                y={y}
                width={w}
                height={barHeight}
                rx="1.4"
                fill={isActive ? color : "url(#abcGradient)"}
                style={{ transitionDelay: `${i * 60}ms`, cursor: "pointer" }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onTouchStart={() => setActive(active === i ? null : i)}
              />
              <text
                x={i * barWidth + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="4"
                fill={isActive ? color : "var(--porcelain-muted)"}
                fontFamily="var(--font-mono)"
                style={{ transition: "fill 0.15s ease" }}
              >
                {d.value}
              </text>
              <text
                x={i * barWidth + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize="4.2"
                fill="var(--porcelain-muted)"
                fontFamily="var(--font-mono)"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        <path
          className={`abc-line ${visible ? "abc-visible" : ""}`}
          d={linePath}
          fill="none"
          stroke="var(--porcelain)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            className={`abc-dot ${visible ? "abc-visible" : ""}`}
            cx={p.x}
            cy={p.y}
            r="1"
            fill="var(--porcelain)"
            opacity="0.4"
          />
        ))}
      </svg>
    </div>
  );
}