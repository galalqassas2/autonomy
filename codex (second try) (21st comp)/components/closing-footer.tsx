import { LeadForm } from "@/components/lead-form";

const footerGroups = [
  ["See it", [["Watch it run", "#automation"], ["Departments", "#departments"]]],
  ["Understand it", [["The work", "#work"], ["Your time", "#time"]]],
  ["Build it", [["The build", "#build"], ["What we connect", "#integrations"]]],
  ["Trust it", [["Your data", "#data"], ["Questions", "#faq"]]],
] as const;

export function ClosingFooter() {
  return (
    <>
      <section className="section closing-section" id="contact">
        <div className="container closing-grid">
          <div>
            <h2>Small enough to start Monday.<br />Big enough to never do it again.</h2>
            <p>Tell us one process your team repeats. We come back with a map of it, a number attached, and what it would take to remove it.</p>
          </div>
          <LeadForm idPrefix="closing" />
        </div>
      </section>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <a className="footer-brand" href="#top">Autonomy</a>
            {footerGroups.map(([title, links]) => (
              <nav aria-label={title} key={title}><h2>{title}</h2>{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav>
            ))}
          </div>
          <div className="footer-legal"><span>Autonomy. All rights reserved.</span><span className="system-status"><i aria-hidden="true" />all systems normal</span></div>
        </div>
      </footer>
    </>
  );
}
