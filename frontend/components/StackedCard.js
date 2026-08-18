"use client";

export default function StackedCard({ children }) {
  return (
    <div className="stacked-card-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .stacked-card-wrap { position: relative; height: 100%; padding: 10px; }
        .stacked-card-wrap .sc-layer {
          position: absolute;
          top: 10px; left: 10px; right: 10px; bottom: 10px;
          border-radius: var(--radius);
          transition: transform 0.45s cubic-bezier(.22,1,.36,1), opacity 0.45s ease;
        }
        .stacked-card-wrap .sc-layer-1 {
          background: linear-gradient(135deg, var(--gold-soft), var(--gold-deep));
          transform: rotate(-7deg) translate(-8px, 8px);
          opacity: 0.5;
        }
        .stacked-card-wrap .sc-layer-2 {
          background: linear-gradient(135deg, var(--sage), #34473b);
          transform: rotate(6deg) translate(9px, 10px);
          opacity: 0.35;
        }
        .stacked-card-wrap .sc-front {
          position: relative;
          height: 100%;
          transition: transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.45s ease;
        }
        .stacked-card-wrap:hover .sc-layer-1 { transform: rotate(-12deg) translate(-18px, 12px); opacity: 0.75; }
        .stacked-card-wrap:hover .sc-layer-2 { transform: rotate(10deg) translate(18px, 14px); opacity: 0.55; }
        .stacked-card-wrap:hover .sc-front { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(23,32,29,0.14); }
      `}} />
      <div className="sc-layer sc-layer-2" />
      <div className="sc-layer sc-layer-1" />
      <div className="sc-front">{children}</div>
    </div>
  );
}