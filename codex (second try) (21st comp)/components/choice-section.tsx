import { Reveal } from "@/components/reveal";

const options = [
  ["Hire another person", "A salary absorbs the volume for a year. The work still exists, it is just someone else's day now.", "Recurring, forever"],
  ["Buy another tool", "Off the shelf software fits its own process, not yours. Your team adapts to it, and the gaps stay manual.", "A subscription, plus a migration"],
  ["Build the system", "Built once, inside what you already own. It runs every day after that at no additional cost.", "One project, then it is yours"],
] as const;

export function ChoiceSection() {
  return (
    <section className="section section-soft choice-section" id="choice">
      <div className="container">
        <Reveal className="section-intro"><h2>Three ways to solve this.<br />One of them ends.</h2></Reveal>
        <div className="choice-grid">
          {options.map(([title, text, cost], index) => (
            <article className={index === 2 ? "is-promoted" : ""} key={title}>
              {index === 2 && <span className="choice-tag">What we do</span>}
              <h3>{title}</h3>
              <p>{text}</p>
              <strong>{cost}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
