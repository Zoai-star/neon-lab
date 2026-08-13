type Props = {
  head: number;
  chassis: number;
  limbs: number;
  core: number;
  name: string;
};

/** Purely visual robot built from the selected module indexes. */
export function RobotPreview({ head, chassis, limbs, core, name }: Props) {
  const coreColor = ["var(--neon-lime)", "var(--neon-amber)", "var(--neon-magenta)"][core]!;

  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label={`Diagram of the robot ${name || "unnamed"}`}
      className="mx-auto h-64 w-full max-w-[240px]"
    >
      <defs>
        <radialGradient id="glowCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={coreColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* antenna / head extras */}
      {head === 2 && (
        <g stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round">
          <line x1="100" y1="34" x2="100" y2="12" />
          <line x1="100" y1="12" x2="88" y2="4" />
          <line x1="100" y1="12" x2="112" y2="4" />
        </g>
      )}
      {head === 1 && (
        <path
          d="M74 40 Q100 14 126 40"
          fill="none"
          stroke="var(--neon-amber)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}

      {/* head */}
      <rect
        x="70"
        y="36"
        width="60"
        height="46"
        rx={head === 1 ? 22 : 10}
        fill="var(--card)"
        stroke="var(--neon-cyan)"
        strokeWidth="2.5"
      />
      {head === 0 ? (
        <>
          <circle cx="88" cy="58" r="7" fill="var(--neon-cyan)" />
          <circle cx="112" cy="58" r="7" fill="var(--neon-cyan)" />
        </>
      ) : (
        <rect x="82" y="53" width="36" height="10" rx="5" fill="var(--neon-cyan)" />
      )}

      {/* neck */}
      <rect x="94" y="82" width="12" height="10" fill="var(--secondary)" />

      {/* chassis */}
      {chassis === 0 ? (
        <rect x="58" y="92" width="84" height="76" rx="8" fill="var(--card)" stroke="var(--neon-cyan)" strokeWidth="3" />
      ) : chassis === 1 ? (
        <path
          d="M64 92 H136 L146 168 H54 Z"
          fill="var(--card)"
          stroke="var(--neon-cyan)"
          strokeWidth="2.5"
        />
      ) : (
        <>
          <rect x="66" y="92" width="68" height="66" rx="30" fill="var(--card)" stroke="var(--neon-cyan)" strokeWidth="2.5" />
          <ellipse cx="100" cy="176" rx="52" ry="10" fill="none" stroke="var(--neon-magenta)" strokeWidth="3" />
        </>
      )}

      {/* power core glow */}
      <circle cx="100" cy="126" r="26" fill="url(#glowCore)" />
      <circle cx="100" cy="126" r="11" fill={coreColor} />

      {/* arms */}
      <rect x="38" y="100" width="16" height="52" rx="8" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
      <rect x="146" y="100" width="16" height="52" rx="8" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
      {limbs === 0 && (
        <g stroke="var(--neon-lime)" strokeWidth="3" strokeLinecap="round">
          <path d="M40 154 l-8 12 M52 154 l8 12 M148 154 l-8 12 M160 154 l8 12" />
        </g>
      )}

      {/* locomotion */}
      {limbs === 1 ? (
        <>
          <rect x="56" y="182" width="88" height="26" rx="13" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2.5" />
          <circle cx="74" cy="195" r="7" fill="var(--neon-cyan)" />
          <circle cx="100" cy="195" r="7" fill="var(--neon-cyan)" />
          <circle cx="126" cy="195" r="7" fill="var(--neon-cyan)" />
        </>
      ) : limbs === 2 ? (
        <>
          <rect x="76" y="170" width="14" height="46" rx="7" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
          <rect x="110" y="170" width="14" height="46" rx="7" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
          <rect x="68" y="214" width="30" height="9" rx="4" fill="var(--neon-cyan)" />
          <rect x="102" y="214" width="30" height="9" rx="4" fill="var(--neon-cyan)" />
        </>
      ) : (
        <>
          <rect x="72" y="170" width="16" height="40" rx="8" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
          <rect x="112" y="170" width="16" height="40" rx="8" fill="var(--secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
          <circle cx="80" cy="216" r="9" fill="var(--neon-cyan)" />
          <circle cx="120" cy="216" r="9" fill="var(--neon-cyan)" />
        </>
      )}

      <text
        x="100"
        y="236"
        textAnchor="middle"
        fill="var(--muted-foreground)"
        style={{ font: "600 11px var(--font-display)", letterSpacing: "0.18em" }}
      >
        {(name || "UNNAMED").toUpperCase().slice(0, 16)}
      </text>
    </svg>
  );
}
