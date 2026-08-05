# Autonomy: website implementation spec

Version 2.0. Supersedes v1. Hand this to the build agent as the single source of truth.

Brand name: **Autonomy**. Use it everywhere, never `Northgate`.

Rule that overrides everything else: no number appears on this site unless the client supplied it. Anything marked `[CLIENT]` is a blank the client fills before launch.

---

## 1. The job of the page

**Who is reading.** An operations manager, founder, or department head at a business with 10 to 300 people. Not technical. They are not shopping for software, they are trying to get their week back.

**What they must believe in 90 seconds.**

1. A process they personally hate can run by itself, inside the tools they already own.
2. It will save them a specific, calculable amount of time.
3. Their data is safe, because Autonomy runs its own AI in Ireland and never trains on anything they hand over.

**How we do it.** We do not describe automation, we run one in front of them and let them scroll through it. Then we let them calculate their own saving with their own numbers. Everything else supports those two moments.

**Primary CTA:** `Start your first automation` (opens a three field form, not a calendar)
**Secondary CTA:** `Watch one run` (scrolls to the scroll stage)
No pricing table, no sign in, no "book an audit".

---

## 2. The one thing to fix from v1: colour discipline

The previous palette used navy, green, mint, peach and four channel colours. That is why it felt like several websites stitched together. Version 2 replaces it with one rule.

> **The page is white, grey and ink. Colour appears only where work is running or time is being saved.**

Two colours carry meaning, and nothing else on the page is coloured.

| Colour  | Means                | Appears in                                                                                                     |
| ------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Emerald | Done, saved, gained  | Completed canvas steps, elapsed times, the time calculator numbers, the logo mark, progress rails, focus rings |
| Amber   | Running, in progress | The active canvas node, the connector currently drawing, the live status pill                                  |

Every 3D icon is rendered in this same two colour palette on ink and white. That single decision is what will make the site read as one designed object rather than a collection of blocks.

### 2.1 Tokens

```css
/* surfaces */
--canvas: #ffffff;
--surface: #f6f8f7;
--surface-2: #fafbfa; /* canvas interior */
--hairline: #e6eae8;
--hairline-2: #cbd2ce;

/* ink */
--ink: #0c1512; /* headlines, primary button, dark band */
--body: #3c4a45;
--muted: #6e7c76;
--on-dark: #ffffff;
--on-dark-muted: #9fb0a9;

/* meaning */
--brand: #00a870; /* emerald, graphics and fills only */
--brand-strong: #046b4a; /* emerald text and small marks, AA on white */
--brand-tint: #e6f6ef;
--running: #f59e0b; /* amber, graphics and fills only */
--running-strong: #7c4a03; /* amber text, AA on white */
--running-tint: #fef3e0;
```

### 2.2 Colour rules the agent must not break

1. Primary buttons are `--ink` with white text. Not emerald. Emerald stays semantic so it never turns into wallpaper.
2. Secondary buttons are white with a `--hairline-2` border and `--ink` text.
3. Emerald and amber are never used as a section background. Only as fills inside components, tints behind chips, and text at `--brand-strong` / `--running-strong`.
4. Third party tool logos render in their real brand colours at 20px, and only in two places: the integration constellation and the conversation player header. Nowhere else.
5. Exactly one dark section exists on the page, the trust chapter. Everything else is white or `--surface`.
6. No gradients anywhere except two: the dot grid ambient wash inside the canvas (6% opacity maximum) and the fade masks on the constellation edges.

---

## 3. Page structure

One page, thirteen blocks. Section padding 120 / 80 / 64 (desktop / tablet / mobile).

| #   | Block                                               | Surface                      |
| --- | --------------------------------------------------- | ---------------------------- |
| 0   | Glass header                                        | Floating over content        |
| 1   | Hero, with live canvas                              | `--canvas`                   |
| 2   | Trust strip                                         | `--surface`                  |
| 3   | Chapter rail                                        | `--canvas`, sticky on scroll |
| 4   | The scroll stage, an automation built as you scroll | `--canvas`                   |
| 5   | The work: four costs                                | `--surface`                  |
| 6   | The time: calculator                                | `--canvas`                   |
| 7   | Pick a job your team does every day                 | `--surface`                  |
| 8   | The build: four steps                               | `--canvas`                   |
| 9   | The reach: integration constellation                | `--surface`                  |
| 10  | The choice: three alternatives                      | `--canvas`                   |
| 11  | The trust: dark band                                | `--ink`                      |
| 12  | FAQ, closing CTA, footer                            | `--canvas`                   |

---

## 4. Block by block, with final copy

### Block 0. Glass header

Floating pill, not a full width bar. Max width 1180px, 12px from the top, 14px radius, height 60px, shrinks to 52px after 12px of scroll.

```css
/* resting state at the very top of the page */
background: transparent;
border: 1px solid transparent;
backdrop-filter: none;

/* scrolled state, transition 320ms */
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(12, 21, 18, 0.06);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.7),
  0 8px 28px -18px rgba(12, 21, 18, 0.28);
```

Contents: logo mark plus `Autonomy` on the left, chapter links in the centre on desktop only, `Start your first automation` on the right.

Rules. The inset top highlight is what makes glass read as glass, do not omit it. When the header overlaps the dark trust band, an IntersectionObserver adds a class that switches the glass to `rgba(12,21,18,0.6)` with white text. Provide a solid `rgba(255,255,255,0.95)` fallback inside `@supports not (backdrop-filter: blur(1px))`. Never animate `backdrop-filter` itself, animate `background-color` and `box-shadow` only.

### Block 1. Hero

Two columns, 1.02fr / 0.98fr, 72px gap, stacks under 1000px.

```
eyebrow   Automation studio
h1        We build the automations
          your business runs on.
body      Your tools, your data, your process. We connect them so the work
          your team repeats every day happens without anyone doing it.
cta       Start your first automation   ·   Watch one run
```

Right column: **Canvas** (component A) in compact mode, three nodes, running on a loop. It enters at 600ms with a scale from 1.03 to 1.0 and a fade, which reads as a camera settling.

### Block 2. Trust strip

This is the promoted version of the line that used to sit quietly under the hero buttons. It is now its own band.

Full width `--surface`, hairline top and bottom, 88px tall, three items evenly spaced, each with a 40px 3D icon in a 56px `--brand-tint` rounded square, a 16px/600 ink headline and a 14px muted line under it.

| Icon                  | Headline                               | Sub                                                      |
| --------------------- | -------------------------------------- | -------------------------------------------------------- |
| Plug / connector      | 1,000+ tools connected                 | If it has an API, we automate it                         |
| Shield with lock      | Our own AI, never trained on your data | Your records never leave your workspace to teach a model |
| Server with EU marker | Hosted in Ireland                      | Processed and stored inside the EU, under GDPR           |

On mobile this becomes a three item vertical stack, icons 32px, no cards.

Items animate in with an 80ms stagger, and the emerald tint square scales from 0.9 with a 400ms ease out.

### Block 3. Chapter rail

Five pills, hairline top and bottom, directly under the trust strip:

`Watch it run` · `The work` · `Your time` · `What we connect` · `Your data`

On scroll it becomes sticky beneath the header at 44px with the same glass treatment as block 0, and the active pill fills with `--brand-tint` and `--brand-strong` text. Horizontal scroll with auto centring on mobile.

### Block 4. The scroll stage

This is the immersive scrollytelling moment taken from the phone product pages. It is the single most important block on the site.

**Mechanics.** The section is 400vh tall. Inside it, a stage is `position: sticky; top: 96px; height: calc(100vh - 96px)`. The canvas sits centred in the stage. Scroll progress through the section, 0 to 1, drives the build of the automation.

**Phases.** Progress is divided into four equal segments. In each segment, one node fades and scales in from 0.96, its connector draws from the previous node using `stroke-dashoffset`, the node runs (amber), then completes (emerald). A caption line above the canvas crossfades per phase.

| Progress   | Caption                                  | Canvas event                               |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| 0 to 25%   | An order arrives from your store.        | Trigger node appears, fires                |
| 25 to 50%  | Stock is checked. Nobody asked it to.    | Sheets node draws in, runs, completes      |
| 50 to 75%  | The invoice writes itself.               | Invoice node draws in, runs, completes     |
| 75 to 100% | Your team is told. Elapsed: 1.2 seconds. | Slack node completes, total time counts up |

At 100% the stage releases and the page scrolls on normally.

**Hard rules.** Native scroll only. No scroll hijacking, no snap, no wheel event interception. The stage must never trap the user. Everything driven by a single `scrollYProgress` value, not by a chain of timeouts, so scrubbing backwards works correctly. On mobile reduce to 300vh, scale the canvas to fit the width, and stack the nodes vertically while keeping the same scroll driving.

Below the released stage, a single line and a button:
`That is one process. Most teams have twelve.` and `Start your first automation`.

### Block 5. The work

```
kicker   THE WORK
h2       Manual work is never free.
         It is billed somewhere else.
body     Four costs your team pays every week, none of which appear on an invoice.
```

Four white cards, hairline, 12px radius, 32px padding, one 3D icon each in a 56px `--brand-tint` square.

| Card          | Copy                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| Time          | The same information is typed into three systems, every day.             |
| Cost          | Skilled people spend their week on work a system should do for free.     |
| Quality       | Every manual handoff can go wrong, and weeks pass before anyone notices. |
| Communication | Where things stand lives in an inbox instead of in the system.           |

Closing line: `These never get fixed because they never get measured. That is where we start.`

### Block 6. Your time

The client asked for weight here, and rightly. This is what is actually being bought.

```
kicker   YOUR TIME
h2       You are not buying software.
         You are buying back hours.
body     Put in your own numbers. The answer below is yours, we did not choose it.
```

**Component E, the time calculator.** Three inputs on the left, results on the right.

Inputs, all sliders with numeric readouts:

- `People doing this task` 1 to 50, default 3
- `Times per day` 1 to 100, default 12
- `Minutes each time` 1 to 60, default 6

Optional fourth input, a plain number field: `Average hourly cost` with a currency selector, blank by default. If blank, the money result is hidden entirely rather than estimated.

Results, large tabular numerals in `--brand-strong`, each counting up over 600ms on change:

- `hours per month`
- `working days per year`
- `cost per year` (only when the hourly cost is filled)

Under the results, a **week grid**: five columns for Monday to Friday, each an 8 cell stack representing working hours. Cells fill emerald from the bottom as the reclaimed hours rise, with a 40ms per cell stagger. This gives the number a physical shape.

Footer line under the whole component:
`These are your numbers, not ours. We will check them with you in the first hour.`

### Block 7. Pick a job

```
kicker   THE RANGE
h2       Pick something your team
         does every day.
body     Choose a job. Watch it handled without anyone touching it.
```

Desktop: three columns, four job cards left, player centre, four job cards right. Tablet: player on top, jobs in a 2 by 4 grid. Mobile: horizontal snap carousel of job chips with the player below.

| Job                         | Channel    | Player       |
| --------------------------- | ---------- | ------------ |
| Answer a customer question  | WhatsApp   | Conversation |
| Qualify a new lead          | Web form   | Canvas       |
| Issue an invoice            | QuickBooks | Canvas       |
| Chase an unpaid invoice     | Email      | Conversation |
| Update stock across systems | Sheets     | Canvas       |
| Onboard a new client        | Slack      | Canvas       |
| Route a support ticket      | Zendesk    | Canvas       |
| Send an order update        | WhatsApp   | Conversation |

Selecting a job crossfades the centre player and restarts its run. Each job card carries a small 3D icon, its name, and a channel tag.

### Block 8. The build

```
kicker   THE BUILD
h2       Four steps.
         You are only needed for the first.
```

Horizontal stepper, four columns on desktop, vertical rail on mobile. An emerald progress line scrubs left to right with scroll position, and each step activates as the line reaches it.

| #   | Step  | Copy                                                                                            | Timing       |
| --- | ----- | ----------------------------------------------------------------------------------------------- | ------------ |
| 01  | Map   | We sit with the people doing the work and draw the process as it really runs.                   | 1 hour       |
| 02  | Scope | We pick the smallest change with the largest return and agree the number we are judged on.      | 1 week       |
| 03  | Build | We build inside your existing tools and test it on sample data before it touches anything live. | 2 to 6 weeks |
| 04  | Run   | We watch it, fix what breaks, and report what it saved you.                                     | Ongoing      |

Line under: `You keep working the way you work. Nothing gets migrated, nothing gets replaced.`

### Block 9. The reach

```
kicker   THE REACH
h2       We build on what
         you already run.
body     Over a thousand tools connect out of the box. If it has an API, it can be automated.
```

**Component D, the constellation.** Centre node with the Autonomy mark, two or three rings of tool chips rotating slowly in alternating directions, 90 to 140 seconds per revolution, chips counter rotating so text stays upright. A search field above filters chips live, with non matching chips dropping to 20% opacity, and a count line reading `142 of 1,000+ tools match "invoice"`. Hover pauses rotation. Mobile renders a static three column grid with the search on top, no rotation.

Four stat clusters underneath, all verifiable from the tool inventory:

| Value  | Label                                             |
| ------ | ------------------------------------------------- |
| 1,000+ | Tools connected                                   |
| 5      | Step families: triggers, logic, data, AI, actions |
| 8      | Messaging channels                                |
| Any    | REST or webhook endpoint                          |

Line under: `Do not see yours? Send it to us. Most new connections take under two weeks.`

### Block 10. The choice

```
kicker   THE CHOICE
h2       Three ways to solve this.
         One of them ends.
```

Three columns, the third promoted with a 2px `--brand` border and a `What we do` chip.

| Option              | Body                                                                                                      | Cost                             |
| ------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Hire another person | A salary absorbs the volume for a year. The work still exists, it is just someone else's day now.         | Recurring, forever               |
| Buy another tool    | Off the shelf software fits its own process, not yours. Your team adapts to it, and the gaps stay manual. | A subscription, plus a migration |
| Build the system    | Built once, inside what you already own. It runs every day after that at no additional cost.              | One project, then it is yours    |

### Block 11. The trust

The only dark block. `--ink` background, white text, full bleed, 120px vertical padding.

```
kicker   YOUR DATA
h2       Four things we put in writing.
```

Four stat tiles across the top, white text on a 1px white-at-12% border, no fill:

| Value      | Label                        |
| ---------- | ---------------------------- |
| Ireland    | Where your data lives        |
| Our own AI | No third party model sees it |
| Encrypted  | At rest and in transit       |
| Yours      | Export or delete at any time |

Four promises below, thin white top rule on each:

| Promise                        | Body                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Your data never trains a model | We run our own AI. Your messages, documents and records are never used to train a model, ours or anyone else's. |
| Everything runs in Ireland     | Your data is processed and stored on servers in Ireland, inside the EU, under GDPR. It does not leave.          |
| You own what we build          | The workflows, the accounts, the credentials and the documentation. Any developer can pick it up.               |
| Access is scoped               | Each automation gets only the permissions it needs, and loses them the day it does not.                         |

Closing line, 20px, `--on-dark-muted`: `If you ever stop working with us, everything keeps running.`

### Block 12. FAQ, CTA, footer

FAQ accordion, one open at a time, hairline separators, no card chrome:

1. **What does a project cost?** Most first projects land in a range we put in writing after we map the process. Ongoing support is a flat monthly fee agreed up front, with no hourly billing.
2. **How long until something is running?** Two to six weeks for a first automation, depending on how many systems it touches. You see it working on sample data before it goes near anything live.
3. **Where does our data go?** Onto servers in Ireland, inside the EU. We run our own AI, so nothing is passed to a third party model and nothing is used for training.
4. **Do we have to change our current systems?** No, and that is the point. We build around the tools your team already knows.
5. **What happens when something breaks?** We monitor everything we build. You get an alert and a fix from us, usually before your team notices.
6. **Who owns the work?** You do, entirely. It is built in your accounts under your credentials, and it stays yours whatever happens between us.

Closing CTA, centred on `--brand-tint`, 12px radius, 96px padding:

```
kicker   START HERE
h2       Tell us one process.
         We will show you what it costs you.
body     Describe something your team repeats. We come back with a map of it,
         a number attached, and what it would take to remove it.
cta      Start your first automation
```

Form fields, exactly three: `what process`, `which tools`, `how to reach you`.

Footer: logo, one line description, four link columns, legal row, and a status line reading `all systems normal` with a small emerald dot.

---

## 5. Component A, the canvas

The client wants this to match the newn.ai canvas closely. Below is that anatomy translated to our light theme. Follow it precisely, it is the hardest and most valuable component on the site.

### 5.1 Frame

- Outer card: `--canvas`, 1px `--hairline`, 20px radius, shadow `0 24px 56px -20px rgba(12,21,18,0.16)`.
- **Top bar**, 56px, bottom hairline. Left: a pill chip, `--brand-tint` background, `--brand-strong` text, 11px/600, 1px letter spacing, reading `AUTOMATION`. Beside it the flow title at 18px/600 ink. Right: a `Run` button, 36px tall, pill, 1px `--hairline-2` border, ink text, play triangle glyph at 14px. On hover the border goes `--brand` and the glyph fills emerald.
- **Canvas interior**: `--surface-2`, with a 24px dot grid drawn as `radial-gradient(#DFE5E2 1px, transparent 1px)`. Over it, two very soft radial washes: `--brand` at 6% from the upper left and `--running` at 4% from the right. Nothing stronger, the grid must stay readable.
- **Zoom cluster**, bottom right: white pill container, 1px hairline, 40px tall, containing minus, a percentage readout, plus, and a fullscreen glyph, each a 32px target. Functional on the expanded canvas, decorative in the hero.

### 5.2 Terminals

Start and end nodes are 96 by 96, 20px radius, white, 1px hairline, with a 12px soft outer ring at 6% ink to give the halo seen in the reference. Inside: a glyph, then a two line label, `FLOW` at 10px/600 letter spaced in `--muted`, and `START` or `END` at 14px/600 ink. A status chip sits at the top left, 10px text with a 5px dot, reading `READY`.

### 5.3 Step nodes

260px wide, white, 1px `--hairline`, 14px radius, shadow `0 4px 12px rgba(12,21,18,0.06)`.

- **Header row**, 40px, own background, bottom hairline. Left: a 6px state dot, then the node type in caps at 11px/600 with 0.8px letter spacing. Right: an optional chip such as `TRIGGER`, and two 16px ghost icon buttons.
- **Header background by state**: idle `--surface`, running `--running-tint`, done `--brand-tint`.
- **State bar**: a 3px vertical bar on the left edge of the whole node, matching the header state colour, with the node radius clipped correctly on that side.
- **Body**: 12px rows, label left in `--muted`, value right in ink at 500. Hairline dividers between groups. Warning rows use `--running-strong` text with a 5px amber dot.
- **Chip row** at the bottom where relevant, 11px pills with 12px glyphs, for example `Safety`, `Approval`, `History`.

### 5.4 Connectors

Bezier curves, 1.5px, `--hairline-2`, with a 6px circular port at each end, white fill and hairline stroke. When a step runs, a 2px `--running` stroke draws along the curve using `stroke-dasharray` and `stroke-dashoffset` over 400ms, then settles to `--brand` once the target node completes.

### 5.5 Run cycle in loop mode

7.5 seconds. Step activates, header turns amber, connector draws, marker resolves to emerald, duration counts up from 0 to its value over 300ms. Hold the completed state for 3 seconds, fade out over 400ms, restart. In scroll stage mode the same states are driven by scroll progress instead of time.

### 5.6 Data shape

```ts
type CanvasNode = {
  id: string;
  type: string; // "SCHEDULE", "RSS", "AI MODEL", "NOTION PAGES"
  chip?: string; // "TRIGGER"
  rows: { label: string; value: string; tone?: "default" | "warn" }[];
  chips?: string[]; // "Safety", "Approval"
  ms: number;
};

type CanvasFlow = {
  id: string;
  title: string;
  nodes: CanvasNode[];
  totalLabel: string; // "1.2 seconds"
};
```

### 5.7 Do not

Do not use React Flow or any graph library. Do not allow dragging, panning, node editing, or a node palette. Do not add a minimap. This is a recording of a real automation, not an editor.

---

## 6. Components B, C, D, E in brief

**B. Conversation player.** Phone frame 360px wide, 20px radius, hairline, header tinted with the channel colour, message area on `--surface-2`. Supports inbound bubbles (white, left), outbound (`--brand-tint`, right), a product card, quick reply buttons, and a typing indicator. Typing indicator shows for 700ms before each outbound message, bubbles enter with an 8px rise over 260ms, 900ms between messages, hold 3 seconds at the end, then restart. Do not clone WhatsApp chrome or wallpaper.

**C. Run log.** Sits under the canvas. Tabular numerals, three columns: clock time, event text, and a delta chip (`+0.0s`, `+0.4s`, `+0.9s`, `+1.2s`). Lines print in sync with the canvas, each a 200ms fade with a 6px rise. Delta chips are `--brand-strong` on `--brand-tint` and are the only coloured text in the block.

**D. Constellation.** Specified in block 9.

**E. Time calculator.** Specified in block 6. All computation is client side and instant. Round every displayed number. Use `Intl.NumberFormat`. Never show a fractional person or a negative result. If the inputs produce something implausible, cap the display and show `40+ hours per month` rather than an absurd figure.

---

## 7. Icons

The icon choice in v1 was too generic. This section replaces it.

### 7.1 Two icon systems, never mixed

**UI glyphs**, 16 to 20px, monochrome: use **Phosphor Icons**, regular weight, rather than Lucide. Phosphor's slightly rounder terminals sit better with a premium light interface, and the duotone weight gives us a second tier without adding colour. These are for buttons, chips, accordion markers, the zoom cluster, and the canvas node headers.

**Feature icons**, 3D, exactly 19 of them: three in the trust strip, four in the work cards, eight in the job cards, four in the build steps. Nowhere else on the page.

### 7.2 Art direction that makes them feel like one set

This is what was missing before. Even a good icon set looks scattered without these rules.

1. **One container.** Every 3D icon sits in an identical 56px rounded square (14px radius) filled `--brand-tint`. The container unifies the set even where the icons differ.
2. **One camera.** Front facing, 15 degree downward tilt, identical for all 19. No isometric mixed with front facing.
3. **One light.** Key light upper left at 45 degrees, one soft fill, no rim light.
4. **Matte only.** Clay or soft plastic finish. No gloss, no chrome, no glass, no emissive glow.
5. **Locked palette.** Every icon uses only ink, white, emerald and amber, at a maximum of 40% saturation. Reject any asset that introduces a fifth colour.
6. **No baked shadow.** Transparent background, no contact shadow rendered into the asset, since the container provides the grounding.
7. **Export.** 128px at 2x, WebP, under 30KB each, explicit width and height in markup, `alt=""` since they are decorative.

### 7.3 Where to get them, in order of preference

1. **Commission or render a custom set** in Spline or Blender against the palette above. Nineteen icons is a small brief and it is the difference between a site that looks bought and a site that looks made. This is the recommendation for a project at this price.
2. **Streamline** (streamlinehq.com), the `Plump 3D` or `Core 3D` families. Most internally consistent commercial set available, broad coverage, and the palette can be adjusted at export.
3. **Icons8 3D Fluency** (icons8.com). Polished and consistent, subscription needed to drop attribution.
4. **Iconscout 3D** (iconscout.com). Largest library, quality varies between contributors, so buy from one designer's set only.
5. **3dicons.co**. Free and CC0, but glossy and playful, and the set is small. Acceptable as a placeholder during build, not for launch.

**Action needed from the client.** Tell me which of these you can license, or confirm you want a custom set commissioned, and I will map all nineteen icons to exact asset names or write the render brief. Do not let the build agent pick icons ad hoc, that is how the set fragments.

---

## 8. Motion

One idea only: **things complete themselves while you watch**. Any animation that does not serve that idea is removed.

```css
--dur-fast: 180ms;
--dur-base: 320ms;
--dur-slow: 700ms;
--ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
```

| Moment        | Behaviour                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page load     | Hero elements enter in sequence at 80ms intervals. Headline lines rise from a clipped mask over 900ms. Canvas enters at 600ms with a 1.03 to 1.0 scale and fade, then begins running. |
| Section entry | Fade plus 22px rise over 700ms, children staggered 80ms, capped at six. Fires once, never on scroll back.                                                                             |
| Scroll stage  | Driven entirely by a single scroll progress value. Must scrub correctly in both directions.                                                                                           |
| Build stepper | Progress line follows scroll position, steps activate at 25, 50, 75 and 100 percent.                                                                                                  |
| Job selection | Old player out at 180ms, new player in at 260ms with a 6px rise, run restarts.                                                                                                        |
| Calculator    | Numbers count over 600ms on every input change, week grid cells fill with a 40ms stagger.                                                                                             |
| Buttons       | 1px lift and shadow over 180ms, arrow glyph translates 3px, active scales to 0.98.                                                                                                    |
| Cards         | 4px lift over 350ms. No border colour change, no shadow bloom.                                                                                                                        |
| Accordion     | `grid-template-rows` 0fr to 1fr over 380ms. Never animate `max-height`.                                                                                                               |
| Header        | Glass fades in over 320ms after 12px of scroll, height 60px to 52px.                                                                                                                  |

**Prohibited.** Parallax. Scroll hijacking. Scroll snap on the page. Anything animating on every scroll pass. Looping animation below the fold other than the constellation. Any animation that causes layout shift.

**Reduced motion.** Under `prefers-reduced-motion: reduce`: disable every transition and keyframe, render all reveals in their final state, show both players completed with the log fully printed, freeze the constellation, and make the scroll stage a static four panel grid rather than a pinned section. Verify by toggling the operating system setting, not by reading the CSS.

---

## 9. Stack and sourcing

| Concern    | Choice                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 15, app router, TypeScript strict                                                                                        |
| Styling    | Tailwind, tokens from section 2.1 as CSS variables in `globals.css`                                                              |
| Components | shadcn/ui for accordion, tabs, slider, input, dialog. Nothing else.                                                              |
| Motion     | Motion (framer-motion) for orchestration and scroll progress. Plain CSS keyframes inside the canvas so it runs before hydration. |
| Fonts      | Inter via `next/font`, self hosted, weights 400, 500, 600 only                                                                   |

**On the component MCPs.** Use shadcn MCP and 21st.dev MCP for the accordion, tabs, slider, search input and marquee only. Do not pull a hero, bento grid, testimonial block, gradient card, animated beam, or spotlight card from either. Those components are precisely why AI built sites look identical to each other. Components A through E are written from scratch against the specs above.

---

## 10. Responsive

| Breakpoint     | Changes                                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Under 640px    | Single column. Hero canvas below text. Scroll stage 300vh with vertically stacked nodes. Calculator inputs full width above results. Job picker becomes a snap carousel. Constellation becomes a static grid. Comparison stacks. Chapter rail scrolls horizontally. |
| 640 to 1024px  | Two column grids. Player above job rails. Build stepper vertical. Canvas scales to container width.                                                                                                                                                                 |
| 1024 to 1440px | Full layout as specified.                                                                                                                                                                                                                                           |
| Over 1440px    | Content holds at 1280px, background bands go full bleed.                                                                                                                                                                                                            |

Touch targets 44px minimum. Test at 320px, nothing may overflow horizontally.

---

## 11. Performance, accessibility

LCP under 2.0s on mid tier mobile over 4G. CLS under 0.05. TBT under 200ms. JavaScript under 190KB gzipped. All images WebP or AVIF with explicit dimensions. The scroll stage must not block first paint. Lighthouse 95 or better on performance, accessibility and best practices.

Contrast AA on all text including `--muted` on `--surface`. Full keyboard operation of the chapter rail, job picker, calculator sliders, tabs and accordion. Focus ring 2px `--brand` at 3px offset. Canvas and conversation player are decorative, `aria-hidden="true"` with a text equivalent nearby. Calculator sliders need `aria-valuetext` with a spoken result. One `h1` on the page. Test with the keyboard alone before sign off.

---

## 12. Verification before claiming completion

Open the site in Chrome DevTools MCP. Screenshot every viewport. Check every box with evidence.

- [ ] 320, 375, 768, 1024, 1440, 1920. No horizontal scroll, no clipped text, no orphaned last words in headlines.
- [ ] Header glass renders correctly over white, over `--surface`, and over the dark trust band, with the correct class switch on the dark band.
- [ ] Header fallback verified with `backdrop-filter` disabled.
- [ ] Scroll stage scrubs correctly forwards and backwards, releases cleanly, and never traps scroll. Test with trackpad, mouse wheel, and touch.
- [ ] Canvas completes its cycle and resets with no flash of a half state. Amber to emerald transitions are visible and correct.
- [ ] Connectors draw fully, ports stay attached at every zoom and breakpoint.
- [ ] Conversation player never overflows or scrolls internally, no jump when the typing indicator is replaced.
- [ ] All eight jobs selected in sequence, no layout shift, no stuck animation.
- [ ] Calculator: drag every slider to both extremes, no NaN, no negative, no overflowing digits, week grid stays inside its box.
- [ ] Chapter rail highlights the correct chapter at every scroll position and does not cover section headings when anchored.
- [ ] Accordion opens and closes with no height jump and no scroll jump.
- [ ] Constellation search returns results, shows a count, clears correctly, pauses on hover.
- [ ] All 19 3D icons present, same container, same size, same lighting direction. Any that look imported from a different set get replaced.
- [ ] `prefers-reduced-motion` on: nothing moves, everything legible in final state, scroll stage falls back to a static grid.
- [ ] Console clean, no hydration mismatch.
- [ ] Tab through the whole page, focus always visible, never trapped.
- [ ] Lighthouse report attached.

Do not report completion until every box is checked.

---

## 13. What the client supplies

Logo files for Autonomy. Four real flow examples with real step names and durations. Eight job scenarios with real message scripts. Real client results, or the results stay out. Client logos with written permission, or the logo strip stays out. Contact details and legal entity. Privacy policy, terms, and data processing terms. Confirmation of the Ireland hosting provider and region for the trust copy. The icon licensing decision from section 7.3.

---

## 14. Build order

1. Tokens, type scale, layout primitives, glass header, footer.
2. Component A, the canvas, in isolation, in loop mode, with the run log. Hardest and most valuable piece, build it first and get it right.
3. Hero, trust strip, chapter rail.
4. The scroll stage, reusing component A driven by scroll progress instead of time.
5. Component E, the time calculator, including the week grid.
6. Component B and the job picker around it.
7. Static chapters: the work, the build, the choice, the trust.
8. Component D, the constellation.
9. FAQ, closing CTA, form.
10. Motion pass across the whole page in one sitting so timings stay consistent.
11. Responsive pass.
12. Verification pass per section 12.
