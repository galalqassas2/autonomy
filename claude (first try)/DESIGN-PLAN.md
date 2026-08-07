# Autonomy: interface build record

What shipped in the visual pass, and why. Companion to `COPY-PLAN.md`.

---

## Rules the codebase holds to

1. **One motion library.** anime.js v4. Nothing was added alongside it.
2. **No scroll hijacking.** Native scroll only, per `prompt_v1.md` block 4.
3. **No colour literals outside `tokens.css`.** Every surface themes from one place.
4. **Reduced motion is handled** in each component or in `animations.css`.

One dependency was added across the whole pass: `ogl`, dynamically imported by
the filament background so it never enters the first page load.

---

## What was built

| Where | Component | File |
| --- | --- | --- |
| Header | Chapter nav with a lit pill and a spark burst | `site/chapter-nav.tsx` |
| Hero | Sheen crossing the neon phrase | `.shiny-text` in `animations.css` |
| Tools | Drifting wall of logo plates on a tilted plane | `fx/logo-wall.tsx` |
| Build | Rail scrubbed by scroll, steps lighting in order | `blocks/the-build.tsx` |
| Choice | Card that answers the pointer, lit on the promoted option | `fx/glow-card.tsx` |
| Data | Filaments drifting behind the loop | `fx/filaments.tsx` |

Components live where their kind already lives: visual effects in `fx/`, shell
pieces in `site/`, page sections in `blocks/`. Their styles sit in
`components.css` and their keyframes in `animations.css`, alongside everything
else, rather than in a folder of their own.

### Chapter nav

Replaces the sliding underline. An emerald pill measured from the live link, so
it stretches between labels of any width and survives the font swap. Scroll
position owns which link is current, so the pill reads as "where you are". Ten
sparks burst on arrival, re-rolled per chapter rather than per render. The glass
pill, the height shrink and the progress hairline are untouched.

### Logo wall

Replaces the three row marquee. Seven columns on desktop, five on tablet, three
on mobile, drifting against each other at 72px per second on a plane pitched 12
degrees and turned 10. The column under the pointer eases to a stop so its mark
can be read.

Three things it does that a stock wall would not:

- Tiles take a node, not an image URL, so our SVG sprite is reused and the
  section costs no extra requests and no extra bundle.
- The whole wall is `aria-hidden` and holds no focusable elements. Seven columns
  of repeated tiles would otherwise put roughly 400 tab stops before the footer.
  The readable equivalent is the search below it and a hidden list of names.
- Plates carry the same fill and hairline as `.tool-tile`, so a mark looks the
  same in the wall as it does in a search result.

### Build rail

`prompt_v1.md` block 8 asked for a progress line scrubbed by scroll with each
step activating as the line reaches it. It was never built; the section was a
flat list. It now reads the list's position directly on a throttled scroll
listener and writes one `--rail` value, and CSS picks the axis: across the
plates on desktop, down them on mobile.

The library's scroll helper was tried first. Its `onUpdate` does not fire for
plain object targets under a synced observer, which is why the header's bar
works and this did not.

### Glow card

Every card takes a soft spotlight from the pointer; the promoted one also
carries an edge of light and eight drifting motes, so the option we recommend is
the only one on the row that looks alive.

This replaced a flip. All three arguments now sit on the face of the cards,
which removed a required interaction before anything could be compared, and
removed the sentence of copy that had to teach the interaction.

### Filaments

Forty filaments drifting across the data band. The only WebGL on the page: the
renderer is imported when the section comes near, and the context is dropped on
unmount. Colour is read from `--primary` at mount rather than repeated.

---

## The merge

Jobs and departments were two sections asking the same question with two
controls, two headings and two sets of demo components covering the same four
scenarios. They are now one section, `blocks/what-we-automate.tsx`: pick a team,
pick a job, watch it run.

The department panels were a second demo system running in parallel to the
capability widgets. `LedgerPanel` showed the invoice run that
*Turn a won deal into an invoice* already shows, `PipelinePanel` the lead
routing of *Route a new lead*, `ReconcilePanel` the stock check of
*Reorder before you run out*. All three are gone. `ChecklistPanel` was the only
one with no equivalent, so its content became a `checklist` widget and HR gained
a real job, *Onboard a new starter*.

Deleted: `conversation-demo.tsx`, `department-selector.tsx`, `dept-ledger.tsx`,
`dept-pipeline.tsx`, `dept-reconcile.tsx`, `dept-checklist.tsx`,
`dept-panel-shell.tsx`, `use-sequence.ts`. One demo system remains, driven by
one runner, so every widget on the page shares a cadence.

Teams come from the `team` field the capabilities already carried, so the merge
added no new data, only the HR job.

---

## Defects found and fixed on the way

| Defect | Effect |
| --- | --- |
| `eslint.config.mjs` spread two configs that export objects | Lint had never run. Bridged with `FlatCompat`, plus ignores for the Node QA scripts. |
| Both scroll animations in the data band never fired | The hops sat at opacity 0 and the loop was never drawn. Rebuilt as CSS transitions on one `data-shown` attribute, with `pathLength` normalising the dash maths. |
| Reduced motion targeted `.word-cycle > span` | The spinner renders `<b>`, so the rule never matched and the words kept cycling. |
| Two hero lines sat 24px apart | Adjacent negative margins collapse to one value, not the sum. Horizontal padding is all the glow needed. |
| Six unused imports across three files | Removed. |
| The tab pill animated under `prefers-reduced-motion` | anime.js does not read the CSS override, so the duration is now zeroed from the hook. |
| `.claude/launch.json` pointed at a directory that does not exist | The preview server could never start. Repointed at the project. |
| Footer linked to `#departments` | That section no longer exists. Repointed at the merged one. |
| Search promised more than the index held | Placeholder now reads "Search connected tools". The index still needs widening, see `COPY-PLAN.md` §6.2. |

---

## Verified

Typecheck, lint and production build clean. First load 220kB, down from 223kB
before the pass despite the new background, because the merge removed more than
`ogl` adds and `ogl` loads as its own chunk. Console clean, no hydration
warnings.

Checked in the browser at 1440 and 375:

| Check | Result |
| --- | --- |
| Team tabs | All six switch, each showing only its own jobs. Pill width matches the tab exactly. |
| Pill | Persists across chapters and slides. Sparks re-fire on each arrival. |
| Chapter nav | Tracks all six chapters, pill at 0, 105, 254, 395, 522, 629. |
| Build rail | 0.000 with none lit, 0.653 with three, 1.000 with four. Same on the vertical axis. |
| Logo wall | Seven columns at 1440, three at 375, zero focusable elements. |
| Filaments | Canvas 1781x867 with a live WebGL context, loaded as its own chunk. |
| Data band | Loop draws to dashoffset 0, all three hops reach opacity 1. |
| HR checklist | Counts 0 through 6 of 6 on the shared runner. |
| Mobile | Panel stacks, tab strip scrolls, keyboard arrows move between teams, no horizontal scroll. |

---

## Still open

**Proof.** No client name, logo, outcome or testimonial exists anywhere on the
site. One anonymised line under the calculator is enough, where the reader has
just produced their own number.

**Tool index.** 58 marks against a claim of 1,000+. See `COPY-PLAN.md` §6.2.
