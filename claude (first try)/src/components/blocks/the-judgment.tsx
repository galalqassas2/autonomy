"use client"

import * as React from "react"

import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"

/*
  Four verbs in the order the work happens, each with the shortest concrete
  example that still names something real. They sit on one rail rather than in
  four cards, because this is a sequence and the page already runs a four-up
  card grid in the section above.
*/
const STEPS: { icon: Icon3DName; name: string; body: string }[] = [
  { icon: "inbox", name: "Reads", body: "Emails, PDFs, call transcripts." },
  { icon: "funnel", name: "Decides", body: "Urgent or routine. Who owns it." },
  { icon: "receipt", name: "Drafts", body: "The reply, the invoice, the report." },
  { icon: "badge", name: "Asks", body: "Nothing risky moves without you." },
]

export function TheJudgment() {
  const rail = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)

  /* The beam draws once, so scrolling back up does not replay it. */
  React.useEffect(() => {
    const element = rail.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="the-ai" className="section-y">
      <div className="shell">
        <h2 className="t-display-xl max-w-[22ch] text-ink sm:max-w-[36ch]">
          Someone has to read it and decide.
          <br className="hidden sm:block" />{" "}
          <span className="glow-text text-primary">That someone can be software.</span>
        </h2>

        <div ref={rail} data-shown={shown} className="judgment-rail">
          <span aria-hidden="true" className="judgment-track" />
          <span aria-hidden="true" className="judgment-beam" />

          <ol className="judgment-steps">
            {STEPS.map((step, index) => (
              <li
                key={step.name}
                className="judgment-step"
                style={{ "--step-delay": `${index * 170}ms` } as React.CSSProperties}
              >
                <span className="icon-plate">
                  <Icon3D name={step.icon} size={28} />
                </span>
                <h3 className="t-display-md mt-5 text-ink">{step.name}</h3>
                <p className="t-body-md mt-2 max-w-[30ch] text-ink-mute">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="t-body-md mt-14 border-t border-hairline pt-6 text-ink-mute">
          <span className="font-medium text-primary">Your data never trains an AI.</span>{" "}
          You choose which one we use.
        </p>
      </div>
    </section>
  )
}
