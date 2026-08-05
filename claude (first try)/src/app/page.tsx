import { AutomationStage } from "@/components/blocks/automation-stage"
import { CapabilityGrid } from "@/components/blocks/capability-grid"
import { ClosingCta } from "@/components/blocks/closing-cta"
import { ConversationDemo } from "@/components/blocks/conversation-demo"
import { DataSovereignty } from "@/components/blocks/data-sovereignty"
import { DepartmentSelector } from "@/components/blocks/department-selector"
import { Faq } from "@/components/blocks/faq"
import { Hero } from "@/components/blocks/hero"
import { IntegrationMarquee } from "@/components/blocks/integration-marquee"
import { TheBuild } from "@/components/blocks/the-build"
import { TheChoice } from "@/components/blocks/the-choice"
import { TheWork } from "@/components/blocks/the-work"
import { TimeCalculator } from "@/components/blocks/time-calculator"
import { ToolSprite } from "@/components/blocks/tool-sprite"
import { TrustChapter } from "@/components/blocks/trust-chapter"
import { TrustStrip } from "@/components/blocks/trust-strip"
import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"

/*
  See it, feel the cost, understand it, price it yourself, see the path,
  choose, de-risk, act.

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
        <ConversationDemo />
        <DepartmentSelector />
        <TheWork />
        <CapabilityGrid />
        <TimeCalculator />
        <TheBuild />
        <IntegrationMarquee />
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
