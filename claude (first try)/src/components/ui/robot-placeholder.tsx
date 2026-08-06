/*
  What shows immediately, before the actual Spline scene has downloaded.
  A multi-megabyte 3D asset from a third-party CDN cannot arrive instantly
  on every connection, no amount of code changes that. What code controls
  is never showing a blank panel while it is in transit: this is visible
  from the first paint, breathes gently so it reads as alive rather than
  stuck, and the real scene crossfades in over it once SplineScene's onLoad
  actually fires.
*/
export function RobotPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`robot-placeholder flex h-full w-full items-center justify-center ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg width={104} height={104} viewBox="0 0 104 104" fill="none">
        <rect
          x={30}
          y={38}
          width={44}
          height={38}
          rx={14}
          stroke="var(--ink-mute)"
          strokeWidth={2.5}
        />
        <circle cx={44} cy={57} r={4} fill="var(--primary)" />
        <circle cx={60} cy={57} r={4} fill="var(--primary)" />
        <path
          d="M52 38 V26"
          stroke="var(--ink-mute)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={52} cy={21} r={5} fill="var(--primary)" />
        <path
          d="M18 84 Q52 68 86 84"
          stroke="var(--ink-mute)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
