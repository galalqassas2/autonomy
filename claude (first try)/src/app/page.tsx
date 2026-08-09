import { AutomationStage } from "@/components/blocks/automation-stage"
import { ClosingCta } from "@/components/blocks/closing-cta"
import { CostOfRepetition } from "@/components/blocks/cost-of-repetition"
import { Faq } from "@/components/blocks/faq"
import { Hero } from "@/components/blocks/hero"
import { TheJudgment } from "@/components/blocks/the-judgment"
import { ToolSprite } from "@/components/blocks/tool-sprite"
import { TrustStrip } from "@/components/blocks/trust-strip"
import { WhatWeAutomate } from "@/components/blocks/what-we-automate"
import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"

export default function Page() {
  return (
    <>
      <ToolSprite />
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <CostOfRepetition />
        <AutomationStage />
        <WhatWeAutomate />
        <TheJudgment />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
