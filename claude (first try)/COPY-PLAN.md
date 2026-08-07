# Autonomy — full copy rewrite plan

Status: **proposal, awaiting approval. No site files changed.**
Scope: every user-visible string on the page, plus the page structure needed to make the copy short.

---

## 0. Decisions locked with you

| Decision | Answer | What it means for the copy |
|---|---|---|
| What we sell | **Done-for-you service** | Copy says "we build", never "you build". No product tour, no builder screenshots, no signup language. |
| Rewrite scope | **Consolidate** | I merge the duplicated sections rather than only rewording them. Structural changes listed in §2. |
| Provable today | 1,000+ tools connected · 2–6 weeks to first automation | Both become load-bearing proof points. |
| Hosting, corrected | **Automation server in Ireland. AI server is not in Ireland — EU may be claimed.** | Every "our AI, hosted in Ireland" line is factually wrong today and gets rewritten. See §6.1. |
| Department stats | **Not confirmed** | `4x`, `90%`, `0 missed reorders`, `24/7`, `6` are all deleted. |
| Voice | **Plain and direct** | Short declaratives. One idea per sentence. Contractions where they shorten the line. |

---

## 1. What is wrong with the text today

**1. The hero never says what you do.**
"Your team stops doing the work. The work still gets done." is a riddle. Nothing in the first screen names the category. A visitor cannot tell whether Autonomy is software, an agency, or a staffing service. The word "automation" appears only inside a button.

**2. Four sections do the same job.**
`AutomationStage` + `ConversationDemo` (10 jobs) + `DepartmentSelector` (5 tabs × 4 tasks) + `CapabilityGrid` (6 items) are all "here is what it can do" — 35+ example items, four headlines, four introductions. This is the single largest source of length.

It is also literally duplicated: `LedgerPanel` shows the same invoice run as the *Turn a won deal into an invoice* job card. `PipelinePanel` shows the same lead routing as *Route a new lead in seconds*. `ReconcilePanel` overlaps *Reorder before you run out*. The Support tab already just renders `CAPABILITIES[0]`.

**3. Trust is stated three times, and one section repeats itself.**
`TrustStrip` → `DataSovereignty` → `TrustChapter` → FAQ #3. Inside `TrustChapter`, the four bottom tiles repeat the three top pillars word for word ("Ireland / where your data lives" appears twice in the same section).

**4. Almost every H2 is the same rhetorical trick.**
Nine two-line antitheses in a row: *never free / billed somewhere else*, *not buying software / buying back hours*, *three ways / only one ends*, *small enough / big enough*, *goes to Ireland / then it comes back*. One is a voice. Nine means the reader decodes every heading instead of reading it — the opposite of "clear at first glance".

**5. Copy defines by negation before it defines at all.**
"It is not a chatbot and it is not a macro" arrives before the reader has been told what it *is*.

**6. Numbers on the page are not yours.**
`4x faster month-end close`, `90% less manual data entry`, `0 missed reorders last quarter` read as measured client results. Your own spec (`prompt_v1.md`, line 7) makes this the rule that overrides everything else.

**7. "Search 1,000+ tools" searches 58.**
`src/lib/tools.ts` holds 58 entries. Typing "invoice" or "Xero" returns nothing, directly beneath the claim of a thousand. See §6.2.

**8. No contractions anywhere.**
"It is", "That is", "we did not", "Do not see yours?" — this adds a beat to every sentence and reads as translated formal English rather than how anyone speaks.

---

## 2. New page structure

Fifteen blocks become thirteen, and the two heaviest merges remove roughly 40% of the words without losing a single capability.

| # | Block | Change | Section id |
|---|---|---|---|
| 0 | Header | Nav labels rewritten | — |
| 1 | Hero | Rewritten — now names the category | `#hero` |
| 2 | Trust strip | Rewritten to confirmed facts only | — |
| 3 | Watch it run | **Gains a headline** (it has none today) | `#watch-it-run` |
| 4 | What we automate | **MERGE** of `ConversationDemo` + `DepartmentSelector` | `#what-we-automate` |
| 5 | How an automation works | `CapabilityGrid`, descriptions halved | `#how-it-works` |
| 6 | What manual work costs | `TheWork`, trimmed | `#the-cost` |
| 7 | Your numbers | `TimeCalculator`, light edit | `#your-time` |
| 8 | How we build it | `TheBuild`, light edit | `#the-build` |
| 9 | 1,000+ tools | `IntegrationMarquee`, stats fixed | `#tools` |
| 10 | Build vs hire vs buy | `TheChoice`, light edit | `#the-choice` |
| 11 | Your data | **MERGE** of `DataSovereignty` + `TrustChapter` | `#your-data` |
| 12 | Questions | `Faq` + one new question, visible heading | `#faq` |
| 13 | Start | `ClosingCta`, headline replaced | `#start` |
| 14 | Footer | Hosting line corrected | — |

**Order change:** `CapabilityGrid` moves up to sit directly after the demo, so *cost of manual work* → *calculator* become adjacent. Today the problem statement (block 6) arrives after two solution blocks, which breaks the argument.

**Reading spine after the change:**
what we do → proof it runs → what it applies to → how it works → what it costs you now → what you'd get back → how we deliver → what we connect → why not hire or buy → your data → objections → start.

---

## 3. Voice rules for every string

1. One idea per sentence. If a sentence needs a comma to hold two clauses, it is usually two sentences.
2. Say the thing, then stop. No summarising line after a list that already made the point.
3. Contractions allowed: *you're, it's, doesn't, we'll, don't*. They save a syllable and sound spoken.
4. "We build" / "we run" / "we watch" — the service is a person, not a platform.
5. Never define by negation before defining.
6. One highlighted phrase per section, maximum. Highlights are listed in §5.
7. No number appears unless it is in §0.

---

## 4. Section-by-section copy

Format per section: **exact strings** → **why**.

---

### Block 0 — Header

**Nav labels** (`src/lib/nav.ts`)

| Now | New |
|---|---|
| Watch it run | Watch it run |
| Every channel | What we automate |
| The work | What it costs you |
| Your time | What you get back |
| What we connect | 1,000+ tools |
| Your data | Your data |

**CTA:** `Start your first automation` (desktop) · `Get started` (compact) — unchanged.

**Why**
- "Every channel", "The work", "Your time" tell a scanner nothing. The new labels each name a question the reader has.
- The CTA stays. It is already consistent across six placements and it names an outcome rather than a meeting.

---

### Block 1 — Hero

```
h1 line 1   We automate the work
h1 line 2   your team repeats every day.          ← highlighted

body        We build it inside the tools you already pay for. Any process,
            any department. Nothing to migrate, and nothing new for your
            team to learn.

cta         Start your first automation   ·   Watch one run
```

**Why**
- Line 1 names the category in the first four words. A visitor who reads nothing else knows you are an automation company that does the work for them.
- "the work your team repeats every day" is the recognisable pain, said in the reader's own words, and it carries the highlight.
- The body kills the three objections a 10–300 person business raises first, in order: *do I have to change tools* (no), *is my case covered* (any process, any department), *will my team have to learn something* (no).
- "We build it" establishes done-for-you in three words, which the current copy never does above the fold.
- Dropped: "Your tools. Your data. Your process." — three fragments that promise something the next sentence then explains anyway.

---

### Block 2 — Trust strip

| Icon | Headline | Sub |
|---|---|---|
| hub | 1,000+ tools connected | If it has an API, we can automate it |
| gauge | Live in 2 to 6 weeks | From first conversation to a working automation |
| pin | Hosted in Ireland | Your automations run in Ireland, inside the EU |

**Why**
- Three claims, all confirmed in §0. The old middle item ("Our own AI, never trained on your data") is unverified and is removed until §6.1 is resolved.
- Delivery speed is a stronger second proof point than a technical claim: it answers "how long am I waiting", which is the second question every buyer asks after price.
- Item 3 is now factually correct — it claims Ireland for the automation server only.

---

### Block 3 — Watch it run

This block has **no heading today**. The most valuable thing on the page is unlabelled, so a scanner sees an animation and does not know what they are being shown.

```
h2          One real automation.
            Start to finish in 1.2 seconds.          ← second line highlighted

body        An order lands in your store. Nobody touches anything after that.
```

**Stage captions** (4, crossfading with the run)

| # | Now | New |
|---|---|---|
| 1 | An order arrives from your store. | An order arrives from your store. |
| 2 | Stock is checked. Nobody asked it to. | Stock is checked automatically. |
| 3 | The invoice writes itself. | The invoice writes itself. |
| 4 | Your team is told. Elapsed: 1.2 seconds. | Your team is notified. Total: 1.2 seconds. |

**Run log** (unchanged, already tight): `Order received from your store` · `Stock checked, item available` · `Invoice created and sent` · `Operations notified`

**Closing line**

> That's one process. Most teams have a dozen. Yours probably starts with **[invoicing / onboarding / stock counts / order updates]**

**Why**
- The heading states what the block is *and* the payoff number in one line, so the animation is understood before it plays.
- Caption 2's "Nobody asked it to" is a joke that costs a beat to parse. "Automatically" says the same thing and the reader keeps moving.
- The closing line keeps the existing word-cycle: it is short, it personalises, and it is the natural bridge into block 4.

---

### Block 4 — What we automate  *(MERGE)*

**This is the biggest change.** `ConversationDemo` and `DepartmentSelector` become one section: department tabs filter the job list, the job list drives the stage. One heading, one control, one player.

```
h2          Pick a job your team does every day.
            Watch it handled.                        ← highlighted

body        Choose a team, then a job. Each one runs end to end
            in the tools you already use.
```

**Tabs:** `Finance` · `Sales` · `Operations` · `Support` · `HR` · `Management`

**One line per department** (replaces the current headline + 4 bullets + stat block):

| Tab | Line |
|---|---|
| Finance | Issue, chase and reconcile every invoice. |
| Sales | Every lead captured, enriched and routed in seconds. |
| Operations | Stock, orders and suppliers, always in agreement. |
| Support | Answer, triage and escalate across every channel. |
| HR | Onboard a new starter across six systems from one trigger. |
| Management | The numbers on your desk before you ask for them. |

**Job cards** (labels mostly survive — they are the best-written strings on the site)

| Tab | Label | Caption under the stage |
|---|---|---|
| Support | Answer a customer at 11pm | Answered in seconds, from live stock. |
| Support | Triage a support ticket | The urgent one surfaces first, not behind forty others. |
| Finance | Turn a won deal into an invoice | Invoiced the minute the deal closes, not the following Friday. |
| Finance | File every supplier invoice | No more keying in PDFs. Coded and filed before you open it. |
| Finance | Chase what you're owed | Polite, on time, every time. Nobody has to be the bad guy. |
| Sales | Route a new lead in seconds | You reply first. Everyone else is still checking the inbox. |
| Sales | Turn a call into CRM notes | Your pipeline is accurate without anyone writing it up. |
| Operations | Reorder before you run out | You stop selling what you can't ship. |
| Operations | Book a job without the back and forth | Six messages become one. The diary is never double booked. |
| HR | Onboard a new starter | Six systems, one trigger. The offer being signed. |
| Management | Send Monday's numbers | Every Monday at eight. No spreadsheet to build. |

**Deleted from this section**
- 20 department task bullets (the job cards already show them, with a working demo attached)
- All 5 department stats — `4x`, `90%`, `0`, `24/7`, `6`
- "Connected to 1,000+ tools. Runs inside the ones you already use." — block 9 makes this point with evidence
- "Ten of the thousand." — reads as a riddle; "thousand" here means tools, not jobs, which is a collision with block 9

**Why**
- One question, one answer. Today the reader is asked to pick a job, then two screens later asked to pick a department — the same question with different furniture.
- The demo widgets are stronger evidence than a bullet list, so the bullets go and the widgets stay.
- HR currently has no job card, only a panel. Adding *Onboard a new starter* (reusing `ChecklistPanel` as its widget) makes every tab consistent.
- Management becomes a tab because the founder reading this page is in it.

**Code implication:** `CAPABILITIES` in `src/lib/capabilities.ts` gains a `dept` field; `DepartmentSelector` keeps the tab strip and loses the headline/tasks/stat/panel; `ConversationDemo` becomes the panel body; `LedgerPanel`, `PipelinePanel`, `ReconcilePanel` are retired as duplicates; `ChecklistPanel` survives as the HR job widget.

---

### Block 5 — How an automation works

```
h2          Every automation we build
            does six things.                         ← "six things" highlighted

body        Combined in whatever order your process needs. Nothing here is
            a template you bend your business around.
```

| Title | Now (avg 22 words) | New (avg 12 words) |
|---|---|---|
| It notices | An order, an email, a form, a row changing in a sheet. The moment it happens, not the next morning. | An order, an email, a form, a new row — the moment it happens. |
| It decides | Your rules, written down once and applied the same way every time. No judgement calls at five on a Friday. | Your rules, written down once and applied the same way every time. |
| It reads and writes | Across every system you already pay for. The same record, correct in all of them, without anyone retyping it. | The same record, correct in every system, without anyone retyping it. |
| It reads language | Our own model, running in Ireland. It handles the messy sentences people actually write, and never learns from them. | It handles the messy sentences people actually write. |
| It acts | Issues the invoice, books the slot, updates the CRM, tells the supplier. Inside your tools, under your credentials. | Issues the invoice, books the slot, updates the CRM — inside your tools, under your credentials. |
| It reports | What ran, what it touched, and what it saved you. Every month, without you asking for it. | What ran, what it touched, and what it saved you. Every month. |

**Why**
- The old heading defined the product by what it is not, twice, before saying what it is. The new one answers the question directly.
- Six cards at 22 words each is 132 words of body text in a grid. At 12 it is scannable, which is what a grid is for.
- "It reads language" loses the hosting claim. Location belongs in block 11 where it is explained properly — and the current wording there is wrong (§6.1).

---

### Block 6 — What manual work costs

```
h2          Four costs you pay every week.
            None of them appear on an invoice.       ← second line highlighted
```

No sub-line. The old one ("Four costs your team pays every week, none of which appear on an invoice") is now the heading itself.

| Card | New |
|---|---|
| Time | The same information is typed into three systems, every day. |
| Cost | Skilled people spend their week on work a system should do for free. |
| Quality | Every manual handoff can go wrong. Weeks pass before anyone notices. |
| Communication | Where things stand lives in an inbox instead of in the system. |

**Closing line:** They never get fixed because they never get measured. That's where we start.

**Why**
- The old heading and the old sub-line said the same thing twice, in two registers. Merging them removes a full paragraph and sharpens the claim.
- The four card bodies are already among the best copy on the site. Only "Quality" changes, and only to split a run-on.
- The closing line is the hinge into the calculator, so it stays.

---

### Block 7 — Your numbers

```
h2          You're not buying software.
            You're buying back hours.                ← second line highlighted

body        Put in your own numbers. The answer is yours, not ours.
```

**Inputs:** `People doing this task` · `Times per day` · `Minutes each time` · `Average hourly cost` *(optional)*
**Results:** `hours per month` · `working days per year` · `cost per year`
**Footer:** These are your numbers, not ours. We'll check them with you in the first hour.

**Why**
- This is the one antithesis heading that earns itself — it reframes the purchase, which is exactly what a heading above a calculator should do. It keeps its shape and gains contractions.
- The sub drops "we did not choose it", which restates "yours" in six extra words.

---

### Block 8 — How we build it

```
h2          Four steps.
            You're only needed for the first.        ← second line highlighted
```

| # | Step | Copy | Timing |
|---|---|---|---|
| 01 | Map | We sit with the people doing the work and draw the process as it really runs. | 1 hour |
| 02 | Scope | We pick the smallest change with the largest return, and agree the number we're judged on. | 1 week |
| 03 | Build | We build inside your existing tools and test on sample data before it touches anything live. | 2 to 6 weeks |
| 04 | Run | We watch it, fix what breaks, and report what it saved you. | Ongoing |

**Closing line:** You keep working the way you work. Nothing gets replaced.

**Why**
- This section is already the clearest on the site. Edits are commas and contractions only.
- The closing loses "nothing gets migrated" because the hero now carries it. Repeating it here would be the fourth time the page reassures about migration.

---

### Block 9 — 1,000+ tools

```
h2          We connect to 1,000+ tools                ← "1,000+ tools" highlighted
            you already pay for.

body        Pre-built connectors for the apps you use.
            A custom connection for everything else.
```

**Stats row**

| Now | New | Reason |
|---|---|---|
| 1,000+ · tools connected | 1,000+ · tools connected | Confirmed |
| 5 · step families: triggers, logic, data, AI, actions | 8 · messaging channels | The old one is internal jargon on a page written for a non-technical buyer |
| 8 · messaging channels | Any · REST or webhook endpoint | — |
| Any · REST or webhook endpoint | 0 · tools you have to replace | Provable from your own model, and it is the objection this page exists to kill |

**Search placeholder:** `Search 1,000+ tools` → **`Search connected tools`** (see §6.2 — this is a correctness fix, not a style one)

**Link + note:**
`Browse every integration →` · Don't see yours? Tell us. *(delivery promise pending §6.4)*

**Why**
- "Plug your automations into…" asks the reader to do the plugging. In a done-for-you service, you do it. "We connect to" restates the same fact with the right subject.
- "0 tools you have to replace" is the strongest true number available to you and it belongs in the row where a buyer is deciding whether this fits their stack.

---

### Block 10 — Build vs hire vs buy

```
h2          Three ways to fix this.
            Only one of them ends.                   ← second line highlighted

body        Two of them you pay for again next year. Turn a card
            to see what each one really costs.
```

| Card | Cost line | Face copy | Back points |
|---|---|---|---|
| Hire another person | Recurring, forever | A salary absorbs the volume for a year. The work still exists — it's just someone else's day now. | The cost repeats every year · Holiday, illness and notice periods · They leave, and the process leaves with them |
| Buy another tool | A subscription, plus a migration | Off-the-shelf software fits its own process, not yours. Your team adapts to it, and the gaps stay manual. | Your process bends to fit the product · A migration before anything improves · The awkward 20% stays manual |
| Build the system *(What we do)* | One project, then it's yours | Built once, inside what you already own. It runs every day after that at no extra cost. | Runs on the tools your team already knows · Yours entirely, in your own accounts · The cost stops, the saving doesn't |

**Why**
- Strong section already; the argument is sound and the flip interaction earns the copy. Edits are contractions and one comma.

---

### Block 11 — Your data  *(MERGE)*

`DataSovereignty` and `TrustChapter` become one section. **All hosting copy is corrected per §0.**

```
h2          Your automations run in Ireland.
            Your data stays in the EU.               ← second line highlighted

body        It leaves your systems, it does the work, it comes back.
            That's the whole journey.
```

**The three hops** (keeps the drawn-loop graphic)

| Hop | Note |
|---|---|
| Your systems | Where the record already lives |
| Autonomy, in Ireland | Runs the steps, reads only what it needs |
| Back to your systems | Written, logged, done |

**Four facts**

| Fact | Line |
|---|---|
| Ireland | Where your automations run and your data is stored |
| EU only | AI processing stays inside the EU |
| Scoped access | Only what the automation needs, only while it needs it |
| Yours | Export or delete at any time |

**Four promises**

| Promise | Body |
|---|---|
| Everything runs in Ireland | Your automations are built and run on servers in Ireland, inside the EU, under GDPR. |
| AI processing stays in the EU | When an automation needs to read language, that happens inside the EU. Your data does not leave it. |
| You own what we build | The workflows, the accounts, the credentials and the documentation. Any developer can pick it up. |
| Access is scoped | Each automation gets only the permissions it needs, and loses them the day it doesn't. |

**Closing line:** If you ever stop working with us, everything keeps running.

**Deleted**
- The three-pillar row at the top of `TrustChapter` — the four facts replace it
- The four tiles at the bottom of `TrustChapter` — they repeat those same pillars verbatim
- Every instance of "our own AI", "never trained on your data", "no third party model sees it" — pending §6.1

**Why**
- Three trust sections become one, and the one that remains says something true.
- "Your data goes to Ireland. Then it comes back." was memorable but now inaccurate for the AI hop. The new heading splits the two claims so each is exactly right.
- The closing line is the best sentence on the site. It stays untouched.

---

### Block 12 — Questions

**Heading, currently `sr-only`, becomes visible:** `Questions we get asked.`

| # | Question | Answer |
|---|---|---|
| 1 | **What can you actually automate?** *(new)* | Any process that follows rules and touches software. If your team does it the same way twice, we can build it. |
| 2 | What does a project cost? | Most first projects land in a range we put in writing after we map the process. Ongoing support is a flat monthly fee, agreed up front. No hourly billing. |
| 3 | How long until something is running? | Two to six weeks for a first automation, depending on how many systems it touches. You see it working on sample data before it goes near anything live. |
| 4 | Where does our data go? | Onto servers in Ireland, inside the EU. Where an automation needs AI, that processing stays inside the EU too. |
| 5 | Do we have to change our current systems? | No, and that's the point. We build around the tools your team already knows. |
| 6 | What happens when something breaks? | We monitor everything we build. You get an alert and a fix from us, usually before your team notices. |
| 7 | Who owns the work? | You do, entirely. It's built in your accounts under your credentials, and it stays yours whatever happens between us. |

**Why**
- Q1 is new and it is the question your whole positioning rests on — "we can automate anything" is currently never stated in plain words anywhere on the page.
- Q1 goes first because it is the widest, and because it opens by default.
- A hidden heading means the FAQ has no visible entry point when scanning. It gets one.
- Q4 is corrected for hosting.

---

### Block 13 — Start

```
h2          Tell us one process.
            We'll show you what it costs you.        ← second line highlighted

body        Describe something your team repeats. We come back with a map
            of it, the hours it's costing you, and what it would take to remove.
```

**Fields:** `What process` (*The one your team repeats every week*) · `Which tools` (*The systems it touches today*) · `How to reach you` (*Email or phone*)
**Button:** `Start your first automation`
**Sent state:** `That's with us.` / We read every one. You'll hear back with a map of the process and a number attached.

**Why**
- "Small enough to start Monday. Big enough to never do it again." is the ninth antithesis on the page and it describes the *project*, not what the reader gets for filling in the form.
- The new heading states the exchange: you give one process, you get a costed map. That is the highest-converting thing on the page and it was buried in the body text.
- The body now names three deliverables, so "what happens after I submit" is answered before the click.

---

### Block 14 — Footer

| String | Now | New |
|---|---|---|
| Tagline | We build the automations your business runs on. Our own AI, hosted in Ireland. | We build the automations your business runs on. Hosted in Ireland, processed in the EU. |
| Legal line | Autonomy. Processed and stored in Ireland. | Autonomy. Hosted in Ireland, processed inside the EU. |
| Column 1 heading | What it does | What we automate |
| Column 3 heading | What we connect | Tools |
| Status | all systems normal | all systems normal *(unchanged)* |

---

### Page metadata (`src/app/layout.tsx`)

```
title        Autonomy — we build automations for your business
description  We automate the work your team repeats every day, inside the tools
             you already pay for. 1,000+ tools connected. Live in 2 to 6 weeks.
             Hosted in Ireland.
```

**Why:** the current description repeats the hero verbatim and ends on a claim that is no longer accurate. The new one leads with the category and closes on the two confirmed proof points.

---

## 5. Highlight map

Green glow (`glow-text text-primary`) is meaning, not decoration — it marks the phrase carrying the promise. Six on the page, one per major beat, none within two sections of another.

| Block | Highlighted phrase |
|---|---|
| 1 Hero | *your team repeats every day.* |
| 3 Watch it run | *Start to finish in 1.2 seconds.* |
| 4 What we automate | *Watch it handled.* |
| 9 Tools | *1,000+ tools* |
| 11 Your data | *Your data stays in the EU.* |
| 13 Start | *We'll show you what it costs you.* |

Blocks 5, 6, 7, 8, 10 and 12 carry no highlight. Today five consecutive sections each highlight their second line, which turns the accent into wallpaper and stops it meaning anything.

---

## 6. Blanks and blockers

These need your answer or a code fix before the copy can ship. Ranked by risk.

### 6.1 The "our own AI" claim — partly resolved

**Resolved:** hosting is now stated correctly everywhere. Automations run in
Ireland, AI processing stays inside the EU. Every "our own AI, hosted in
Ireland" line has been rewritten or removed.

**Still open:** whether the model is yours. The claim is out of the copy until
confirmed. The original finding follows.

Six strings assert it today:

| File | String |
|---|---|
| `trust-strip.tsx` | Our own AI, never trained on your data |
| `capability-grid.tsx` | Our own model, running in Ireland… never learns from them |
| `data-sovereignty.tsx` | Our AI, in Ireland · Our own model / No third party ever sees the data · Never trained on |
| `trust-chapter.tsx` | We run our own AI. Your messages, documents and records are never used to train a model |
| `faq.tsx` | We run our own AI, so nothing is passed to a third party model |
| `footer.tsx` | Our own AI, hosted in Ireland |

Two problems:
1. **The location is now wrong** by your own correction. Every one of these is rewritten above.
2. **"No third party model sees the data" appears to contradict the site itself.** `src/lib/capabilities.ts` renders the **Anthropic** logo inside four job demos (*File every supplier invoice*, *Route a new lead*, *Turn a call into CRM notes*, *Triage a support ticket*). A visitor sees "no third party model sees it" and a third-party model logo in the same scroll.

**I need one of:**
- (a) You run your own model → tell me where it is hosted and I restore a corrected version of the claim.
- (b) You use a third-party model inside the EU with a no-training agreement → I write *"Processed inside the EU under a no-training agreement"*, which is honest and still sells.
- (c) Unresolved → the claim stays out and the Anthropic logos stay in. The plan above assumes this.

### 6.2 "Search 1,000+ tools" returns nothing — blocking

`src/lib/tools.ts` holds **58** tools. The search over it is a live promise the page cannot keep, sitting under the words "1,000+".

**Two fixes, do both:**
1. Copy: placeholder becomes `Search connected tools`, and the empty state gains — *"Not in the list? We connect it. Most take under two weeks."*
2. Data: expand the index to 250–400 **names** (no SVG needed for search hits — `MarqueeRows` only needs `name` and `slug`; unmatched slugs can fall back to a lettermark). The marquee keeps showing the 58 with real logos.

Until (2) lands, the copy fix alone stops the page from visibly failing.

### 6.3 "Browse every integration" is a dead end

The link in `integration-marquee.tsx` points at `#start` — the contact form. Either build the integrations page, or change it to `Ask us about a tool →` pointing at `#start`, which is what it actually does.

### 6.4 Two claims I could not verify

- *"Most new connections take under two weeks"* — currently on the page. Confirm or I cut it.
- *"You get an alert and a fix from us, usually before your team notices"* (FAQ 6) — this is an SLA in prose. Confirm you'll stand behind it.

### 6.5 There is no proof on the page

No client names, no logos, no testimonial, no case study, no price. Your spec marks these `[CLIENT]` and deletes them rather than inventing them, which was right. But a done-for-you service with a 2–6 week build and a monthly fee is a considered purchase, and right now nothing on the page says anyone has ever bought it.

**Ask:** one named reference with permission, or one anonymised outcome you can stand behind ("a 40-person distributor, invoicing cut from 6 hours a week to zero"). One is enough. Best placement is directly under the calculator, where the reader has just produced their own number and is deciding whether to believe it.

---

## 7. Files this touches

| File | Change |
|---|---|
| `src/app/layout.tsx` | Metadata |
| `src/lib/nav.ts` | Chapter labels, footer columns, section ids |
| `src/components/blocks/hero.tsx` | Headline, body |
| `src/components/blocks/trust-strip.tsx` | All three items |
| `src/components/blocks/automation-stage.tsx` | New heading + body, 2 captions, closing line |
| `src/components/blocks/conversation-demo.tsx` | Merged into block 4 |
| `src/components/blocks/department-selector.tsx` | Merged into block 4; tasks + stats removed |
| `src/lib/capabilities.ts` | `dept` field, 1 new HR job, 6 impact lines |
| `src/components/blocks/dept-ledger.tsx`, `dept-pipeline.tsx`, `dept-reconcile.tsx` | Retired as duplicates |
| `src/components/blocks/dept-checklist.tsx` | Becomes the HR job widget |
| `src/components/blocks/capability-grid.tsx` | Heading + 6 descriptions |
| `src/components/blocks/the-work.tsx` | Heading, sub removed, 1 card, closing |
| `src/components/blocks/time-calculator.tsx` | Sub, footer |
| `src/components/blocks/the-build.tsx` | 2 steps, closing |
| `src/components/blocks/integration-marquee.tsx` | Heading, body, stats, link, note |
| `src/components/blocks/marquee-rows.tsx` | Search placeholder, empty state |
| `src/components/blocks/the-choice.tsx` | Heading, sub, contractions |
| `src/components/blocks/data-sovereignty.tsx` | Merged into block 11, hosting corrected |
| `src/components/blocks/trust-chapter.tsx` | Merged into block 11; pillars + tiles deleted |
| `src/components/blocks/faq.tsx` | Visible heading, 1 new Q, Q4 corrected |
| `src/components/blocks/closing-cta.tsx` | Heading, body |
| `src/components/site/footer.tsx` | Tagline, legal line |
| `src/components/site/header-mobile-drawer.tsx` | Drawer footer line |
| `src/app/page.tsx` | Block order, two merges |
| `src/lib/tools.ts` | Index expansion (§6.2) |

---

## 8. Suggested order of work

1. **Copy-only pass** on the blocks that don't move — hero, trust strip, stage, capability grid, the work, calculator, build, tools, choice, FAQ, CTA, footer, metadata. Shippable on its own, and it fixes the hosting inaccuracy immediately.
2. **Merge block 11** (data + trust). Smallest of the two merges, largest redundancy removed.
3. **Merge block 4** (demo + departments). Largest change; needs the `dept` field and the new HR job.
4. **Reorder** `page.tsx` and update `nav.ts` ids.
5. **Tool index expansion** (§6.2) — independent of everything else, can run in parallel.
6. Re-run the visual QA pass; every heading changes length, so line breaks at 320 / 768 / 1440 need re-checking.

Steps 1 and 2 can ship without answers to §6. Step 3 needs no answers either. Only the trust copy in block 11 is gated on §6.1, and it has a working default (option c).
