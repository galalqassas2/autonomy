import { KeyIcon } from "@phosphor-icons/react/dist/ssr";

import { FeatureIcon } from "@/components/feature-icon";
import { HoverButton } from "@/components/hover-button";
import { LeadDialog } from "@/components/lead-dialog";

const tiles = [
  ["Ireland", "Where your data lives"],
  ["Our own AI", "No third party model sees it"],
  ["Encrypted", "At rest and in transit"],
  ["Yours", "Export or delete at any time"],
] as const;

const promises = [
  ["Your data never trains a model", "We run our own AI. Your messages, documents and records are never used to train a model, ours or anyone else's."],
  ["Everything runs in Ireland", "Your data is processed and stored on servers in Ireland, inside the EU, under GDPR. It does not leave."],
  ["You own what we build", "The workflows, the accounts, the credentials and the documentation. Any developer can pick it up."],
  ["Access is scoped", "Each automation gets only the permissions it needs, and loses them the day it does not."],
] as const;

export function TrustSection() {
  return (
    <section className="section trust-section" id="data">
      <div className="container">
        <h2>Four things we put in writing.</h2>
        <div className="trust-tile-grid">
          {tiles.map(([title, text], index) => (
            <article key={title}>
              {index < 3 ? <FeatureIcon index={index + 17} /> : <span className="trust-key"><KeyIcon aria-hidden="true" /></span>}
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
        <div className="promise-grid">
          {promises.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <div className="trust-closing">
          <p>If you ever stop working with us, everything keeps running.</p>
          <LeadDialog><HoverButton>Start your first automation</HoverButton></LeadDialog>
        </div>
      </div>
    </section>
  );
}
