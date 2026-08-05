import { Reveal } from "@/components/fx/reveal"
import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"

const steps: {
  number: string
  icon: Icon3DName
  step: string
  body: string
  timing: string
}[] = [
  {
    number: "01",
    icon: "map",
    step: "Map",
    body: "We sit with the people doing the work and draw the process as it really runs.",
    timing: "1 hour",
  },
  {
    number: "02",
    icon: "target",
    step: "Scope",
    body: "We pick the smallest change with the largest return and agree the number we are judged on.",
    timing: "1 week",
  },
  {
    number: "03",
    icon: "blocks",
    step: "Build",
    body: "We build inside your existing tools and test it on sample data before it touches anything live.",
    timing: "2 to 6 weeks",
  },
  {
    number: "04",
    icon: "gauge",
    step: "Run",
    body: "We watch it, fix what breaks, and report what it saved you.",
    timing: "Ongoing",
  },
]

export function TheBuild() {
  return (
    <section id="the-build" className="section-y">
      <div className="shell">
        <h2 className="t-display-xl max-w-[16ch] text-ink">
          Four steps.
          <br />
          You are only needed for the first.
        </h2>

        <ol className="mt-12 flex flex-col">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              index={i}
              className="grid gap-4 border-t border-hairline py-8 md:grid-cols-[auto_auto_1fr_auto] md:items-start md:gap-8"
            >
              <span className="t-mono pt-1 text-ink-faint">{step.number}</span>
              <span className="icon-plate">
                <Icon3D name={step.icon} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="t-display-md text-ink">{step.step}</h3>
                <p className="t-body-md max-w-[62ch] text-ink-mute">{step.body}</p>
              </div>
              <span className="t-caption pt-2 text-ink-mute md:text-right">
                {step.timing}
              </span>
            </Reveal>
          ))}
        </ol>

        <p className="t-body-lg mt-8 max-w-[62ch] text-ink">
          You keep working the way you work. Nothing gets migrated, nothing gets
          replaced.
        </p>
      </div>
    </section>
  )
}
