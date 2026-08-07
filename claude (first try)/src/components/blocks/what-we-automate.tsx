"use client"

import * as React from "react"
import { animate } from "animejs"

import { PegtopLoader } from "@/components/fx/pegtop-loader"
import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"
import { CAPABILITIES, type Capability } from "@/lib/capabilities"
import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

import { CapabilityStage } from "./capability-stage"
import { ToolMark } from "./capability-widgets/tool-mark"

/*
  One question, asked once: pick a team, then pick a job, and watch it run.
  Departments and jobs used to be two sections with two controls, two
  headings and two sets of demo components showing the same four scenarios.
*/

/* Long enough to read as the system picking the job up, short enough to skip. */
const ARM_MS = 420

const TEAMS: { name: string; icon: Icon3DName }[] = [
  { name: "Finance", icon: "receipt" },
  { name: "Sales", icon: "funnel" },
  { name: "Operations", icon: "crates" },
  { name: "Support", icon: "bubbles" },
  { name: "HR", icon: "badge" },
  { name: "Management", icon: "gauge" },
]

const jobsFor = (team: string) => CAPABILITIES.filter((job) => job.team === team)

const DEFAULT_TEAM = TEAMS[0].name
const DEFAULT_JOB = jobsFor(DEFAULT_TEAM)[0].id

function JobCard({
  job,
  active,
  onSelect,
}: {
  job: Capability
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-all duration-200",
        active
          ? "border-primary/50 bg-primary/[0.07]"
          : "border-hairline bg-white/[0.02] hover:border-hairline-strong",
      )}
      style={active ? { boxShadow: "var(--glow-soft)" } : undefined}
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
        {job.label}
      </span>
      <span className="flex shrink-0 items-center -space-x-1.5">
        {job.tools.map((slug) => (
          <span
            key={slug}
            className="grid size-7 place-items-center rounded-full border border-hairline bg-canvas-night"
          >
            <ToolMark slug={slug} className="size-4" />
          </span>
        ))}
      </span>
    </button>
  )
}

export function WhatWeAutomate() {
  const [team, setTeam] = React.useState(DEFAULT_TEAM)
  const [jobId, setJobId] = React.useState(DEFAULT_JOB)
  const [arming, setArming] = React.useState(false)
  const reduce = useReducedMotion()

  const tabsRef = React.useRef<HTMLDivElement>(null)
  const pillRef = React.useRef<HTMLSpanElement>(null)
  const tabs = React.useRef(new Map<string, HTMLButtonElement>())

  const jobs = React.useMemo(() => jobsFor(team), [team])
  const job = jobs.find((item) => item.id === jobId) ?? jobs[0]

  /* The pill measures the live tab, so it survives font and width changes. */
  React.useLayoutEffect(() => {
    const list = tabsRef.current
    const pill = pillRef.current
    if (!list || !pill) return

    const move = () => {
      const tab = tabs.current.get(team)
      if (!tab) return
      animate(pill, {
        width: tab.offsetWidth,
        x: tab.offsetLeft - list.scrollLeft,
        duration: reduce ? 0 : 420,
        ease: "outElastic(1, 0.85)",
      })
    }

    const frame = requestAnimationFrame(move)
    const observer = new ResizeObserver(move)
    observer.observe(list)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [team, reduce])

  /* Switching pauses on the loader, so the change reads as work starting. */
  React.useEffect(() => {
    if (reduce) return
    setArming(true)
    const timer = window.setTimeout(() => setArming(false), ARM_MS)
    return () => window.clearTimeout(timer)
  }, [job.id, reduce])

  const selectTeam = (name: string) => {
    if (name === team) return
    setTeam(name)
    setJobId(jobsFor(name)[0].id)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    event.preventDefault()
    const index = TEAMS.findIndex((item) => item.name === team)
    selectTeam(TEAMS[(index + step + TEAMS.length) % TEAMS.length].name)
  }

  return (
    <section id="what-we-automate" className="section-y bg-canvas-soft">
      <div className="shell">
        <div className="mx-auto max-w-[62ch] text-center">
          <h2 className="t-display-xl text-ink">
            Pick a job your team does every day.
            <br />
            <span className="glow-text text-primary">Watch it handled.</span>
          </h2>
          <p className="t-body-lg mt-5 text-ink-mute">
            Choose a team, then a job. Each one runs end to end in the tools you
            already use.
          </p>
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Teams"
          onKeyDown={onKeyDown}
          className="relative mt-10 flex snap-x snap-mandatory gap-1 overflow-x-auto rounded-lg border border-hairline bg-white/[0.02] p-1.5 lg:overflow-visible"
        >
          <span
            ref={pillRef}
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-0 z-0 w-0 rounded-md border border-primary/40 bg-primary/[0.10]"
            style={{ boxShadow: "var(--glow-soft)" }}
          />

          {TEAMS.map(({ name, icon }) => {
            const on = name === team
            return (
              <button
                key={name}
                ref={(el) => {
                  if (el) tabs.current.set(name, el)
                  else tabs.current.delete(name)
                }}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="job-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => selectTeam(name)}
                className={cn(
                  "relative z-10 flex shrink-0 snap-start items-center gap-2.5 rounded-md px-4 py-2.5 transition-colors duration-200",
                  on ? "text-ink" : "text-ink-mute hover:text-ink",
                )}
              >
                <Icon3D name={icon} size={26} />
                <span className="text-sm font-medium">{name}</span>
              </button>
            )
          })}
        </div>

        <div
          id="job-panel"
          role="tabpanel"
          className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12"
        >
          <div className="flex flex-col gap-2.5">
            {jobs.map((item) => (
              <JobCard
                key={item.id}
                job={item}
                active={item.id === job.id}
                onSelect={() => setJobId(item.id)}
              />
            ))}
          </div>

          <div className="mx-auto w-full max-w-[380px]">
            <div className="relative">
              <CapabilityStage key={job.id} item={job} />
              {arming ? (
                <span
                  className="absolute inset-0 grid place-items-center rounded-xl bg-canvas-night"
                  style={{ animation: "caption-in 160ms var(--ease-out) both" }}
                >
                  <PegtopLoader size={44} label="Starting the run" />
                </span>
              ) : null}
            </div>
            <p className="t-caption mt-4 text-center text-ink-mute">{job.impact}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
