import Image from "next/image"

import { cn } from "@/lib/utils"

/*
  The logo: a cropped, transparent-background capture of the actual Spline
  robot (public/robot-logo.png) — not a drawn icon. Captured with the arms
  down rather than the scene's wide T-pose keyframe, since the wide pose
  reads as a short, compressed silhouette; arms-down is the standing, tall
  read this is meant to have. Its own render is almost entirely near-black,
  which read as invisible directly on the site's dark chrome, so it sits on
  a small white backing plate for contrast rather than floating free.
*/
export function RobotMark({ className, size = 36 }: { className?: string; size?: number }) {
  const imgSize = size - 8
  const imgWidth = Math.round(imgSize * (299 / 359))
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image src="/robot-logo.png" alt="" width={imgWidth} height={imgSize} className="object-contain" priority />
    </span>
  )
}
