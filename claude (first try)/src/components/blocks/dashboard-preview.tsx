"use client"

import * as React from "react"
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/dist/ssr"

import { KineticGridMount } from "@/components/fx/kinetic-grid-mount"
import { Reveal } from "@/components/fx/reveal"
import { cn } from "@/lib/utils"

/*
  The payoff for capability-grid's sixth promise, "It reports". That card
  says numbers arrive without being asked for, and this section is what that
  actually looks like, so the claim has proof instead of just words.

  All figures are illustrative. Same "Sample" convention as CapabilityStage,
  not a real client dashboard, and DESIGN.md's client-numbers rule still
  applies everywhere else on the page.
*/

const stats: {
  label: string
  value: string
  delta: string
  up: boolean
  good: boolean
}[] = [
  { label: "Runs this month", value: "1,248", delta: "+18%", up: true, good: true },
  { label: "Hours saved", value: "96", delta: "+12%", up: true, good: true },
  { label: "Automations live", value: "14", delta: "+2", up: true, good: true },
  { label: "Errors caught", value: "3", delta: "down 40%", up: false, good: true },
]

/* 12 weeks, hand-placed rather than randomised so the line reads as a trend. */
const seriesPoints = [22, 28, 26, 34, 31, 40, 38, 46, 44, 52, 49, 58]

const donutSegments: { label: string; value: number; colour: string }[] = [
  { label: "Data entry", value: 52, colour: "var(--primary)" },
  { label: "Notifications", value: 31, colour: "var(--primary-soft)" },
  { label: "Reports", value: 17, colour: "var(--amber)" },
]

/*
  Arc segments, not a rotated <circle> stroke-dasharray. The rotated-circle
  trick renders correctly in every real browser, but the harness's
  screenshot pane failed to composite a `transform="rotate(...)"` on a
  stroked <circle> even though the DOM/computed styles were all correct,
  confirmed by inspecting the live page. Plain arc <path> commands sidestep
  that entirely and match how the rest of the site's hand-drawn SVGs
  (DataSovereignty's routing line) already work: geometry only, no
  transform.
*/
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }
  const start = toXY(startDeg)
  const end = toXY(endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

function buildLinePath(values: number[], w: number, h: number, pad: number) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const stepX = (w - pad * 2) / (values.length - 1)
  return values
    .map((v, i) => {
      const x = pad + i * stepX
      const y = pad + (1 - (v - min) / span) * (h - pad * 2)
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

function StatCard({
  stat,
  index,
  shown,
}: {
  stat: (typeof stats)[number]
  index: number
  shown: boolean
}) {
  const Arrow = stat.up ? ArrowUpRightIcon : ArrowDownRightIcon
  const colour = stat.good ? "var(--primary)" : "var(--amber)"
  return (
    <div
      className="flex flex-col gap-1.5 rounded-lg border border-hairline bg-canvas-night-2 p-3.5 transition-[opacity,transform] duration-500 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(8px)",
        transitionDelay: `${index * 70}ms`,
      }}
    >
      <span className="t-micro text-ink-mute-2">{stat.label}</span>
      <span className="tabular text-2xl leading-none font-medium text-ink">
        {stat.value}
      </span>
      <span className="t-micro mt-0.5 flex items-center gap-1" style={{ color: colour }}>
        <Arrow size={11} weight="bold" />
        {stat.delta}
      </span>
    </div>
  )
}

function RunsChart({ shown }: { shown: boolean }) {
  const w = 320
  const h = 120
  const pad = 10
  const path = React.useMemo(() => buildLinePath(seriesPoints, w, h, pad), [])
  const areaPath = `${path} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-lg border border-hairline bg-canvas-night-2 p-4">
      <span className="t-micro text-ink-mute-2">Runs over time</span>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="runsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#runsFill)"
          style={{
            opacity: shown ? 1 : 0,
            transition: "opacity 600ms ease-out 300ms",
          }}
        />
        <path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          style={{
            strokeDashoffset: shown ? 0 : 1,
            transition: "stroke-dashoffset 900ms var(--ease-out) 150ms",
          }}
        />
      </svg>
      <span className="t-micro text-ink-mute-2">Last 12 weeks, sample account</span>
    </div>
  )
}

function TypeDonut({ shown }: { shown: boolean }) {
  const size = 108
  const stroke = 14
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  /* -90deg so the first segment starts at 12 o'clock, not 3 o'clock. */
  let cursorDeg = -90

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-lg border border-hairline bg-canvas-night-2 p-4">
      <span className="t-micro text-ink-mute-2">Runs by type</span>
      <div className="flex flex-1 items-center gap-5">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden="true">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--hairline)" strokeWidth={stroke} />
          {donutSegments.map((seg, i) => {
            const startDeg = cursorDeg
            const endDeg = cursorDeg + (seg.value / 100) * 360
            cursorDeg = endDeg
            return (
              <path
                key={seg.label}
                d={arcPath(cx, cy, r, startDeg, endDeg)}
                fill="none"
                stroke={seg.colour}
                strokeWidth={stroke}
                pathLength={1}
                strokeDasharray={1}
                style={{
                  strokeDashoffset: shown ? 0 : 1,
                  transition: `stroke-dashoffset 700ms var(--ease-out) ${300 + i * 150}ms`,
                }}
              />
            )
          })}
        </svg>
        <ul className="flex min-w-0 flex-col gap-2">
          {donutSegments.map((seg) => (
            <li key={seg.label} className="flex min-w-0 items-center gap-2 text-sm">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: seg.colour }}
                aria-hidden="true"
              />
              <span className="truncate text-ink-mute">{seg.label}</span>
              <span className="tabular shrink-0 text-ink-mute-2">{seg.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DashboardPreview() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="the-dashboard" className="section-y">
      <div className="shell">
        <Reveal>
          <h2 className="t-display-xl max-w-[20ch] text-ink">
            It reports back, so you do not have to ask.
          </h2>
          <p className="t-body-lg mt-5 max-w-[58ch] text-ink-mute">
            Every run gets logged the moment it happens. What ran, what it
            touched, what it saved, all collected into one dashboard, waiting
            for you rather than the other way round.
          </p>
        </Reveal>

        <Reveal index={1} className="mt-12">
          <div
            ref={ref}
            aria-hidden="true"
            className="relative overflow-hidden rounded-xl border border-hairline bg-canvas-night shadow-[var(--elev-3)]"
          >
            <KineticGridMount />

            <header className="relative z-10 flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-primary" style={{ boxShadow: "var(--glow-soft)" }} />
                <span className="text-sm font-medium text-ink">Overview</span>
                <span className="t-micro text-ink-mute-2">Updated just now</span>
              </div>
              <span className="t-micro rounded-full bg-white/[0.06] px-2 py-0.5 text-ink-mute-2">
                Sample
              </span>
            </header>

            <div className="relative z-10 flex flex-col gap-4 p-5">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} shown={shown} />
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
                <RunsChart shown={shown} />
                <TypeDonut shown={shown} />
              </div>
            </div>
          </div>
          <p className="sr-only">
            A sample admin dashboard showing automation run counts, hours
            saved, live automations, and errors caught, alongside a chart of
            runs over the last twelve weeks and a breakdown of runs by type.
          </p>
        </Reveal>

        <p className={cn("t-body-lg mt-8 max-w-[62ch] text-ink")}>
          You do not build this. It is there from the first automation, and it
          grows as the rest do.
        </p>
      </div>
    </section>
  )
}
