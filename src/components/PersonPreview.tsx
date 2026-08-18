type Props = {
  /** true when the dominant trait shows */
  eyes: boolean;
  hair: boolean;
  freckles: boolean;
  tall: boolean;
  name: string;
};

/** Purely visual person drawn from the offspring's visible traits. */
export function PersonPreview({ eyes, hair, freckles, tall, name }: Props) {
  const eyeColor = eyes ? "var(--neon-amber)" : "var(--neon-cyan)";
  const scale = tall ? 1 : 0.78;
  const skin = "var(--card)";
  const outline = "var(--neon-lime)";

  return (
    <svg
      viewBox="0 0 220 200"
      role="img"
      aria-label={`Diagram of the person ${name || "unnamed"}`}
      className="mx-auto h-56 w-full max-w-[260px]"
    >
      <defs>
        <radialGradient id="personGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={eyeColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={eyeColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(110 176) scale(${scale}) translate(-110 -176)`}>
        {/* legs */}
        <g stroke={outline} strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M100 140 L94 176" />
          <path d="M120 140 L126 176" />
        </g>

        {/* torso */}
        <path
          d="M92 84 Q110 78 128 84 L132 142 Q110 148 88 142 Z"
          fill="var(--secondary)"
          stroke={outline}
          strokeWidth="3"
        />

        {/* arms */}
        <g stroke={outline} strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M92 90 L74 128" />
          <path d="M128 90 L146 128" />
        </g>

        {/* neck */}
        <path d="M105 72 L105 84 M115 72 L115 84" stroke={outline} strokeWidth="4" />

        {/* head */}
        <circle cx="110" cy="56" r="26" fill={skin} stroke={outline} strokeWidth="3" />
        <circle cx="110" cy="56" r="30" fill="url(#personGlow)" />

        {/* hair */}
        {hair ? (
          <g fill="var(--neon-magenta)" fillOpacity="0.55" stroke="var(--neon-magenta)" strokeWidth="2">
            <circle cx="94" cy="38" r="9" />
            <circle cx="110" cy="32" r="10" />
            <circle cx="126" cy="38" r="9" />
            <circle cx="86" cy="50" r="7" />
            <circle cx="134" cy="50" r="7" />
          </g>
        ) : (
          <path
            d="M84 50 Q86 28 110 28 Q134 28 136 50 Q126 40 110 40 Q94 40 84 50 Z"
            fill="var(--neon-magenta)"
            fillOpacity="0.45"
            stroke="var(--neon-magenta)"
            strokeWidth="2"
          />
        )}

        {/* eyes */}
        <circle cx="101" cy="55" r="4" fill={eyeColor} />
        <circle cx="119" cy="55" r="4" fill={eyeColor} />

        {/* smile */}
        <path
          d="M102 68 Q110 74 118 68"
          fill="none"
          stroke={outline}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* freckles */}
        {freckles && (
          <g fill="var(--neon-amber)" opacity="0.85">
            {[
              [96, 62],
              [92, 58],
              [100, 65],
              [124, 62],
              [128, 58],
              [120, 65],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
            ))}
          </g>
        )}
      </g>

      <text
        x="110"
        y="194"
        textAnchor="middle"
        fill="var(--muted-foreground)"
        style={{ font: "600 11px var(--font-display)", letterSpacing: "0.18em" }}
      >
        {(name || "UNNAMED").toUpperCase().slice(0, 18)}
      </text>
    </svg>
  );
}
