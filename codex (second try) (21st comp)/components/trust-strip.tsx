import { FeatureIcon } from "@/components/feature-icon";

const items = [
  ["1,000+ tools connected", "If it has an API, we automate it"],
  ["Our own AI, never trained on your data", "Your records never leave your workspace to teach a model"],
  ["Hosted in Ireland", "Processed and stored inside the EU, under GDPR"],
] as const;

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="What you can rely on">
      <div className="container trust-strip-grid">
        {items.map(([title, text], index) => (
          <article key={title}>
            <FeatureIcon index={index + 1} />
            <div><h2>{title}</h2><p>{text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
