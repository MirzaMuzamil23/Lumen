"use client";

import { useState } from "react";

// Lightweight SVG donut chart. data: [{ label, value, color }]
export default function DonutChart({ data, size = 160, thickness = 22 }) {
  const [hover, setHover] = useState(null);
  const total = Math.max(1, data.reduce((sum, d) => sum + d.value, 0));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = data.map((d) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const offset = cumulative * circumference;
    cumulative += fraction;
    return { ...d, dash, offset, fraction };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--ink-surface-2)"
            strokeWidth={thickness}
          />
          {segments.map((s, i) => (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === i ? thickness + 4 : thickness}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
              style={{ transition: "stroke-width 0.15s ease, opacity 0.15s ease" }}
              opacity={hover === null || hover === i ? 1 : 0.45}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--porcelain)" }}>
            {hover !== null ? data[hover].value : total}
          </div>
          <div className="text-mono text-muted" style={{ fontSize: 10.5 }}>
            {hover !== null ? data[hover].label : "Total"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => (
          <div
            key={d.label}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "default", opacity: hover === null || hover === i ? 1 : 0.5 }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5 }}>{d.label}</span>
            <span className="text-mono text-muted" style={{ fontSize: 12 }}>
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}