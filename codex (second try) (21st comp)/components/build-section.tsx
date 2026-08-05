import { FeatureIcon } from "@/components/feature-icon";
import { Reveal } from "@/components/reveal";

const steps = [
  ["01", "Map", "We sit with the people doing the work and draw the process as it really runs.", "1 hour"],
  ["02", "Scope", "We pick the smallest change with the largest return and agree the number we are judged on.", "1 week"],
  ["03", "Build", "We build inside your existing tools and test it on sample data before it touches anything live.", "2 to 6 weeks"],
  ["04", "Run", "We watch it, fix what breaks, and report what it saved you.", "Ongoing"],
] as const;

export function BuildSection() {
  return (
    <section className="section build-section" id="build">
      <div className="container">
        <Reveal className="section-intro"><h2>Four steps.<br />You are only needed for the first.</h2></Reveal>
        <div className="build-grid">
          {steps.map(([number, title, text, timing], index) => (
            <Reveal className="build-step" delay={index * 0.08} key={title}>
              <div className="build-step-head"><FeatureIcon index={index + 13} /><span>{number}</span></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <small>{timing}</small>
            </Reveal>
          ))}
        </div>
        <p className="section-closing">You keep working the way you work. Nothing gets migrated, nothing gets replaced.</p>
      </div>
    </section>
  );
}
