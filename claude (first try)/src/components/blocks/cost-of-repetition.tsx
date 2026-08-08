import { GlowCard } from "@/components/fx/glow-card"

const costs = [
  {
    title: "Time",
    body: "Hours disappear into copying, checking, and chasing.",
  },
  {
    title: "Cost",
    body: "A small manual task becomes a permanent operating cost.",
  },
  {
    title: "Quality",
    body: "The process depends on someone remembering every step.",
  },
  {
    title: "Communication",
    body: "Important tasks get lost between people and tools.",
  },
]

export function CostOfRepetition() {
  return (
    <section
      aria-labelledby="cost-of-repetition-heading"
      className="section-y bg-canvas-soft"
    >
      <div className="shell">
        <h2
          id="cost-of-repetition-heading"
          className="t-display-xl text-ink xl:whitespace-nowrap"
        >
          The task looks small,{" "}
          <span className="glow-text text-primary">the repetition is not.</span>
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {costs.map((cost) => (
            <li key={cost.title} className="h-full">
              <GlowCard className="h-full min-h-40 p-6 sm:min-h-48 sm:p-8">
                <h3 className="text-base sm:text-lg font-medium text-primary">
                  {cost.title}
                </h3>
                <p className="t-heading-md mt-4 max-w-[24ch] text-ink-secondary">
                  {cost.body}
                </p>
              </GlowCard>
            </li>
          ))}
        </ul>

        <p className="t-display-md mt-8 text-ink">
          If a task repeats,{" "}
          <span className="text-primary">your team should not.</span>
        </p>
      </div>
    </section>
  )
}
