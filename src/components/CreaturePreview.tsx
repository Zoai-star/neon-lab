type Props = {
  /** true when the dominant trait shows */
  eyes: boolean;
  scales: boolean;
  wings: boolean;
  size: boolean;
  name: string;
};

/** Purely visual creature drawn from the offspring's visible traits. */
export function CreaturePreview({ eyes, scales, wings, size, name }: Props) {
  const eyeColor = eyes ? "var(--neon-cyan)" : "var(--neon-amber)";
  const scale = size ? 1 : 0.72;

  return (
    <svg
      viewBox="0 0 220 200"
      role="img"
      aria-label={`Diagram of the creature ${name || "unnamed"}`}
      className="mx-auto h-56 w-full max-w-[260px]"
    >
      <defs>
        <radialGradient id="creatureGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={eyeColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={eyeColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(110 110) scale(${scale}) translate(-110 -110)`}>
        {wings && (
          <g fill="var(--neon-magenta)" fillOpacity="0.35" stroke="var(--neon-magenta)" strokeWidth="2">
            <path d="M96 80 Q40 20 26 74 Q52 90 96 96 Z" />
            <path d="M124 80 Q180 20 194 74 Q168 90 124 96 Z" />
          </g>
        )}

        {/* tail */}
        <path
          d="M62 116 Q26 122 22 150"
          fill="none"
          stroke="var(--neon-lime)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* body */}
        <ellipse
          cx="110"
          cy="116"
          rx="52"
          ry="34"
          fill="var(--card)"
          stroke="var(--neon-lime)"
          strokeWidth="3"
        />
        {scales &&
          [0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={80 + col * 20}
                cy={102 + row * 14}
                r="5"
                fill="none"
                stroke="var(--neon-lime)"
                strokeWidth="1.5"
                opacity="0.8"
              />
            )),
          )}

        {/* legs */}
        <g stroke="var(--neon-lime)" strokeWidth="5" strokeLinecap="round">
          <path d="M84 146 l-8 22 M104 148 l-2 22 M124 148 l4 22 M144 144 l10 20" />
        </g>

        {/* head */}
        <circle cx="166" cy="98" r="26" fill="var(--card)" stroke="var(--neon-lime)" strokeWidth="3" />
        <circle cx="170" cy="94" r="18" fill="url(#creatureGlow)" />
        <circle cx="164" cy="92" r="6" fill={eyeColor} />
        <circle cx="180" cy="96" r="5" fill={eyeColor} />
        {/* antennae */}
        <g stroke={eyeColor} strokeWidth="2" strokeLinecap="round">
          <path d="M158 76 l-6 -14 M176 76 l6 -14" />
        </g>
      </g>

      <text
        x="110"
        y="192"
        textAnchor="middle"
        fill="var(--muted-foreground)"
        style={{ font: "600 11px var(--font-display)", letterSpacing: "0.18em" }}
      >
        {(name || "UNNAMED").toUpperCase().slice(0, 18)}
      </text>
    </svg>
  );
}
