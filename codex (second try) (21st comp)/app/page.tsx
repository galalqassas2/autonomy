import { AutomationStageLoader } from "@/components/automation-stage-loader";
import { BuildSection } from "@/components/build-section";
import { ChoiceSection } from "@/components/choice-section";
import { ClosingFooter } from "@/components/closing-footer";
import { DepartmentSelectorLoader, FAQLoader, IntegrationMarqueeLoader, TimeCalculatorLoader } from "@/components/deferred-sections";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { TrustSection } from "@/components/trust-section";
import { TrustStrip } from "@/components/trust-strip";
import { WorkSection } from "@/components/work-section";

export default function Home() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <AutomationStageLoader />
        <DepartmentSelectorLoader />
        <WorkSection />
        <TimeCalculatorLoader />
        <BuildSection />
        <IntegrationMarqueeLoader />
        <ChoiceSection />
        <TrustSection />
        <FAQLoader />
        <ClosingFooter />
      </main>
    </div>
  );
}
