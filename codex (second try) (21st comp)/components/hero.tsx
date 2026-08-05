import { FlowCanvas } from "@/components/flow-canvas";
import { LeadDialog } from "@/components/lead-dialog";
import { PrimaryButton } from "@/components/primary-button";

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1><span>We build the automations</span><span>your business runs on.</span></h1>
          <p>Your tools, your data, your process. We connect them so the work your team repeats every day happens without anyone doing it.</p>
          <div className="hero-actions">
            <LeadDialog><PrimaryButton>Start your first automation</PrimaryButton></LeadDialog>
            <a className="button button-secondary" href="#automation">Watch one run</a>
          </div>
        </div>
        <div className="hero-canvas">
          <FlowCanvas compact />
        </div>
      </div>
    </section>
  );
}
