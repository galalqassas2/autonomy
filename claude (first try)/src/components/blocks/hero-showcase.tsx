"use client"

import * as React from "react"
import { XIcon } from "@phosphor-icons/react/dist/ssr"

import { DomeGallery, type DomeTile } from "@/components/fx/dome-gallery"
import { SHOWCASE } from "@/lib/showcase"

import { ToolMark } from "./capability-widgets/tool-mark"

/*
  The dome shows the reach, a tile opens what we actually do in that tool.

  The panel is a disclosure, not a dialog: it sits inside the dome's own box
  so the headline beside it stays readable, and it never traps focus.
*/

const TILES: DomeTile[] = SHOWCASE.map((tool) => ({
  id: tool.slug,
  label: tool.name,
  node: <ToolMark slug={tool.slug} className="size-full" />,
}))

export function HeroShowcase() {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const domeRef = React.useRef<HTMLDivElement>(null)

  const open = openId ? SHOWCASE.find((tool) => tool.slug === openId) : undefined

  React.useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  const close = () => {
    setOpenId(null)
    domeRef.current?.querySelector<HTMLElement>("[role=group]")?.focus()
  }

  return (
    <div ref={domeRef} className="hero-showcase">
      <DomeGallery tiles={TILES} openId={openId} onOpen={setOpenId} />

      {open ? (
        <div
          ref={panelRef}
          role="region"
          aria-label={open.name}
          tabIndex={-1}
          onKeyDown={(event) => event.key === "Escape" && close()}
          className="hero-showcase__panel"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white/[0.06]">
              <ToolMark slug={open.slug} className="size-5" />
            </span>
            <p className="text-sm font-medium text-ink">{open.name}</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="ml-auto grid size-8 shrink-0 place-items-center rounded-sm text-ink-mute transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <XIcon size={15} weight="bold" />
            </button>
          </div>

          <p className="t-heading-md mt-5 text-ink">{open.detail.headline}</p>

          <ul className="mt-4 flex flex-col gap-2.5">
            {open.detail.lines.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  style={{ boxShadow: "var(--glow-soft)" }}
                />
                <span className="t-body-md text-ink-mute">{line}</span>
              </li>
            ))}
          </ul>

        </div>
      ) : (
        <p className="t-caption hero-showcase__hint">Drag to turn. Click any tool.</p>
      )}
    </div>
  )
}
