// The site's signature device: three concentric hairline arcs, quarter-open.
// variant="light" (default) is tuned for white backgrounds; variant="dark"
// is tuned for the dark auth-panel background.
export default function ArcMark({ size = 120, className = "", variant = "light" }) {
  const thirdColor = variant === "dark" ? "#F2EFE9" : "#17201D";
  const thirdOpacity = variant === "dark" ? "0.55" : "0.35";

  return (
    <svg
      className={`arc-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M60 6 A54 54 0 1 1 6 60" stroke="#C9A227" strokeWidth="1" strokeLinecap="round" />
      <path d="M60 26 A34 34 0 1 1 26 60" stroke="#7C9885" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M60 42 A18 18 0 1 1 42 60" stroke={thirdColor} strokeWidth="1" strokeLinecap="round" opacity={thirdOpacity} />
    </svg>
  );
}