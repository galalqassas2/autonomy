import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { GlowCard } from "@/components/fx/glow-card"
import { Reveal } from "@/components/fx/reveal"

/*
  The whole argument is on the face of each card. An earlier version hid the
  points behind a flip, which cost the reader an interaction before they could
  compare anything, and cost the copy a line explaining the interaction.
*/

type Option = {
  title: string
  cost: string
  body: string
  points: string[]
  ours?: boolean
}

const OPTIONS: Option[] = [
  {
    title: "Hire another person",
    cost: "Recurring, forever",
    body: "A salary absorbs the volume for a year. The work still exists, it is just someone else's day now.",
    points: [
      "The cost repeats every year",
      "Holiday, illness and notice periods",
      "They leave, and the process leaves with them",
    ],
  },
  {
    title: "Buy another tool",
    cost: "A subscription, plus a migration",
    body: "Off the shelf software fits its own process, not yours. Your team adapts to it, and the gaps stay manual.",
    points: [
      "Your process bends to fit the product",
      "A migration before anything improves",
      "The awkward 20 percent stays manual",
    ],
  },
  {
    title: "Build the system",
    cost: "One project, then it is yours",
    body: "Built once, inside what you already own. It runs every day after that at no extra cost.",
    points: [
      "Runs on the tools your team already knows",
      "Yours entirely, in your own accounts",
      "The cost stops, the saving does not",
    ],
    ours: true,
  },
]

export function TheChoice() {
  return (
    <section className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl max-w-[16ch] text-ink">
          Three ways to fix this.
          <br />
          <span className="glow-text text-primary">Only one of them ends.</span>
        </h2>
        <p className="t-body-lg mt-5 max-w-[54ch] text-ink-mute">
          Two of them you pay for again next year.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {OPTIONS.map((option, i) => (
            <Reveal key={option.title} index={i}>
              <GlowCard lit={option.ours} className="flex h-full flex-col gap-5 p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="t-display-md text-ink">{option.title}</h3>
                  {option.ours ? (
                    <span className="pill-green mt-1 shrink-0">What we do</span>
                  ) : null}
                </div>

                <p className="t-body-md text-ink-mute">{option.body}</p>

                <ul className="flex flex-col gap-3">
                  {option.points.map((point) => (
                    <li key={point} className="t-body-md flex items-start gap-2.5 text-ink-mute">
                      <ArrowRightIcon
                        size={13}
                        weight="bold"
                        className="mt-1.5 shrink-0 text-primary"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="t-caption mt-auto border-t border-hairline pt-4 text-ink">
                  {option.cost}
                </p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
