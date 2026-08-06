import Image from "next/image"

import { cn } from "@/lib/utils"

/*
  The logo: the client's exact reference capture (public/robot-logo.png),
  used as supplied rather than re-cropped or re-composed — a close head-
  and-shoulders framing with its own dark vignette background. That
  background is why this no longer sits on the white backing plate earlier
  versions used: the image already carries its own contrast and setting
  a plate behind it would fight the photo instead of framing it.
*/
export function RobotMark({ className, size = 36 }: { className?: string; size?: number }) {
  const width = Math.round(size * (595 / 378))
  return (
    <Image
      src="/robot-logo.png"
      alt=""
      width={width}
      height={size}
      className={cn("shrink-0 rounded-md object-cover", className)}
      style={{ height: size, width }}
      priority
    />
  )
}
