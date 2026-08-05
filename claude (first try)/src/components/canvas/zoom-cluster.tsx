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
  const shell = (
    <div className="flex items-center gap-0.5 rounded-full border border-white/[0.10] bg-[color-mix(in_srgb,var(--canvas-night)_86%,transparent)] p-1 backdrop-blur-sm">
      {interactive ? (
        <>
          <button
            type="button"
            className={button}
            onClick={onZoomOut}
            disabled={!canZoomOut}
            aria-label="Zoom out"
          >
            <MinusIcon size={14} weight="bold" />
          </button>
          <span
            className="t-micro tabular w-11 text-center text-ink-mute-2"
            aria-live="polite"
          >
            {percent}%
          </span>
          <button
            type="button"
            className={button}
            onClick={onZoomIn}
            disabled={!canZoomIn}
            aria-label="Zoom in"
          >
            <PlusIcon size={14} weight="bold" />
          </button>
          <button
            type="button"
            className={button}
            onClick={onFit}
            aria-label="Fit to view at 100 percent"
          >
            <CornersOutIcon size={14} weight="bold" />
          </button>
        </>
      ) : (
        <>
          <span className={cn(button, "pointer-events-none")}>
            <MinusIcon size={14} weight="bold" />
          </span>
          <span className="t-micro tabular w-11 text-center text-ink-mute-2">
            {percent}%
          </span>
          <span className={cn(button, "pointer-events-none")}>
            <PlusIcon size={14} weight="bold" />
          </span>
          <span className={cn(button, "pointer-events-none")}>
            <CornersOutIcon size={14} weight="bold" />
          </span>
        </>
      )}
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
