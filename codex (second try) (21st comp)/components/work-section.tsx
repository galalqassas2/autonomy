import { FeatureIcon } from "@/components/feature-icon";
import { Reveal } from "@/components/reveal";

const costs = [
  ["Time", "The same information is typed into three systems, every day."],
  ["Cost", "Skilled people spend their week on work a system should do for free."],
  ["Quality", "Every manual handoff can go wrong, and weeks pass before anyone notices."],
  ["Communication", "Where things stand lives in an inbox instead of in the system."],
] as const;

export function WorkSection() {
  return (
    <section className="section work-section" id="work">
      <div className="container">
        <Reveal className="section-intro">
          <h2>Manual work is never free.<br />It is billed somewhere else.</h2>
          <p>Four costs your team pays every week, none of which appear on an invoice.</p>
        </Reveal>
        <div className="work-grid">
          {costs.map(([title, text], index) => (
            <Reveal className="work-card" delay={index * 0.08} key={title}>
              <FeatureIcon index={index + 9} />
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        <p className="section-closing">These never get fixed because they never get measured. That is where we start.</p>
      </div>
    </section>
  );
}
