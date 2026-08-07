import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { toolIndex } from "@/lib/tools"

import { ToolBrowser } from "./tool-browser"

const stats = [
  { value: "1,000+", label: "tools connected" },
  { value: "8", label: "messaging channels" },
  { value: "Any", label: "REST or webhook endpoint" },
  { value: "0", label: "tools you have to replace" },
]

export function Integrations() {
  return (
    <section id="what-we-connect" className="py-14 lg:py-20">
      <div className="shell max-sm:px-0">
        <div className="island max-sm:rounded-none px-5 py-16 sm:px-8 lg:mx-8 lg:px-12 lg:py-24">
          <h2 className="t-display-xl mx-auto max-w-[18ch] text-center text-on-dark">
            We connect to{" "}
            <span className="glow-text text-primary">1,000+ tools</span> you already
            pay for.
          </h2>

          <p className="t-body-lg mx-auto mt-5 max-w-[56ch] text-center text-ink-mute-2">
            Pre-built connectors for the apps you use. A custom connection for
            everything else.
          </p>

          <ToolBrowser tools={toolIndex} />

          <dl className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-[28px] leading-none font-medium text-on-dark">
                  {stat.value}
                </dt>
                <dd className="t-caption text-ink-mute-2">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col items-start gap-3">
            <a
              href="#start"
              className="t-button inline-flex items-center gap-1.5 text-primary transition-opacity duration-150 hover:opacity-80"
            >
              Ask us about a tool
              <ArrowRightIcon size={14} weight="bold" />
            </a>
            <p className="t-caption text-ink-mute-2">
              Don&rsquo;t see yours? Tell us and we&rsquo;ll connect it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
