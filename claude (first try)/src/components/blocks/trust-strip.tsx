import { Reveal } from "@/components/fx/reveal"

const items = [
  {
    headline: "Keep your tools.",
    sub: "We connect what you already use.",
  },
  {
    headline: "Go live in 2-6 weeks.",
    sub: "From first map to working automation.",
  },
  {
    headline: "EU hosted.",
    sub: "Your automations run in Ireland.",
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Why choose Autonomy" className="border-y border-hairline bg-canvas-soft">
      <div className="shell">
        <ul className="grid md:grid-cols-3 md:divide-x md:divide-hairline">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.headline}
              index={i}
              className="border-t border-hairline py-5 first:border-t-0 md:border-t-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <div className="py-1">
                <span className="block text-base leading-snug font-medium text-ink">
                  {item.headline}
                </span>
                <span className="t-caption mt-1 block text-ink-mute">{item.sub}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
