import { AutomationStage } from "@/components/blocks/automation-stage"
import { CapabilityGrid } from "@/components/blocks/capability-grid"
import { ClosingCta } from "@/components/blocks/closing-cta"
import { DataSovereignty } from "@/components/blocks/data-sovereignty"
import { Faq } from "@/components/blocks/faq"
import { Hero } from "@/components/blocks/hero"
import { Integrations } from "@/components/blocks/integrations"
import { TheBuild } from "@/components/blocks/the-build"
import { TheChoice } from "@/components/blocks/the-choice"
import { TheWork } from "@/components/blocks/the-work"
import { TimeCalculator } from "@/components/blocks/time-calculator"
import { ToolSprite } from "@/components/blocks/tool-sprite"
import { TrustChapter } from "@/components/blocks/trust-chapter"
import { TrustStrip } from "@/components/blocks/trust-strip"
import { WhatWeAutomate } from "@/components/blocks/what-we-automate"
import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"

/*
  Watch one run, see what it covers, understand how it works, feel the cost,
  price it yourself, see the path, compare, trust, act.

  Results and testimonials are absent on purpose: both are marked [CLIENT]
  and get deleted rather than filled with invented case studies or quotes.
*/
export default function Page() {
  return (
    <>
      <ToolSprite />
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <AutomationStage />
        <WhatWeAutomate />
        <CapabilityGrid />
        <TheWork />
        <TimeCalculator />
        <TheBuild />
        <Integrations />
        <TheChoice />
        <DataSovereignty />
        <TrustChapter />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
