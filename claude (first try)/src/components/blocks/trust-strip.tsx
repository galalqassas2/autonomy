import { Reveal } from "@/components/fx/reveal"

const items = [
  {
    headline: "Keep your tools.",
    sub: "We connect what you already use.",
    href: "#what-we-connect",
  },
  {
    headline: "Go live in 2–6 weeks.",
    sub: "From first map to working automation.",
    href: "#the-build",
  },
  {
    headline: "EU hosted.",
    sub: "Your automations run in Ireland.",
    href: "#your-data",
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
              <a
                href={item.href}
                className="group block rounded-sm py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="block text-base leading-snug font-medium text-ink transition-colors group-hover:text-primary">
                  {item.headline}
                </span>
                <span className="t-caption mt-1 block text-ink-mute">{item.sub}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
