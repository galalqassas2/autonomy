"use client"

import * as React from "react"
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { animate } from "animejs"

import { PegtopLoader } from "@/components/fx/pegtop-loader"
import { CAPABILITIES } from "@/lib/capabilities"
import { TOOLS } from "@/lib/tools"
import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

import { CapabilityStage } from "./capability-stage"
import { ToolMark } from "./capability-widgets/tool-mark"

/* Long enough to read as the system picking the job up, short enough to skip. */
const ARM_MS = 420

const TABLET_FLOW_POSITIONS = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-3 lg:row-start-3",
  "lg:col-start-1 lg:row-start-3",
] as const

const TABLET_CONNECTORS = [
  {
    icon: ArrowRightIcon,
    className: "left-full top-1/2 h-11 w-8 -translate-y-1/2",
  },
  {
    icon: ArrowDownIcon,
    className: "left-1/2 top-full h-6 w-11 -translate-x-1/2",
  },
  {
    icon: ArrowLeftIcon,
    className: "right-full top-1/2 h-11 w-8 -translate-y-1/2",
  },
] as const

const FEATURED_AUTOMATIONS = [
  {
    team: "Finance",
    jobId: "quote-to-cash",
    title: "Send every invoice when the deal closes.",
    summary:
      "Pipedrive marks the deal won. Xero creates the invoice. Stripe sends the payment link.",
  },
  {
    team: "Sales",
    jobId: "lead",
    title: "Qualify and route every new lead.",
    summary:
      "Typeform captures the lead. Ollama qualifies it. HubSpot assigns it. Slack alerts the rep.",
  },
  {
    team: "Operations",
    jobId: "reorder",
    title: "Reorder stock before it runs out.",
    summary:
      "Shopify detects low stock. Sheets checks the threshold. Outlook prepares the purchase order.",
  },
  {
    team: "Support",
    jobId: "triage",
    title: "Prioritize urgent tickets and prepare the reply.",
    summary:
      "Zendesk receives the ticket. Ollama identifies urgency and drafts the reply. Slack alerts the right team.",
  },
  {
    team: "HR",
    jobId: "onboard",
    title: "Start onboarding when the offer is signed.",
    summary:
      "The signed offer creates the accounts, access, and first-week schedule.",
  },
] as const

type Team = (typeof FEATURED_AUTOMATIONS)[number]["team"]

const TOOL_NAMES = new Map(TOOLS.map((tool) => [tool.slug, tool.name]))

const AUTOMATIONS = FEATURED_AUTOMATIONS.map((automation) => {
  const job = CAPABILITIES.find((item) => item.id === automation.jobId)
  if (!job) throw new Error(`Missing featured automation: ${automation.jobId}`)
  return { ...automation, job }
})

const DEFAULT_TEAM = FEATURED_AUTOMATIONS[0].team

export function WhatWeAutomate() {
  const [team, setTeam] = React.useState<Team>(DEFAULT_TEAM)
  const [arming, setArming] = React.useState(false)
  const reduce = useReducedMotion()

  const tabsRef = React.useRef<HTMLDivElement>(null)
  const pillRef = React.useRef<HTMLSpanElement>(null)
  const tabs = React.useRef(new Map<string, HTMLButtonElement>())

  const automation = AUTOMATIONS.find((item) => item.team === team) ?? AUTOMATIONS[0]

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
  }, [automation.job.id, reduce])

  const selectTeam = (name: Team) => {
    if (name === team) return
    setTeam(name)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = AUTOMATIONS.findIndex((item) => item.team === team)
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? AUTOMATIONS.length - 1
          : event.key === "ArrowRight"
            ? (current + 1) % AUTOMATIONS.length
            : event.key === "ArrowLeft"
              ? (current - 1 + AUTOMATIONS.length) % AUTOMATIONS.length
              : -1
    if (nextIndex < 0) return
    event.preventDefault()
    const nextTeam = AUTOMATIONS[nextIndex].team
    selectTeam(nextTeam)
    requestAnimationFrame(() => tabs.current.get(nextTeam)?.focus())
  }

  return (
    <section id="what-we-automate" className="section-y bg-canvas-soft">
      <div className="shell">
        <div className="max-w-[64ch]">
          <h2 className="t-display-xl text-ink">
            Whatever automation, <span className="text-primary">we finish it.</span>
          </h2>
          <p className="t-body-lg mt-5 text-ink-mute">
            See how one trigger carries a real job from start to finish.
          </p>
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Teams"
          onKeyDown={onKeyDown}
          className="relative mt-12 flex snap-x snap-mandatory gap-1 overflow-x-auto rounded-full border border-hairline bg-canvas p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible"
        >
          <span
            ref={pillRef}
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-0 z-0 w-0 rounded-md border border-primary/40 bg-primary/[0.10]"
            style={{ boxShadow: "var(--glow-soft)" }}
          />

          {AUTOMATIONS.map((item) => {
            const on = item.team === team
            const tabId = `automation-tab-${item.team.toLowerCase()}`
            return (
              <button
                key={item.team}
                ref={(el) => {
                  if (el) tabs.current.set(item.team, el)
                  else tabs.current.delete(item.team)
                }}
                id={tabId}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="automation-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => selectTeam(item.team)}
                className={cn(
                  "relative z-10 flex shrink-0 snap-start items-center rounded-md px-5 py-2.5 transition-colors duration-200",
                  on ? "text-ink" : "text-ink-mute hover:text-ink",
                )}
              >
                <span className="text-sm font-medium">{item.team}</span>
              </button>
            )
          })}
        </div>

        <div
          id="automation-panel"
          role="tabpanel"
          aria-labelledby={`automation-tab-${team.toLowerCase()}`}
          className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(500px,0.86fr)] xl:gap-16"
        >
          <article
            key={automation.job.id}
            className="max-w-[640px]"
            style={{ animation: reduce ? undefined : "caption-in 320ms var(--ease-out) both" }}
          >
            <h3 className="t-display-md text-ink">{automation.title}</h3>
            <p className="t-body-md mt-4 max-w-[48ch] text-ink-mute">
              {automation.summary}
            </p>

            <ol
              aria-label="Tools in this automation"
              className="mt-7 grid w-full grid-cols-2 gap-2 sm:flex sm:max-w-[760px] sm:items-center sm:gap-2 lg:grid lg:max-w-[520px] lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:grid-rows-[auto_1.5rem_auto] lg:gap-0 xl:flex xl:max-w-[760px] xl:items-center xl:gap-2"
            >
              {automation.job.tools.map((slug, index) => {
                const tabletConnector = TABLET_CONNECTORS[index]
                const TabletConnectorIcon = tabletConnector?.icon

                return (
                  <li
                    key={slug}
                    className={cn(
                      "relative min-w-0 sm:flex sm:flex-auto sm:items-center sm:gap-2 lg:block xl:flex",
                      TABLET_FLOW_POSITIONS[index],
                      automation.job.tools.length === 3 &&
                        index === 2 &&
                        "col-span-2 lg:col-span-1",
                    )}
                  >
                    <span className="flex min-h-11 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md border border-hairline bg-canvas px-2.5 py-2.5 sm:px-3">
                      <span className="t-micro tabular shrink-0 text-ink-faint sm:hidden">
                        {index + 1}
                      </span>
                      <ToolMark slug={slug} className="size-5 shrink-0" />
                      <span
                        title={TOOL_NAMES.get(slug) ?? slug}
                        className="truncate text-xs font-medium text-ink-secondary sm:text-sm"
                      >
                        {TOOL_NAMES.get(slug) ?? slug}
                      </span>
                    </span>

                    {index < automation.job.tools.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="hidden shrink-0 place-items-center sm:grid lg:hidden xl:grid"
                      >
                        <ArrowRightIcon size={14} className="text-ink-faint" />
                      </span>
                    ) : null}

                    {index < automation.job.tools.length - 1 &&
                    tabletConnector &&
                    TabletConnectorIcon ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute hidden place-items-center text-ink-faint lg:grid xl:hidden",
                          tabletConnector.className,
                        )}
                      >
                        <TabletConnectorIcon size={14} />
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ol>

            <p className="mt-7 text-sm text-ink-mute">
              <span className="font-medium text-primary">1,000+</span> tools supported.
            </p>
          </article>

          <div className="mx-auto w-full max-w-[560px]">
            <div className="relative">
              <CapabilityStage key={automation.job.id} item={automation.job} />
              {arming ? (
                <span
                  className="dark-scope absolute inset-0 grid place-items-center rounded-xl bg-canvas-night"
                  style={{ animation: "caption-in 160ms var(--ease-out) both" }}
                >
                  <PegtopLoader size={44} label="Starting the run" />
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
