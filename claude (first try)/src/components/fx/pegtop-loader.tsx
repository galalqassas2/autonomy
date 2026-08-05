"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Three pegtops rising and falling in sequence. Used wherever the system is
  thinking: the AI node on the canvas, and the pause before a written reply.

  Ported off styled-components (a runtime dependency this project does not
  carry) onto plain CSS. The supplied markup repeated the same filter, mask
  and gradient ids in all three copies, which is invalid and made every copy
  reference the first one's defs, so the ids are namespaced per instance.
*/

const SHAPE =
  "M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"

function Pegtop({ uid, index }: { uid: string; index: number }) {
  const id = (name: string) => `${uid}-${name}-${index}`

  return (
    <svg
      className="pegtop"
      data-index={index}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={id("shine")}>
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <mask id={id("mask")}>
          <path d={SHAPE} fill="white" />
        </mask>
        <radialGradient
          id={id("shade")}
          cx={50}
          cy={66}
          r={30}
          gradientTransform="translate(0 35) scale(1 0.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#031a10" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#031a10" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id={id("lift")}
          cx={55}
          cy={20}
          r={30}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#a9f5cf" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a9f5cf" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id={id("rim")}
          cx={85}
          cy={50}
          r={30}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#5ee6a3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5ee6a3" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g>
        <path d={SHAPE} fill="var(--primary)" />
        <path d={SHAPE} fill={`url(#${id("shade")})`} />
        <path
          d={SHAPE}
          fill="none"
          stroke="#d8fbea"
          opacity="0.5"
          strokeWidth={3}
          filter={`url(#${id("shine")})`}
          mask={`url(#${id("mask")})`}
        />
        <path d={SHAPE} fill={`url(#${id("lift")})`} />
        <path d={SHAPE} fill={`url(#${id("rim")})`} />
      </g>
    </svg>
  )
}

export function PegtopLoader({
  size = 56,
  label = "Working",
  className,
}: {
  size?: number
  label?: string
  className?: string
}) {
  const uid = React.useId().replace(/:/g, "")

  return (
    <span
      role="status"
      aria-label={label}
      className={cn("pegtop-loader", className)}
      style={{ "--pegtop-size": `${size}px` } as React.CSSProperties}
    >
      <Pegtop uid={uid} index={0} />
      <Pegtop uid={uid} index={1} />
      <Pegtop uid={uid} index={2} />
    </span>
  )
}
