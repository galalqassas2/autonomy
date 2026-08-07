import { Reveal } from "@/components/fx/reveal"
import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"

const costs: { icon: Icon3DName; title: string; body: string }[] = [
  {
    icon: "clock",
    title: "Time",
    body: "The same information is typed into three systems, every day.",
  },
  {
    icon: "coins",
    title: "Cost",
    body: "Skilled people spend their week on work a system should do for free.",
  },
  {
    icon: "quality",
    title: "Quality",
    body: "Every manual handoff can go wrong. Weeks pass before anyone notices.",
  },
  {
    icon: "inbox",
    title: "Communication",
    body: "Where things stand lives in an inbox instead of in the system.",
  },
]

export function TheWork() {
  return (
    <section id="the-work" className="section-y">
      <div className="shell">
        <h2 className="t-display-xl max-w-[19ch] text-ink">
          Four costs you pay every week.
          <br />
          None of them appear on an invoice.
        </h2>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {costs.map((cost, i) => (
            <Reveal as="li" key={cost.title} index={i} className="card-light p-8">
              <span className="icon-plate">
                <Icon3D name={cost.icon} />
              </span>
              <h3 className="t-heading-lg mt-6 text-ink">{cost.title}</h3>
              <p className="t-body-md mt-2 text-ink-mute">{cost.body}</p>
            </Reveal>
          ))}
        </ul>

        <p className="t-body-lg mt-10 max-w-[62ch] text-ink">
          They never get fixed because they never get measured. That is where we
          start.
        </p>
      </div>
    </section>
  )
}
