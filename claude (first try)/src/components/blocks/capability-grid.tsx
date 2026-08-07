"use client"

import * as React from "react"
import { createAnimatable, utils } from "animejs"
import type { Icon } from "@phosphor-icons/react"
import {
  BellSimpleIcon,
  BrainIcon,
  ChartLineIcon,
  DatabaseIcon,
  GitBranchIcon,
  LightningIcon,
} from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

const TILT = 9

type Capability = { icon: Icon; title: string; description: string }

/*
  Six capabilities, one accent. The supplied component gave every cell its own
  hue, which would have put six colours on a page that allows one, so the tint
  is emerald throughout and only the glow intensity changes on hover.
*/
const CAPABILITIES: Capability[] = [
  {
    icon: BellSimpleIcon,
    title: "It notices",
    description: "An order, an email, a form, a new row. The moment it happens.",
  },
  {
    icon: GitBranchIcon,
    title: "It decides",
    description:
      "Your rules, written down once and applied the same way every time.",
  },
  {
    icon: DatabaseIcon,
    title: "It reads and writes",
    description:
      "The same record, correct in every system, without anyone retyping it.",
  },
  {
    icon: BrainIcon,
    title: "It reads language",
    description: "It handles the messy sentences people actually write.",
  },
  {
    icon: LightningIcon,
    title: "It acts",
    description:
      "Issues the invoice, books the slot, updates the CRM. Inside your tools, under your credentials.",
  },
  {
    icon: ChartLineIcon,
    title: "It reports",
    description: "What ran, what it touched, and what it saved you. Every month.",
  },
]

function Cell({
  item,
  dimmed,
  onEnter,
  onLeave,
}: {
  item: Capability
  dimmed: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const tilt = React.useRef<ReturnType<typeof createAnimatable> | null>(null)

  React.useEffect(() => {
    const card = ref.current
    if (!card) return
    if (window.matchMedia("(pointer: coarse)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    tilt.current = createAnimatable(card, {
      rotateX: { unit: "deg", duration: 320 },
      rotateY: { unit: "deg", duration: 320 },
    })

    return () => {
      tilt.current?.revert()
      tilt.current = null
    }
  }, [])

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current
    const animatable = tilt.current
    if (!card || !animatable) return
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    animatable.rotateX(utils.mapRange(-y, -rect.height / 2, rect.height / 2, -TILT, TILT))
    animatable.rotateY(utils.mapRange(x, -rect.width / 2, rect.width / 2, -TILT, TILT))
  }

  const handleLeave = () => {
    tilt.current?.rotateX(0)
    tilt.current?.rotateY(0)
    onLeave()
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={onEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-lg border p-6",
        "border-hairline bg-white/[0.02]",
        "transition-[opacity,transform,border-color] duration-200 hover:border-hairline-strong",
        dimmed && "scale-[0.975] opacity-55",
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg opacity-100 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, var(--primary-a07), transparent 65%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, var(--primary-a20), transparent 65%)",
        }}
      />

      <span
        className="relative z-10 grid size-10 place-items-center rounded-md text-primary"
        style={{
          background: "var(--primary-a10)",
          boxShadow: "inset 0 0 0 1px var(--primary-a22)",
        }}
      >
        <item.icon size={18} weight="duotone" />
      </span>

      <span className="relative z-10 flex flex-col gap-2">
        <span className="t-heading-lg block text-ink">{item.title}</span>
        <span className="t-body-md block text-ink-mute">{item.description}</span>
      </span>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{
          background: "linear-gradient(to right, var(--primary-a70), transparent)",
        }}
      />
    </div>
  )
}

export function CapabilityGrid() {
  const [hovered, setHovered] = React.useState<string | null>(null)

  return (
    <section id="what-runs-itself" className="section-y">
      <div className="shell">
        <h2 className="t-display-xl max-w-[19ch] text-ink">
          Every automation we build
          <br />
          does <span className="glow-text text-primary">six things</span>.
        </h2>
        <p className="t-body-lg mt-5 max-w-[58ch] text-ink-mute">
          Combined in whatever order your process needs. Nothing here is a template
          you bend your business around.
        </p>

        <div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "1000px" }}
        >
          {CAPABILITIES.map((item) => (
            <Cell
              key={item.title}
              item={item}
              dimmed={hovered !== null && hovered !== item.title}
              onEnter={() => setHovered(item.title)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
