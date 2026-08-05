import { Reveal } from "@/components/fx/reveal"
import { HoverButton } from "@/components/fx/hover-button"
import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"

/* The three trust-chapter icons, per section 10. */
const pillars: { icon: Icon3DName; title: string; sub: string }[] = [
  { icon: "rack", title: "Ireland", sub: "Where your data lives and stays" },
  { icon: "shield", title: "Our own AI", sub: "No third party model sees it" },
  { icon: "key", title: "Yours", sub: "Export or delete at any time" },
]

const promises = [
  {
    title: "Your data never trains a model",
    body: "We run our own AI. Your messages, documents and records are never used to train a model, ours or anyone else's.",
  },
  {
    title: "Everything runs in Ireland",
    body: "Your data is processed and stored on servers in Ireland, inside the EU, under GDPR. It does not leave.",
  },
  {
    title: "You own what we build",
    body: "The workflows, the accounts, the credentials and the documentation. Any developer can pick it up.",
  },
  {
    title: "Access is scoped",
    body: "Each automation gets only the permissions it needs, and loses them the day it does not.",
  },
]

const tiles = [
  { label: "Ireland", sub: "where your data lives" },
  { label: "Our own AI", sub: "no third party model sees it" },
  { label: "Encrypted", sub: "at rest and in transit" },
  { label: "Yours", sub: "export or delete at any time" },
]

export function TrustChapter() {
  return (
    <section
      id="in-writing"
      className="py-20 lg:py-24"
      style={{ background: "var(--canvas-soft)" }}
    >
      <div className="shell">
        <h2 className="t-display-xl max-w-[16ch] text-on-dark">
          Four things we put in writing.
        </h2>

        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.title} index={i} className="flex items-start gap-4">
              <span className="icon-plate">
                <Icon3D name={pillar.icon} />
              </span>
              <span className="flex flex-col gap-1 pt-1.5">
                <span className="t-heading-md text-on-dark">{pillar.title}</span>
                <span className="t-caption text-ink-mute-2">{pillar.sub}</span>
              </span>
            </Reveal>
          ))}
        </ul>

        <dl className="mt-16 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {promises.map((promise, i) => (
            <Reveal key={promise.title} index={i} className="flex flex-col gap-2">
              <dt className="t-heading-lg text-on-dark">{promise.title}</dt>
              <dd className="t-body-md max-w-[52ch] text-ink-mute-2">
                {promise.body}
              </dd>
            </Reveal>
          ))}
        </dl>

        <ul className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <li
              key={tile.label}
              className="flex flex-col gap-1 rounded-md border border-white/[0.10] px-5 py-4"
            >
              <span className="text-sm font-medium text-on-dark">{tile.label}</span>
              <span className="t-caption text-ink-mute-2">{tile.sub}</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-6 border-t border-white/[0.08] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-body-lg max-w-[46ch] text-on-dark">
            If you ever stop working with us, everything keeps running.
          </p>
          <HoverButton href="#start">Start your first automation</HoverButton>
        </div>
      </div>
    </section>
  )
}
