"use client"

import * as React from "react"
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr"

type Tool = { name: string; slug: string }

const ROW_DURATIONS = ["60s", "75s", "90s"]
const ROW_DIRECTIONS = ["left", "right", "left"] as const
const MAX_RESULTS = 24

function Tile({ tool, hidden }: { tool: Tool; hidden?: boolean }) {
  return (
    <li className="px-2" aria-hidden={hidden || undefined}>
      <span className="tool-tile" tabIndex={hidden ? -1 : 0}>
        <svg
          className="size-6 md:size-7 lg:size-8"
          aria-hidden="true"
          focusable="false"
        >
          <use href={`#tool-${tool.slug}`} />
        </svg>
        <span className="tool-tip">{tool.name}</span>
        <span className="sr-only">{tool.name}</span>
      </span>
    </li>
  )
}

export function MarqueeRows({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = React.useState("")
  const trimmed = query.trim()

  const rows = React.useMemo(() => {
    const size = Math.ceil(tools.length / 3)
    return [
      tools.slice(0, size),
      tools.slice(size, size * 2),
      tools.slice(size * 2),
    ]
  }, [tools])

  const matches = React.useMemo(() => {
    if (!trimmed) return []
    const needle = trimmed.toLowerCase()
    return tools.filter((tool) => tool.name.toLowerCase().includes(needle))
  }, [tools, trimmed])

  return (
    <div className="mt-12">
      {trimmed ? (
        <div>
          <p className="t-caption mb-5 text-center text-ink-mute-2" aria-live="polite">
            {matches.length} {matches.length === 1 ? "tool matches" : "tools match"}{" "}
            <span className="text-on-dark">&ldquo;{trimmed}&rdquo;</span>
          </p>
          <ul className="flex flex-wrap justify-center gap-4">
            {matches.slice(0, MAX_RESULTS).map((tool) => (
              <li key={tool.slug} className="flex w-[92px] flex-col items-center gap-2">
                <span className="tool-tile">
                  <svg className="size-7" aria-hidden="true" focusable="false">
                    <use href={`#tool-${tool.slug}`} />
                  </svg>
                </span>
                <span className="t-micro text-center text-ink-mute-2">
                  {tool.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className={
                /* Two rows under 768px, three above, per section 13. */
                i === 2 ? "marquee-row hidden overflow-hidden md:block" : "marquee-row overflow-hidden"
              }
            >
              <ul
                className="marquee-track"
                data-direction={ROW_DIRECTIONS[i]}
                style={{ animationDuration: ROW_DURATIONS[i] }}
                aria-label={`Connected tools, row ${i + 1}`}
              >
                {row.map((tool) => (
                  <Tile key={tool.slug} tool={tool} />
                ))}
                {row.map((tool) => (
                  <Tile key={`${tool.slug}-copy`} tool={tool} hidden />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto mt-10 flex max-w-[420px] items-center gap-2 rounded-sm border border-white/[0.10] bg-canvas-night-2 px-3 focus-within:outline focus-within:outline-2 focus-within:outline-primary">
        <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute-2" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search 1,000+ tools"
          aria-label="Search connected tools"
          className="h-11 w-full bg-transparent text-sm text-on-dark placeholder:text-ink-mute-2 focus-visible:outline-none"
        />
        {trimmed ? (
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
    </div>
  )
}
