"use client"

import * as React from "react"
import { ArrowRightIcon, RepeatIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

type Option = {
  title: string
  cost: string
  description: string
  points: string[]
  promoted?: boolean
}

const OPTIONS: Option[] = [
  {
    title: "Hire another person",
    cost: "Recurring, forever",
    description:
      "A salary absorbs the volume for a year. The work still exists, it is just someone else's day now.",
    points: [
      "The cost repeats every single year",
      "Holiday, illness and notice periods",
      "They leave, and the process leaves with them",
    ],
  },
  {
    title: "Buy another tool",
    cost: "A subscription, plus a migration",
    description:
      "Off the shelf software fits its own process, not yours. Your team adapts to it, and the gaps stay manual.",
    points: [
      "Your process bends to fit the product",
      "A migration before anything improves",
      "The awkward 20 percent stays manual",
    ],
  },
  {
    title: "Build the system",
    cost: "One project, then it is yours",
    description:
      "Built once, inside what you already own. It runs every day after that at no additional cost.",
    points: [
      "Runs on the tools your team already knows",
      "Yours entirely, in your own accounts",
      "The cost stops, the saving does not",
    ],
    promoted: true,
  },
]

/*
  Flip cards. The face states the option and what it costs, the back makes the
  argument. Hover flips on a pointer, tap flips on touch, and the whole card is
  a button so it is reachable by keyboard.
*/
function FlipCard({ option }: { option: Option }) {
  const [flipped, setFlipped] = React.useState(false)

  return (
    <div
      className="group relative h-[340px] w-full [perspective:2000px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <button
        type="button"
        aria-expanded={flipped}
        onClick={() => setFlipped((v) => !v)}
        onFocus={() => setFlipped(true)}
        onBlur={() => setFlipped(false)}
        className={cn(
          "relative h-full w-full text-left [transform-style:preserve-3d]",
          "transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none",
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
        )}
      >
        {/* Face */}
        <span
          className={cn(
            "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-lg p-7",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "border bg-white/[0.02]",
            option.promoted ? "border-primary/60" : "border-hairline",
          )}
        >
          {option.promoted ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(62,207,142,0.14), transparent 62%)",
              }}
            />
          ) : null}

          <span className="relative flex items-start justify-between gap-3">
            {option.promoted ? (
              <span className="pill-green">What we do</span>
            ) : (
              <span />
            )}
            <RepeatIcon
              size={16}
              className="shrink-0 text-primary transition-transform duration-300 group-hover:-rotate-12"
            />
          </span>

          <span className="relative flex flex-col gap-3">
            <span className="t-display-md block text-ink">{option.title}</span>
            <span className="t-body-md block text-ink-mute">
              {option.description}
            </span>
            <span className="t-caption mt-2 block border-t border-hairline pt-4 text-ink">
              {option.cost}
            </span>
          </span>
        </span>

        {/* Back */}
        <span
          className={cn(
            "absolute inset-0 flex flex-col justify-between rounded-lg p-7",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "border bg-white/[0.04]",
            option.promoted ? "border-primary/60" : "border-hairline",
          )}
        >
          <span className="flex flex-col gap-5">
            <span className="t-heading-lg block text-ink">{option.title}</span>
            <span className="flex flex-col gap-3">
              {option.points.map((point, i) => (
                <span
                  key={point}
                  className="t-body-md flex items-start gap-2.5 text-ink-mute transition-[transform,opacity] duration-300"
                  style={{
                    transform: flipped ? "none" : "translateX(-10px)",
                    opacity: flipped ? 1 : 0,
                    transitionDelay: `${i * 60 + 160}ms`,
                  }}
                >
                  <ArrowRightIcon
                    size={13}
                    weight="bold"
                    className="mt-1.5 shrink-0 text-primary"
                  />
                  {point}
                </span>
              ))}
            </span>
          </span>

          <span className="t-caption border-t border-hairline pt-4 text-ink">
            {option.cost}
          </span>
        </span>
      </button>
    </div>
  )
}

export function TheChoice() {
  return (
    <section className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl max-w-[16ch] text-ink">
          Three ways to solve this.
          <br />
          Only one of them ends.
        </h2>
        <p className="t-body-lg mt-5 max-w-[54ch] text-ink-mute">
          Two of these you pay for again next year. Turn a card over to see what
          each one actually costs you.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {OPTIONS.map((option) => (
            <FlipCard key={option.title} option={option} />
          ))}
        </div>
      </div>
    </section>
  )
}
