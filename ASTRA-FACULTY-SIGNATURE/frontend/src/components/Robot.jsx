import "./Robot.css";

/**
 * Robot
 * -----
 * The small white/orange futuristic mascot. Rendered as inline SVG so it
 * matches the site's line-and-accent visual language exactly, with a slow
 * ease-in-out vertical float — never a bounce.
 *
 * size: "md" (default, signature screen) | "lg" (success screen)
 */
export default function Robot({ size = "md", className = "" }) {
  return (
    <div className={`robot robot--${size} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 160 180" className="robot__svg" xmlns="http://www.w3.org/2000/svg">
        {/* antenna */}
        <line x1="80" y1="10" x2="80" y2="28" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="80" cy="8" r="5" fill="var(--color-accent)" />

        {/* head */}
        <rect x="34" y="28" width="92" height="66" rx="20" fill="#FFFFFF" stroke="var(--color-line-strong)" strokeWidth="2.5" />
        {/* face screen */}
        <rect x="50" y="44" width="60" height="34" rx="10" fill="var(--color-navy)" />
        <circle className="robot__eye" cx="68" cy="61" r="5.5" fill="#FFFFFF" />
        <circle className="robot__eye" cx="92" cy="61" r="5.5" fill="#FFFFFF" />
        {/* ear accents */}
        <rect x="24" y="48" width="10" height="20" rx="5" fill="var(--color-accent)" />
        <rect x="126" y="48" width="10" height="20" rx="5" fill="var(--color-accent)" />

        {/* body */}
        <rect x="44" y="98" width="72" height="54" rx="18" fill="#FFFFFF" stroke="var(--color-line-strong)" strokeWidth="2.5" />
        <circle cx="80" cy="125" r="12" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <circle cx="80" cy="125" r="4" fill="var(--color-accent)" />

        {/* arms */}
        <rect x="20" y="104" width="20" height="12" rx="6" fill="#FFFFFF" stroke="var(--color-line-strong)" strokeWidth="2" />
        <rect x="120" y="104" width="20" height="12" rx="6" fill="#FFFFFF" stroke="var(--color-line-strong)" strokeWidth="2" />

        {/* legs */}
        <rect x="56" y="152" width="14" height="18" rx="6" fill="#FFFFFF" stroke="var(--color-line-strong)" strokeWidth="2" />
        <rect x="90" y="152" width="14" height="18" rx="6" fill="#FFFFFF" stroke="var(--color-line-strong)" strokeWidth="2" />

        {/* ground glow ellipse */}
        <ellipse cx="80" cy="174" rx="34" ry="4" fill="var(--color-accent)" opacity="0.18" />
      </svg>
    </div>
  );
}
