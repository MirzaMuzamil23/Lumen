"use client";

import { useState } from "react";

// Lightweight SVG bar chart — gridlines, gradient bars, hover tooltip.
// data: [{ label: string, value: number }]
export default function BarChart({ data, height = 160, color = "#c9932a" }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;
  const gridLines = 4;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, overflow: "visible" }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = (height / gridLines) * i;
          return (
            <line
              key={i}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(23,32,29,0.08)"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 18);
          const x = i * barWidth + barWidth * 0.22;
          const w = barWidth * 0.56;
          const y = height - barHeight - 18;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={barHeight}
              rx="1.2"
              fill={hover === i ? color : "url(#barGradient)"}
              style={{ transition: "fill 0.15s ease, opacity 0.2s ease" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={i * barWidth + barWidth / 2}
            y={height - 4}
            textAnchor="middle"
            fontSize="4.2"
            fill="var(--porcelain-muted)"
            fontFamily="var(--font-mono)"
          >
            {d.label}
          </text>
        ))}
      </svg>

      {hover !== null && (
        <div
          style={{
            position: "absolute",
            left: `${hover * barWidth + barWidth / 2}%`,
            top: 0,
            transform: "translate(-50%, -100%)",
            background: "var(--porcelain)",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            padding: "4px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {data[hover].label}: {data[hover].value}
        </div>
      )}
    </div>
  );
}