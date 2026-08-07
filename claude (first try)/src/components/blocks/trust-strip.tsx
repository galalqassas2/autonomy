import { Reveal } from "@/components/fx/reveal"
import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"

const items: { icon: Icon3DName; headline: string; sub: string }[] = [
  {
    icon: "hub",
    headline: "1,000+ tools connected",
    sub: "If it has an API, we can automate it",
  },
  {
    icon: "gauge",
    headline: "Live in 2 to 6 weeks",
    sub: "From the first conversation to a working automation",
  },
  {
    icon: "pin",
    headline: "Hosted in Ireland",
    sub: "Your automations run in Ireland, inside the EU",
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-hairline bg-canvas-soft">
      <div className="shell py-8">
        <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
          {items.map((item, i) => (
            <Reveal as="li" key={item.headline} index={i} className="flex items-center gap-4">
              <span className="icon-plate">
                <Icon3D name={item.icon} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-base leading-snug font-medium text-ink">
                  {item.headline}
                </span>
                <span className="t-caption text-ink-mute">{item.sub}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
