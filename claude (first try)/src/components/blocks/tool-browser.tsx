"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr"

import { DomeGallery } from "@/components/fx/dome-gallery"
import type { Tool } from "@/lib/tools"

import { ToolMark } from "./capability-widgets/tool-mark"

const MAX_RESULTS = 24

/* ── Pipeline step data (static, no reason to allocate per render) ── */
const PIPELINE_STEPS = [
  { label: "1. Trigger", desc: (name: string) => `Event received in ${name}` },
  { label: "2. AI Engine", desc: () => "Data parsing, validation and enrichment" },
  { label: "3. Action", desc: () => "Instant sync across target business apps" },
] as const

/* ── Tool Detail Modal ─────────────────────────────────── */

function ToolModal({
  tool,
  onClose,
}: {
  tool: Tool
  onClose: () => void
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
        className="relative z-10 w-full max-w-lg rounded-md border border-white/10 bg-canvas-night p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-sm text-ink-mute-2 transition-colors hover:bg-white/5 hover:text-on-dark"
        >
          <XIcon size={18} weight="bold" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-sm border border-white/10 bg-canvas-night-2">
            <ToolMark slug={tool.slug} className="size-8 text-primary" />
          </div>
          <div>
            <span className="t-micro inline-flex items-center gap-1 font-mono uppercase tracking-wider text-primary">
              <CheckCircleIcon size={12} weight="fill" /> Pre-built connector
            </span>
            <h3 id="tool-modal-title" className="t-heading-lg text-on-dark">
              {tool.name}
            </h3>
          </div>
        </div>

        <p className="t-body-md mt-4 text-ink-mute-2">
          We build custom automations that connect {tool.name} with your
          existing tools.
        </p>

        {/* Pipeline example */}
        <div className="mt-6 rounded-sm border border-white/10 bg-canvas-night-2 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-on-dark">
            <LightningIcon size={14} className="text-primary" weight="fill" />
            Example automation pipeline
          </div>

          <div className="mt-3 grid gap-2.5 text-sm">
            {PIPELINE_STEPS.map((step) => (
              <div
                key={step.label}
                className="flex items-center gap-3 rounded-xs border border-white/5 bg-canvas/60 p-2.5"
              >
                <span className="t-micro rounded-xs bg-primary/10 px-2 py-0.5 font-mono text-primary">
                  {step.label}
                </span>
                <span className="text-ink-mute">{step.desc(tool.name)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <a
            href="#start"
            onClick={onClose}
            className="t-button inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-5 font-medium text-on-primary transition-opacity hover:opacity-90"
          >
            Request automation
            <ArrowRightIcon size={14} weight="bold" />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Tool Browser ──────────────────────────────────────── */

export function ToolBrowser({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = React.useState("")
  const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null)

  const term = query.trim()

  const matches = React.useMemo(() => {
    if (!term) return []
    const needle = term.toLowerCase()
    return tools.filter((t) => t.name.toLowerCase().includes(needle))
  }, [tools, term])

  const closeModal = React.useCallback(() => setSelectedTool(null), [])

  return (
    <div className="mt-10">
      {/* Search bar */}
      <div className="mx-auto flex max-w-[420px] items-center gap-2 rounded-sm border border-white/[0.10] bg-canvas-night-2 px-3 focus-within:outline focus-within:outline-2 focus-within:outline-primary">
        <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute-2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search connected tools"
          aria-label="Search connected tools"
          className="h-11 w-full bg-transparent text-sm text-on-dark placeholder:text-ink-mute-2 focus-visible:outline-none"
        />
        {term ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="grid size-6 shrink-0 place-items-center rounded-xs text-ink-mute-2 transition-colors hover:text-on-dark"
          >
            <XIcon size={14} weight="bold" />
          </button>
        ) : null}
      </div>

      {/* Content: search results or dome gallery */}
      {term ? (
        <div className="mt-8 min-h-[380px]">
          <p className="t-caption mb-6 text-center text-ink-mute-2" aria-live="polite">
            {matches.length} {matches.length === 1 ? "tool matches" : "tools match"}{" "}
            <span className="text-on-dark">&ldquo;{term}&rdquo;</span>
          </p>
          <ul className="flex flex-wrap justify-center gap-4">
            {matches.slice(0, MAX_RESULTS).map((tool) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  onClick={() => setSelectedTool(tool)}
                  className="flex w-[96px] flex-col items-center gap-2 rounded-sm p-2 transition-all hover:bg-canvas-lift/60 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className="tool-tile">
                    <ToolMark slug={tool.slug} className="size-7" />
                  </span>
                  <span className="t-micro max-w-full truncate text-center font-medium text-ink-mute-2">
                    {tool.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 h-[400px] sm:h-[460px] lg:h-[540px]">
          <DomeGallery
            tools={tools}
            onSelectTool={setSelectedTool}
            fit={0.48}
            dampening={5}
            maxPitch={20}
          />
        </div>
      )}

      {/* Modal */}
      {selectedTool ? (
        <ToolModal tool={selectedTool} onClose={closeModal} />
      ) : null}

      <p className="sr-only">
        Connected tools include {tools.map((t) => t.name).join(", ")}.
      </p>
    </div>
  )
}
