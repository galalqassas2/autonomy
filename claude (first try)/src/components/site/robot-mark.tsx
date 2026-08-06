import { cn } from "@/lib/utils"

/*
  The logo mark: the same humanoid silhouette as the robot elsewhere on the
  page (see ui/splite.tsx, ui/robot-placeholder.tsx) — head, visor, torso,
  arms, legs — flattened to solid rounded rects instead of a 3D render, so
  it stays legible at header/footer/favicon sizes and never depends on a
  third-party scene loading. Emerald body with a near-black visor reads the
  same way the primary button does: "lit" emerald with dark contrast, not a
  colour choice made twice in the same brand.

  Kept in sync by hand with app/icon.svg, which draws the identical shapes
  in hard-coded hex for the static favicon — that file cannot read CSS
  custom properties, so the two are not allowed to share this component.
*/
export function RobotMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 36) / 32}
      viewBox="0 0 32 36"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* head + visor */}
      <rect x={11} y={3} width={10} height={9} rx={4.5} fill="var(--primary)" />
      <rect x={12.5} y={6.2} width={7} height={2.6} rx={1.3} fill="var(--on-primary)" />
      {/* torso */}
      <rect x={8} y={13} width={16} height={13} rx={6} fill="var(--primary)" />
      {/* arms */}
      <rect x={2} y={14} width={5} height={10} rx={2.5} fill="var(--primary)" />
      <rect x={25} y={14} width={5} height={10} rx={2.5} fill="var(--primary)" />
      {/* legs */}
      <rect x={10} y={25} width={5} height={9} rx={2.5} fill="var(--primary)" />
      <rect x={17} y={25} width={5} height={9} rx={2.5} fill="var(--primary)" />
    </svg>
  )
}
