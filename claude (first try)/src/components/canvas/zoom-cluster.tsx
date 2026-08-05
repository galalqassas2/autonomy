"use client"

import {
  CornersOutIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

type Props = {
  percent: number
  /* Decorative on the hero canvas, real controls in the automation stage. */
  interactive: boolean
  canZoomIn?: boolean
  canZoomOut?: boolean
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFit?: () => void
}

const button =
  "grid size-7 place-items-center rounded-sm text-white/55 transition-colors duration-150 hover:bg-white/[0.08] hover:text-on-dark disabled:pointer-events-none disabled:opacity-35"

export function ZoomCluster({
  percent,
  interactive,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onFit,
}: Props) {
  const Tag = interactive ? "button" : "span"

  const shell = (
    <div className="flex items-center gap-0.5 rounded-full border border-white/[0.10] bg-[color-mix(in_srgb,var(--canvas-night)_86%,transparent)] p-1 backdrop-blur-sm">
      <Tag
        {...(interactive ? { type: "button" as const, onClick: onZoomOut, disabled: !canZoomOut, "aria-label": "Zoom out" } : {})}
        className={cn(button, !interactive && "pointer-events-none")}
      >
        <MinusIcon size={14} weight="bold" />
      </Tag>
      <span
        className="t-micro tabular w-11 text-center text-ink-mute-2"
        {...(interactive ? { "aria-live": "polite" as const } : {})}
      >
        {percent}%
      </span>
      <Tag
        {...(interactive ? { type: "button" as const, onClick: onZoomIn, disabled: !canZoomIn, "aria-label": "Zoom in" } : {})}
        className={cn(button, !interactive && "pointer-events-none")}
      >
        <PlusIcon size={14} weight="bold" />
      </Tag>
      <Tag
        {...(interactive ? { type: "button" as const, onClick: onFit, "aria-label": "Fit to view at 100 percent" } : {})}
        className={cn(button, !interactive && "pointer-events-none")}
      >
        <CornersOutIcon size={14} weight="bold" />
      </Tag>
    </div>
  )

  return (
    <div
      data-canvas-control=""
      className="absolute right-4 bottom-4 z-20"
      aria-hidden={!interactive}
    >
      {shell}
    </div>
  )
}
