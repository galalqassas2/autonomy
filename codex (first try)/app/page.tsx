import { AutomationCanvas } from "@/components/automation-canvas";
import { BrandMark } from "@/components/brand-mark";
import { ChapterRail } from "@/components/chapter-rail";
import {
  DeferredBuildProgress,
  DeferredConstellation,
  DeferredFAQ,
  DeferredJobPicker,
  DeferredKineticGrid,
  DeferredTimeCalculator,
} from "@/components/dynamic-widgets";
import { FeatureIcon } from "@/components/feature-icon";
import { Header } from "@/components/header";
import { LeadButton, LeadProvider } from "@/components/lead-dialog";
import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const trustItems = [
  { icon: "plugs-connected-duotone", title: "1,000+ tools connected", copy: "If it has an API, we automate it" },
  { icon: "shield-lock-duotone", title: "Our own AI, never trained on your data", copy: "Your records never leave your workspace to teach a model" },
  { icon: "globe-hemisphere-west-duotone", title: "Hosted in Ireland", copy: "Processed and stored inside the EU, under GDPR" },
];

const costs = [
  { icon: "clock-countdown-duotone", title: "Time", copy: "The same information is typed into three systems, every day." },
  { icon: "coins-duotone", title: "Cost", copy: "Skilled people spend their week on work a system should do for free." },
  { icon: "warning-octagon-duotone", title: "Quality", copy: "Every manual handoff can go wrong, and weeks pass before anyone notices." },
  { icon: "envelope-open-duotone", title: "Communication", copy: "Where things stand lives in an inbox instead of in the system." },
];

const alternatives = [
  { title: "Hire another person", copy: "A salary absorbs the volume for a year. The work still exists, it is just someone else's day now.", cost: "Recurring, forever" },
  { title: "Buy another tool", copy: "Off the shelf software fits its own process, not yours. Your team adapts to it, and the gaps stay manual.", cost: "A subscription, plus a migration" },
  { title: "Build the system", copy: "Built once, inside what you already own. It runs every day after that at no additional cost.", cost: "One project, then it is yours", promoted: true },
];

const promises = [
  ["Your data never trains a model", "We run our own AI. Your messages, documents and records are never used to train a model, ours or anyone else's."],
  ["Everything runs in Ireland", "Your data is processed and stored on servers in Ireland, inside the EU, under GDPR. It does not leave."],
  ["You own what we build", "The workflows, the accounts, the credentials and the documentation. Any developer can pick it up."],
  ["Access is scoped", "Each automation gets only the permissions it needs, and loses them the day it does not."],
] as const;

const reachStats = [
  ["1,000+", "Tools connected"],
  ["5", "Step families"],
  ["8", "Messaging channels"],
  ["Any", "REST or webhook endpoint"],
] as const;

const securityStats = [
  ["Ireland", "Where your data lives"],
  ["Our own AI", "No third-party model sees it"],
  ["Encrypted", "At rest and in transit"],
  ["Yours", "Export or delete at any time"],
] as const;

const footerColumns = [
  { title: "Explore", links: [["Watch it run", "#watch"], ["Your time", "#time"]] },
  { title: "How we work", links: [["The work", "#work"], ["What we connect", "#reach"]] },
  { title: "Trust", links: [["Your data", "#trust"], ["Frequently asked", "#faq"]] },
] as const;

export default function Home() {
  return (
    <LeadProvider>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">
        <section id="top" className="flex min-h-[100dvh] items-center overflow-hidden border-b border-hairline bg-white pb-12 pt-24">
          <div className="shell grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-[72px]">
            <div className="relative z-[1] max-w-[640px]">
              <Reveal>
                <p className="kicker">Automation studio</p>
                <h1 className="display">We build the automations your business runs on.</h1>
                <p className="mt-6 max-w-[58ch] text-lg leading-8 text-body">Your tools, your data, your process. We connect them so the work your team repeats every day happens without anyone doing it.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <LeadButton size="lg">Start your first automation</LeadButton>
                  <Button asChild variant="secondary" size="lg"><a href="#watch">Watch one run <Icon name="arrow-down" size={17} aria-hidden /></a></Button>
                </div>
              </Reveal>
            </div>
            <div className="relative min-w-0 lg:translate-y-4 lg:translate-x-2">
              <div className="absolute -left-6 -top-6 size-20 rounded-[20px] border border-hairline bg-surface" aria-hidden="true" />
              <AutomationCanvas compact title="New order handling" />
              <p className="sr-only">A live workflow receives an order, checks stock, writes an invoice, and notifies the team.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-hairline bg-surface">
          <div className="shell grid gap-0 md:grid-cols-3 md:divide-x md:divide-hairline">
            {trustItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08} className="flex items-start gap-4 border-b border-hairline py-6 last:border-b-0 md:border-b-0 md:px-6 md:first:pl-0 md:last:pr-0">
                <FeatureIcon name={item.icon} />
                <div><h2 className="text-[0.95rem] font-semibold leading-6 text-ink">{item.title}</h2><p className="mt-1 text-sm leading-5 text-muted">{item.copy}</p></div>
              </Reveal>
            ))}
          </div>
        </section>

        <ChapterRail />
        <ScrollStage />

        <section id="work" className="section-pad border-b border-hairline bg-surface">
          <div className="shell">
            <SectionHeading
              eyebrow="The work"
              title="Manual work is never free. It is billed somewhere else."
              copy="Four costs your team pays every week, none of which appear on an invoice."
            />
            <div className="mt-12 grid overflow-hidden rounded-[20px] border border-hairline bg-white sm:grid-cols-2">
              {costs.map((cost, index) => (
                <Reveal key={cost.title} delay={index * 0.07} className={`flex min-h-[220px] flex-col items-start p-7 sm:p-8 ${index < 3 ? "border-b border-hairline" : ""} ${index === 2 ? "sm:border-b-0" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-hairline" : ""}`}>
                  <FeatureIcon name={cost.icon} />
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.025em] text-ink">{cost.title}</h3>
                  <p className="mt-3 max-w-[38ch] text-base leading-7 text-body">{cost.copy}</p>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 max-w-[62ch] text-lg font-medium leading-8 text-ink">These never get fixed because they never get measured. That is where we start.</p>
          </div>
        </section>

        <section id="time" className="section-pad border-b border-hairline bg-white">
          <div className="shell">
            <SectionHeading
              eyebrow="Your time"
              title="You are not buying software. You are buying back hours."
              copy="Put in your own numbers. The answer below is yours, we did not choose it."
            />
            <Reveal delay={0.08}><DeferredTimeCalculator /></Reveal>
          </div>
        </section>

        <section className="section-pad border-b border-hairline bg-surface">
          <div className="shell">
            <SectionHeading
              eyebrow="The range"
              title="Pick something your team does every day."
              copy="Choose a job. Watch it handled without anyone touching it."
            />
            <DeferredJobPicker />
          </div>
        </section>

        <section className="section-pad border-b border-hairline bg-white">
          <div className="shell">
            <SectionHeading eyebrow="The build" title="Four steps. You are only needed for the first." />
            <DeferredBuildProgress />
            <p className="mt-12 max-w-[70ch] text-lg font-medium leading-8 text-ink">You keep working the way you work. Nothing gets migrated, nothing gets replaced.</p>
          </div>
        </section>

        <section id="reach" className="section-pad border-b border-hairline bg-surface">
          <div className="shell">
            <SectionHeading
              eyebrow="The reach"
              title="We build on what you already run."
              copy="Over a thousand tools connect out of the box. If it has an API, it can be automated."
            />
            <DeferredConstellation />
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-hairline bg-hairline lg:grid-cols-4">
              {reachStats.map(([value, label]) => (
                <div key={label} className="bg-white p-5 sm:p-6"><strong className="block text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">{value}</strong><span className="mt-1 block text-sm text-muted">{label}</span></div>
              ))}
            </div>
            <p className="mt-7 text-base font-medium text-ink">Do not see yours? Send it to us. Most new connections take under two weeks.</p>
          </div>
        </section>

        <section className="section-pad border-b border-hairline bg-white">
          <div className="shell">
            <SectionHeading eyebrow="The choice" title="Three ways to solve this. One of them ends." />
            <div className="mt-12 grid overflow-hidden rounded-[20px] border border-hairline bg-hairline lg:grid-cols-3 lg:gap-px">
              {alternatives.map((item) => (
                <div key={item.title} className={`relative flex min-h-[360px] flex-col bg-white p-7 sm:p-9 ${item.promoted ? "shadow-[inset_0_3px_0_var(--brand)]" : ""}`}>
                  {item.promoted && <span className="mb-8 w-fit rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand-strong">What we do</span>}
                  <h3 className="text-2xl font-semibold tracking-[-0.035em] text-ink">{item.title}</h3>
                  <p className="mt-5 text-base leading-7 text-body">{item.copy}</p>
                  <div className="mt-auto border-t border-hairline pt-6"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Cost</span><strong className="mt-2 block text-base font-semibold text-ink">{item.cost}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="relative overflow-hidden bg-ink text-white">
          <DeferredKineticGrid globalColor="monochrome" className="absolute inset-0 min-h-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(12,21,18,0.18)_52%,rgba(12,21,18,0.76)_100%)]" aria-hidden="true" />
          <div className="shell section-pad relative z-[1]">
            <Reveal className="section-heading">
              <div className="mb-4 flex items-center justify-between gap-6">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-[#8fd8bd]">Your data</p>
                <span className="hidden items-center gap-2 text-xs font-medium text-[#9fb0a9] md:flex" aria-hidden="true">
                  <Icon name="cursor-click" size={16} aria-hidden /> Move across the grid. Click to trace a ripple.
                </span>
              </div>
              <h2 className="section-title text-white">Four things we put in writing.</h2>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
              {securityStats.map(([value, label]) => (
                <div key={label} className="bg-ink/85 p-6 backdrop-blur-[2px]"><strong className="block text-xl font-semibold tracking-[-0.02em] text-white">{value}</strong><span className="mt-2 block text-sm leading-5 text-[#9fb0a9]">{label}</span></div>
              ))}
            </div>
            <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {promises.map(([title, copy]) => <div key={title} className="border-t border-white/16 pt-6"><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-3 max-w-[55ch] text-base leading-7 text-[#b7c4bf]">{copy}</p></div>)}
            </div>
            <p className="mt-14 text-xl font-medium text-[#9fb0a9]">If you ever stop working with us, everything keeps running.</p>
          </div>
        </section>

        <section id="faq" className="section-pad bg-white">
          <div className="shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <SectionHeading eyebrow="Questions" title="What teams ask before they start." />
            <DeferredFAQ />
          </div>
          <div className="shell mt-24">
            <Reveal className="rounded-[20px] border border-brand/10 bg-brand-tint px-6 py-16 text-center sm:px-12 sm:py-20">
              <p className="kicker">Start here</p>
              <h2 className="mx-auto max-w-[760px] text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">Tell us one process. We will show you what it costs you.</h2>
              <p className="mx-auto mt-6 max-w-[60ch] text-base leading-7 text-body">Describe something your team repeats. We come back with a map of it, a number attached, and what it would take to remove it.</p>
              <LeadButton size="lg" className="mt-8">Start your first automation</LeadButton>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-surface py-12">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div><div className="flex items-center gap-3"><BrandMark /><strong className="font-semibold text-ink">Autonomy</strong></div><p className="mt-4 max-w-[36ch] text-sm leading-6 text-body">We build secure automations inside the tools your team already owns.</p></div>
            {footerColumns.map((column) => <FooterLinks key={column.title} {...column} />)}
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Copyright Autonomy</span>
            <span className="flex items-center gap-2 font-medium text-body"><span className="size-2 rounded-full bg-brand" /> All systems normal</span>
          </div>
        </div>
      </footer>
    </LeadProvider>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <Reveal className="section-heading">
      <p className="kicker">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </Reveal>
  );
}

function FooterLinks({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return <div><h2 className="text-sm font-semibold text-ink">{title}</h2><div className="mt-4 flex flex-col gap-3">{links.map(([label, href]) => <a key={label} href={href} className="w-fit text-sm text-muted transition-colors hover:text-ink">{label}</a>)}</div></div>;
}
