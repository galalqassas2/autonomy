"use client"

import * as React from "react"
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr"

import { LogoWall, type WallTile } from "@/components/fx/logo-wall"
import { useMediaQuery } from "@/lib/use-media"

import { ToolMark } from "./capability-widgets/tool-mark"

/*
  The drifting wall is decorative, so everything readable lives here: a search
  over every connected tool, and a hidden roll of names for screen readers.
*/

type Tool = { name: string; slug: string }

const MAX_RESULTS = 24

export function ToolBrowser({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = React.useState("")
  const wide = useMediaQuery("(min-width: 1024px)")
  const medium = useMediaQuery("(min-width: 640px)")
  const term = query.trim()

  const tiles = React.useMemo<WallTile[]>(
    () =>
      tools.map((tool) => ({
        id: tool.slug,
        label: tool.name,
        node: <ToolMark slug={tool.slug} className="size-[42%]" />,
      })),
    [tools],
  )

  const matches = React.useMemo(() => {
    if (!term) return []
    const needle = term.toLowerCase()
    return tools.filter((tool) => tool.name.toLowerCase().includes(needle))
  }, [tools, term])

  return (
    <div className="mt-10">
      {/* Above the wall, so results land where the eye already is. */}
      <div className="mx-auto flex max-w-[420px] items-center gap-2 rounded-sm border border-white/[0.10] bg-canvas-night-2 px-3 focus-within:outline focus-within:outline-2 focus-within:outline-primary">
        <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute-2" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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

      {term ? (
        <div className="mt-8 min-h-[360px]">
          <p className="t-caption mb-6 text-center text-ink-mute-2" aria-live="polite">
            {matches.length} {matches.length === 1 ? "tool matches" : "tools match"}{" "}
            <span className="text-on-dark">&ldquo;{term}&rdquo;</span>
          </p>
          <ul className="flex flex-wrap justify-center gap-4">
            {matches.slice(0, MAX_RESULTS).map((tool) => (
              <li key={tool.slug} className="flex w-[92px] flex-col items-center gap-2">
                <span className="tool-tile">
                  <ToolMark slug={tool.slug} className="size-7" />
                </span>
                <span className="t-micro text-center text-ink-mute-2">{tool.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 h-[380px] lg:h-[480px]">
          <LogoWall
            tiles={tiles}
            columns={wide ? 7 : medium ? 5 : 3}
            tileSize={wide ? 132 : 104}
          />
        </div>
      )}

      <p className="sr-only">
        Connected tools include {tools.map((tool) => tool.name).join(", ")}.
      </p>
    </div>
  )
}
