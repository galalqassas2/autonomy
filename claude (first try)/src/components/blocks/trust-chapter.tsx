import { Reveal } from "@/components/fx/reveal"
import { HoverButton } from "@/components/fx/hover-button"

/*
  Four promises, nothing else. Earlier versions also carried a pillar row and a
  tile row that restated the same three facts, so the section said everything
  three times and the data band above said it a fourth.
*/

const PROMISES = [
  {
    title: "Everything runs in Ireland",
    body: "Your automations are built and run on servers in Ireland, inside the EU, under GDPR.",
  },
  {
    title: "Never trained on your data",
    body: "When an automation reads language, nothing it sends is used to train a model. We can run it on your own server.",
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

export function TrustChapter() {
  return (
    <section id="in-writing" className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl max-w-[16ch] text-on-dark">
          Four things we put in writing.
        </h2>

        <dl className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {PROMISES.map((promise, i) => (
            <Reveal key={promise.title} index={i} className="flex flex-col gap-2">
              <dt className="t-heading-lg text-on-dark">{promise.title}</dt>
              <dd className="t-body-md max-w-[52ch] text-ink-mute-2">{promise.body}</dd>
            </Reveal>
          ))}
        </dl>

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
