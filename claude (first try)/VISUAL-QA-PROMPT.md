# Visual QA brief: Autonomy marketing site

You are doing a **visual inspection only**. Do not refactor, do not redesign, do not
"improve" anything. Look at the built page, find what is visually wrong, and write a
report. Fixes come later, from someone else, based on your report.

---

## 1. How to run it

```bash
pnpm -C "C:/Users/PC/Desktop/ireland/claude/autonomy" run dev
```

Serves on `http://localhost:3000`. A dev server may already be running on that port,
reuse it if so.

The project is Next.js 15, app router, TypeScript strict, Tailwind v4. Type check is
currently clean (`pnpm exec tsc --noEmit`) and the browser console is clean on a fresh
load. If either of those stops being true while you are inspecting, that is a finding.

### Taking screenshots

Chrome is installed at `C:\Program Files\Google\Chrome\Application\chrome.exe` and
`puppeteer-core` is already a devDependency, so you can drive real Chrome headlessly
with `executablePath` pointed at that binary. Use whatever approach works; the point is
that **every claim in your report is backed by an image you actually looked at**. Save
screenshots somewhere you can reference them and list the paths in the report.

I could not take screenshots in my environment, so **treat everything visual as
unverified**. Programmatic checks that did pass, so you can skip re-deriving them:

- No horizontal overflow at the default width
- Exactly one `<h1>`
- Exactly 19 elements with class `.icon-plate` (the 3D feature icons)
- 116 `.tool-tile` elements in the marquee (58 marks, each row duplicated)
- Slider inputs carry correct `aria-label` and `aria-valuetext`
- Console clean, no hydration mismatch

---

## 2. What the site is

A single marketing page for **Autonomy**, an Irish company that builds custom
automations inside the tools a business already owns.

**Reader:** an operations manager, founder or department head at a 10 to 300 person
business. Not technical. Not shopping for software. Trying to get their week back.

**What they must believe within 90 seconds:** a process they hate can run by itself
inside their existing tools; it will save a calculable amount of their time; their data
is safe because Autonomy runs its own AI in Ireland and never trains on their data.

Primary CTA is `Start your first automation`. Secondary is `Watch one run`.

---

## 3. The design language, so you can tell a bug from an intention

**The page is white. The product is dark. Neon exists only on the dark islands.**

There are exactly **three dark islands** on the whole page and nothing else is dark:

1. The automation stage (`#watch-it-run`)
2. The integration marquee (`#what-we-connect`)
3. The trust chapter (`#your-data`)

A section that is dark and is not one of those three is a bug. A glow that appears
anywhere on the white track is a bug (the one exception is the footer status dot, which
is meant to carry a soft emerald glow).

### Tokens

```css
--primary:        #3ecf8e;   /* the only chromatic event on the page */
--primary-deep:   #24b47e;
--primary-soft:   #4ade80;
--on-primary:     #171717;   /* near-black ON the green button, never white */
--canvas:         #ffffff;
--canvas-soft:    #fafafa;
--canvas-night:   #1c1c1c;
--canvas-night-2: #202020;
--hairline:       #dfdfdf;
--hairline-strong:#c7c7c7;
--hairline-cool:  #ededed;
--ink:            #171717;
--ink-mute:       #707070;
--ink-mute-2:     #9a9a9a;
--ink-faint:      #b2b2b2;
--on-dark:        #ffffff;
```

### Hard rules that must not be broken

1. Emerald appears **once per viewport as a filled button**, plus its allowed glow uses.
   Never as a section background on the white track.
2. The green button carries **near-black** text, never white.
3. Button radius is **6px everywhere**. Never pill shaped. Pills are only for status
   chips and tags.
4. **No gradients on the white track.** The only gradients on the site are the marquee
   edge masks and the faint dot wash inside the canvas.
5. Display type is **weight 500 with negative tracking**. Never 600 or above.
6. **Never more than two glowing elements in one viewport.** Beyond that it stops
   reading as a signal and starts reading as a screensaver.
7. Sentence case for all UI copy and headings. No unnecessary capitalisation.
8. **Zero em dashes anywhere.** Grep for `—` and `–`; both are banned in visible copy.

---

## 4. The page, block by block

Section padding is 96px desktop, 72px tablet, 56px mobile. Content holds at 1280px.

| # | Block | Anchor | Surface | What it is |
|---|---|---|---|---|
| 0 | Glass header | fixed | floating | One bar. Brand left, CTA right, chapters in the centre |
| 1 | Hero | `#hero` | white | Two columns, headline left, live looping canvas right |
| 2 | Trust strip | none | `canvas-soft` | Three items, each a 3D icon in a 56px plate |
| 3 | Automation stage | `#watch-it-run` | **dark island** | Auto playing canvas, run log, controls |
| 4 | Department selector | `#departments` | `canvas-soft` | Five tabs swapping a canvas |
| 5 | The work | `#the-work` | white | Four cost cards |
| 6 | Your time | `#your-time` | `canvas-soft` | Slider calculator plus a week grid |
| 7 | The build | `#the-build` | white | Four numbered steps |
| 8 | Integration marquee | `#what-we-connect` | **dark island** | Three drifting logo rows plus search |
| 9 | Results | absent | | Deleted on purpose, client case studies missing |
| 10 | The choice | none | `canvas-soft` | Three columns, third promoted |
| 11 | Trust chapter | `#your-data` | **dark island** | Three icon pillars, four promises, four tiles |
| 12 | Testimonials | absent | | Deleted on purpose, client quotes missing |
| 13 | FAQ | `#faq` | `canvas-soft` | Accordion, one open at a time |
| 14 | Closing CTA and footer | `#start` | white | Three field form, then footer |

Blocks 9 and 12 being absent is **correct**, not a bug. The brief says to delete a block
rather than invent filler when the client content is missing.

---

## 5. The checklist. Work through every line and give me a verdict on each

Screenshot at **320, 375, 768, 1024, 1440 and 1920**. Every box below needs a yes, a no,
or a "could not test", and every no needs an image.

### Layout and structure

- [ ] No horizontal scroll at any of the six widths. Nothing overflows at 320px.
- [ ] No clipped text, no text overlapping other text, no element escaping its container.
- [ ] No orphaned last words in headlines (a single word alone on the last line).
- [ ] Section rhythm is even. No section that is obviously too tight or too airy against
      its neighbours.
- [ ] Content is centred and holds its max width. Nothing drifts off axis.
- [ ] Every grid collapses cleanly. No 2px columns, no cards squashed to unreadable
      widths, no empty grid cells.
- [ ] Vertical spacing inside cards is consistent card to card.
- [ ] Icon plates are all identical: 56px, 8px radius, same border, same icon size, same
      optical weight. Any icon that looks bigger, smaller, off-centre or differently lit
      than its siblings is a finding.

### The one navigation bar

- [ ] Exactly **one** navigation bar at every scroll position, including over both dark
      islands. There must never be a second row or a chapter rail.
- [ ] Transparent over the hero. Glass after 12px of scroll. Height shrinks 60px to 52px.
- [ ] Chapter links crossfade in **only after the hero leaves the viewport**, not before.
- [ ] The active chapter underline lands on the right link and slides between links
      rather than jumping.
- [ ] The emerald progress line on the bottom edge grows with scroll and reaches full
      width at the page end.
- [ ] Over the three dark islands the bar flips to dark glass with white text, and the
      brand and CTA stay readable throughout the transition.
- [ ] Nav sits on one line at desktop. Bar height never exceeds 80px.
- [ ] Under 1024px the chapters move into a sheet and the bar keeps only brand and CTA.

### The automation stage, block 3

This is the centrepiece. Spend the most time here.

- [ ] It starts by itself the first time it is meaningfully in view. **No scrolling
      inside it, no clicking, no hover should be needed.**
- [ ] It plays through all four captions in order:
      1. `An order arrives from your store.`
      2. `Stock is checked. Nobody asked it to.`
      3. `The invoice writes itself.`
      4. `Your team is told. Elapsed: 1.2 seconds.`
- [ ] Captions crossfade rather than pop, and the caption line does not change height as
      the text changes (that would push the canvas down).
- [ ] The run takes roughly 7.5 seconds end to end.
- [ ] Only **one node glows at a time**. Count the glowing elements in the viewport at
      several moments during the run; never more than two.
- [ ] Connectors draw along their path, then settle. The drawn state is dimmer than the
      drawing state.
- [ ] At the end the canvas holds its completed state, the total counts up to `1.2s`, and
      a `Replay` control appears.
- [ ] Scrolling away mid run pauses it. Coming back **resumes from the same point** and
      does not restart. `Replay` restarts from zero.
- [ ] The run log under the canvas prints in sync with the canvas, one line per step.
- [ ] The `KineticGrid` background is visible behind the canvas but never competes with
      the node labels. The canvas card must be fully opaque over it.

### Canvas zoom, block 3 only

**The single most important interaction rule on the site:**

- [ ] **A plain mouse wheel over the canvas scrolls the page normally.** If the page
      stops scrolling when the pointer is over the canvas, that is a critical failure.
- [ ] `Ctrl` or `Cmd` plus wheel zooms, and zooms about the pointer, not the centre.
- [ ] The minus, plus, percentage readout and fit controls all work across 50% to 150%.
- [ ] No layout shift when zooming. Nodes must not re-render or reflow.
- [ ] No blurring or pixelation at any zoom level.
- [ ] Dragging pans, but only when the content is bigger than the frame. Cursor becomes
      grab, then grabbing.
- [ ] Keyboard: focus the canvas, then `+`, `-` and `0` work.
- [ ] Zoom resets to 100% after the section has been more than a screen height away.
- [ ] On touch: one finger scrolls the page, two fingers pan, pinch zooms.

### KineticGrid

- [ ] Renders in the automation stage **only**. It must not appear behind the hero, the
      marquee or the trust chapter.
- [ ] Does not render below 768px. A static dot grid appears instead.
- [ ] Does not render under `prefers-reduced-motion`. Static dot grid instead.
- [ ] Ripples fire only from clicks **inside that section**. Click elsewhere on the page
      and confirm nothing ripples.
- [ ] The animation stops when the section leaves the viewport and when the tab is
      hidden. Check the frame rate or CPU to confirm.
- [ ] The grid relaxes when the pointer leaves rather than freezing mid warp.

### HoverButton

Used in exactly three places, all on dark surfaces: the canvas `Run` control, the CTA
inside the automation stage island, and the CTA in the trust chapter.

- [ ] It appears **only** on dark surfaces. Any instance on the white track is a bug.
- [ ] Circles trail under the pointer, capped at 12 live at once.
- [ ] No circles on touch, and none under reduced motion. The button still works.
- [ ] Its height matches the green buttons on the white track. Radius is 6px, not a pill.
- [ ] The disabled state reads as disabled: dimmed, not-allowed cursor, no trail.

### Integration marquee, block 8

- [ ] Three rows drift at different speeds, rows 1 and 3 right to left, row 2 left to
      right.
- [ ] **No visible seam** where the duplicated tile set wraps. Watch a full loop.
- [ ] The edge fade masks cut cleanly on both sides at every width.
- [ ] Hovering one row pauses **only that row**. The others keep moving.
- [ ] Tiles are uniform: same size, same radius, logos optically centred and consistently
      sized. Flag any logo that is too large, too small, clipped, or has a white box
      behind it.
- [ ] Logos render in real brand colour.
- [ ] The tooltip appears on hover and on keyboard focus, and is readable.
- [ ] The headline reads `Plug your automations into 1,000+ tools you already pay for.`
      with `1,000+ tools` in glowing emerald. This is the only glowing headline on the
      site.
- [ ] Search filters to a static grid with names and a count line, and clearing restores
      the marquee. Reachable and operable by keyboard.
- [ ] Two rows under 768px, three above. Tiles 56px mobile, 64px tablet, 72px desktop.
- [ ] Under reduced motion all rows freeze at their start position and stay readable.

Two marks, **Freshdesk** and **Jotform**, are deliberately absent: no official SVG exists
in any open registry. 58 marks ship, not 60. Not a bug, but confirm nothing looks like a
gap or a broken image where they would have been.

### Department selector, block 4

- [ ] All five tabs work in sequence: Finance, Sales, Operations, Support, HR.
- [ ] No layout shift when switching. The panel must not jump in height.
- [ ] No stuck animation if you click tabs quickly.
- [ ] The active tab carries an emerald underline.
- [ ] The Support tab shows the conversation player, not a canvas. Bubbles enter cleanly,
      the typing indicator appears before each outbound message, the loop restarts
      without a visible glitch.
- [ ] On mobile the tabs are a horizontal snap row that does not overflow the page.

### Calculator, block 6

- [ ] Drag every slider to both extremes. No `NaN`, no negative numbers, no digits
      overflowing their container, no absurd figures.
- [ ] Numbers count up smoothly on change rather than snapping.
- [ ] The week grid fills from the bottom of Monday onward with a visible stagger.
- [ ] The cost result stays hidden while the hourly cost field is blank, and appears with
      the right currency symbol once filled.
- [ ] Sliders are fully keyboard operable and the focus ring is visible.

### FAQ, block 13

- [ ] Opens and closes with no height jump and no scroll jump.
- [ ] Only one panel open at a time.
- [ ] The animation is smooth (it uses `grid-template-rows`, not `max-height`).
- [ ] Hairline separators only. No card chrome.

### Type, colour and craft

- [ ] Headlines are weight 500 with negative tracking. Nothing renders at 600+.
- [ ] Green buttons have near-black text. Check the computed colour, do not eyeball it.
- [ ] Button radius is 6px everywhere. No pills except status chips and tags.
- [ ] Body copy line length stays readable. Nothing runs edge to edge on wide screens.
- [ ] Text contrast passes AA everywhere, especially `--ink-mute` on `--canvas-soft` and
      `--ink-mute-2` on `--canvas-night`.
- [ ] No gradients on the white track.
- [ ] Emerald appears once per viewport as a filled button.

### Motion and accessibility

- [ ] Section reveals fire once, stagger sensibly, and never leave an element stuck
      invisible. Scroll fast and slow, and scroll back up.
- [ ] Nothing animates on every scroll pass. No parallax, no scroll hijacking, no pinned
      sections.
- [ ] With `prefers-reduced-motion: reduce`: nothing moves, everything is legible, the
      marquee is frozen, the grid is static, the canvas renders completed with the log
      printed, and `Replay` is hidden.
- [ ] Tab through the entire page. Focus is always visible, order matches visual order,
      and focus is never trapped. The mobile sheet must return focus correctly.
- [ ] Focus ring is 2px emerald at 3px offset.
- [ ] Touch targets are at least 36px, and 44px for the primary CTA.
- [ ] Console stays clean while interacting. No errors, no warnings, no leaked listeners.

### Performance

- [ ] Run Lighthouse and report all four scores. Targets: 95+ on performance,
      accessibility and best practices. LCP under 2.0s, CLS under 0.05, TBT under 200ms.
- [ ] Confirm the automation stage and `KineticGrid` are lazily loaded and not blocking
      first paint.

---

## 6. Two things I want your opinion on

These are open questions, not bugs. Give me a straight recommendation on each.

1. **The trust chapter icon count.** The brief says exactly 19 3D icons, three of them in
   the trust chapter. But that section has four tiles and four written promises, so three
   does not divide evenly into anything. I resolved it by putting the three icons on a
   three-up pillar row under the headline (Ireland, Our own AI, Yours), leaving the four
   tiles and four promises as text. Look at it and tell me whether it reads as designed
   or as a section with a missing fourth thing.

2. **The hero canvas proportion.** The hero right column holds a compact three node
   canvas in a diagonal cascade. Tell me whether it fills its column convincingly at
   1440px and 1920px, or whether it reads as a small object floating in a large card.

---

## 7. The report I need back

Write it to `autonomy/VISUAL-QA-REPORT.md`. Structure it exactly like this:

### A. Verdict

Two or three sentences. Is this shippable to a new client as is, shippable after fixes,
or not shippable. Say which.

### B. Blocking issues

Anything that makes the page look broken, unfinished or amateur to a first time visitor.
For each one:

- What is wrong, in one sentence
- Which block and which viewport
- The screenshot path
- Why it matters
- What you think the fix is

Order these worst first.

### C. Craft issues

Things that are not broken but are not good enough: uneven spacing, misaligned icons,
inconsistent optical weight, a hairline that is too heavy, a line length that is too
long, a transition that feels wrong. Same format as above. These are what separate a
page that works from a page that looks expensive, so do not soften them.

### D. Checklist results

The full checklist from section 5 above, every line, with yes, no or could not test. No
skipping. If you could not test something, say why.

### E. Per viewport notes

One short paragraph each for 320, 375, 768, 1024, 1440 and 1920, with the screenshot
paths. Say what specifically breaks or degrades at each width.

### F. Lighthouse

All four scores plus LCP, CLS and TBT. If anything is under target, name the specific
cause.

### G. Answers to my two questions

From section 6.

### H. What is genuinely good

Short. I need to know which parts are working so I do not accidentally change them while
fixing the rest.

---

## 8. How to judge

Judge it as a design lead would judge work about to go in front of a paying client who
has already rejected proposals for feeling templated. The bar is not "does it function".
The bar is: does every element look deliberate, is every edge clean, does the spacing
have a rhythm, does the motion feel like it was choreographed by one person in one
sitting, and does nothing on the page look like a default.

Be specific and be blunt. "The spacing feels off" is useless. "The gap between the trust
strip and the automation stage is 96px while every other section boundary is 56px, so the
strip reads as detached" is what I need.
