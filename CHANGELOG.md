# Indrakosh landing page — change log

Every change I make to this app gets an entry here and a matching git commit on
the `feat/landing-chapters` branch, so nothing is a mystery later and everything
is reversible.

## How to undo

Each entry below names its commit. Nothing here has been pushed, so all of it is
local and safe to rewrite.

**See what changed in a commit**

```bash
git show --stat <commit>
```

**Undo one change, keeping everything after it** — this is the safe default. It
creates a new commit that reverses the old one; history stays intact.

```bash
git revert --no-edit <commit>
```

**Go back to how the site looked at a given entry**, without losing later work:

```bash
git switch --detach <commit>
```

Then `git switch feat/landing-chapters` to come back to the latest.

**Throw away everything since an entry** (destructive — only when you're sure):

```bash
git reset --hard <commit>
```

**Undo just one file**, leaving the rest of the change in place:

```bash
git checkout <commit> -- apps/landingpage/app/globals.css
```

**Undo uncommitted edits** since the last entry:

```bash
git restore apps/landingpage
```

**Get back to the branch tip if you get lost** — every commit stays recoverable
in `git reflog` for 90 days, including after a `reset --hard`.

```bash
git switch feat/landing-chapters
```

---

## 2026-08-22 · `650f68c` — Four-layer index out of the hero, "View products" in

**The hero stops saying it twice.** STRUCTURAL / SURFACE / AMBIENCE / LIVING sat
out on the hero's centre line as a stacked micro-list, mirroring the
reference's roles column. Removed at the client's request. The four layers keep
their own full section further down — verified, four panels still there — so
nothing is lost from the page; the hero simply stops introducing a list it is
about to present properly a few screens later.

Cleaned out completely rather than hidden: the JSX, the `hero.index` data, both
positioning media queries, the arrival transition (which the scroll label
shared and keeps), and the `noscript` fallback rule. Zero `hero-index`
references remain, and "Structural" no longer appears anywhere in the hero.

**A second action beside the CTA.** "View products" anchors to the wall section
— "Everything, under one roof" — which is the closest thing on this page to a
product index, and it now carries `id="products"`. Verified end to end: the
click lands the section 8px from the top of the viewport, through the page's
own scroll spring, so it glides rather than jumps.

Deliberately NOT a second pill. Two identical buttons make neither of them
primary, and planning a visit is what this business actually wants from the
page — browsing is the lower-commitment step and should look like it. So this
is a link with an underline that wipes in from the left, sitting beside the
button rather than competing with it. It inverts with the rest of the chrome
over the cream sections, and it is hidden below 620px where there is no room
for both beside the wordmark.

### Verified

| | |
|---|---|
| Hero index | 0 elements; "Structural" absent from the hero |
| Layers section | still 4 panels, untouched |
| Buttons | "View products" at x=1248, "Plan a visit" at x=1389 |
| Anchor | click lands `#products` 8px from viewport top |
| Mobile | secondary action hidden below 620px |
| Overflow | none at 1600 or 390 |
| Console | clean apart from the three known unlicensed-font 404s |

**Undo this entry**

```bash
git revert --no-edit 650f68c
```

---

## 2026-08-22 · `0311f46` — Chapter body copy up 59%, and a finding about the type

The four chapter paragraphs were set at **13.6px**, sitting under a 70px
statement. That six-to-one gap is right for a micro-label and wrong for the
only prose in the section — it read as a footnote to the picture rather than as
the thing worth reading.

Now **21.6px** on 32.4px leading, tracking opened very slightly (light-set type
closes up at this size otherwise), measure tightened from 32ch to 30ch, and the
body's grid slot widened from 4 columns to 5 in three of the four arrangements
to hold it. Measured: 360px wide, 130–162px tall, no overflow at 1600 or 390.

It fixed something incidental too. The Sweep word-lighting was running at
13.6px, where a per-word opacity gradient is essentially invisible. At 21.6px
you can see the reading light travel through the sentence, which is the entire
point of that effect.

### The finding: nothing on this site is actually set in a light weight

Asked for a "more stylish font", I checked what is really loaded before
changing anything, and the answer is uncomfortable:

```
Arimo 400 loaded
Arimo 500 / 600 / 700 unloaded
IK Display 500 700  error
IK Text    300 400  error
IK Accent  600      error
```

The three `IK` faces are the brand's own — Neue Haas Grotesk Display Pro and
Cocogoose — and they 404 because neither is licensed for web yet. Everything
falls through to Arimo. **Arimo has no weight below 400.**

Twelve rules in this stylesheet ask for `font-weight: 300`: the chapter
statements, the beats, the manifesto, the wall headline, the founder statement.
Every one of them renders at 400. The hairline-at-large-size quality that the
reference gets from Gotham Thin, and that I have described in these entries as
"thin" and "hairline", is not currently on the page at all and cannot be until
either the Neue Haas licence lands (it has 45 Light and 35 Thin) or the
stand-in changes.

Recording it rather than quietly working around it, because it means a real
part of the intended look is still pending on the font licence, and because I
have described that look as delivered in earlier entries when it was not.

**Undo this entry**

```bash
git revert --no-edit 0311f46
```

---

## 2026-08-22 · `9c97a68` — Toggle removed, chapters rebuilt as clusters, quiet type

Backed up first: tag `backup/pre-layout-rework-2026-08-22` and
`backups/landingpage-pre-layout-20260822-1555.tar.gz`.

### 1 · The imagery toggle is gone

Cut at the client's request — "without image it not look good" — and they are
right. The whole page is composed *against* that moving photographic ground:
the chapter statements lapping lit timber, the scrims, the grain, the way each
section hands over to the next. Strip it out and what is left is not a more
austere version of this page, it is this page with its subject missing.

Removed in full rather than disabled: `Mode.tsx`, `lib/mode.ts`, the blocking
`<head>` snippet, `suppressHydrationWarning` on `<html>` (its reason is gone),
the ink-mode CSS block and the switch styles. `Backdrop` is unconditional
again. Verified: zero `data-mode` references remain, `.modesw` is absent, and
all six plates are back.

`lib/light.ts` and `LightSurface` stay — the chrome inversion over the cream
sections is unrelated and still needed.

### 2 · Chapters are clusters now, not columns

The client's side-by-side recording made the gap obvious, and it was
compositional rather than technical. The reference never puts one picture
beside one column of text. It scatters **two or three frames at different
sizes**, lets them bleed off opposite edges at different heights, and drops the
statement into the negative space between them, lapping their edges.

One picture plus one text column is a layout. Three pictures at three scales is
a composition, and that is the whole difference in pull.

So each chapter carries three frames now, in four arrangements that never
repeat and are never symmetrical, each bleeding a different frame off a
different edge. Measured at 1600×900 — chapter 01 alone runs 782×414, 659×558
and 579×306, and every chapter's set differs.

**The sticky pin is gone with it**, and this is worth flagging because it was
something previously asked for ("until the text goes out the image does not
even move"). It cannot survive the new layout: pinning made sense when there
was exactly one frame to hold still, and three frames meant to drift past each
other at different rates have nothing to pin to. What replaces it is parallax
at three separate rates — 7 / 16 / 26 — which is what makes the cluster read as
depth rather than as a pile. The copy still waits for the lead frame to arrive,
and still latches.

**Swapped a frame while building it.** `still.webp` is described in its own alt
text as "a dark still life in raking light". It is actually a yellow sunflower
against a white wall, and dropped into the chapter 03 cluster it punched
exactly the high-key hole the image README warns about — the same reason
`brass-hook.webp` was excluded early on. Replaced with `door-gold.webp`.
Verified: no chapter references `still` any more.

### 3 · A quieter animation for the beats and the manifesto

Everywhere else Kinetic swings each word up on a real `rotateX(-62deg)` out of
a 5px blur, and at chapter scale that reads as weight. On these two screens the
type IS the screen — nothing else is on it — and the same treatment turns into
a great deal of machinery happening to a great many very large letters.

Now: the lines rise out of their own mask and stop. No rotation, no blur, no
fade. Opacity stays at 1 deliberately — the mask does the hiding, and a word
that fades *as well as* rises is announcing the effect rather than delivering
the line.

Confirmed in the computed values mid-flight: `matrix(1, 0, 0, 1, 0, 70.4)` →
`matrix(1, 0, 0, 1, 0, 63.3)`. A plain 2D translate, no `matrix3d`, opacity 1,
filter none — which is exactly what "minimal" should measure like.

### Verified

| | |
|---|---|
| Toggle | absent; zero `data-mode` refs; six backdrop plates restored |
| Clusters | 3 frames per chapter, all differently sized, 4 arrangements |
| High-key frame | `still.webp` no longer appears in any chapter |
| Quiet type | 2D translate only, opacity 1, filter none |
| Frame pacing | p95 7.1ms, 0.4% late |
| Horizontal overflow | none at 1600 or 390 |
| Page length | 16.7 viewports desktop, 18.3 mobile |
| Console | clean apart from the three known unlicensed-font 404s |

Mobile grew from 16 to 18.3 viewports: the cluster collapses to a single column
in reading order there, so it is three stacked frames per chapter instead of
one. Three overlapping frames need horizontal room to be a composition; on a
phone they would simply be three pictures on top of each other.

**Undo this entry**

```bash
git revert --no-edit 9c97a68
```

Or return to the backup point entirely:

```bash
git checkout backup/pre-layout-rework-2026-08-22
```

---

## 2026-08-22 · `828e775` — An imagery switch, a founder section, and the type finally given the screen

Backed up first: tag `backup/pre-ink-toggle-2026-08-22` and
`backups/landingpage-pre-ink-20260822-1525.tar.gz`.

### 1 · Two grounds, one switch

A `role="switch"` in the header. **On** is the page as built — the fixed
photographic stack cross-fading behind everything. **Off** is *ink*: no backdrop
at all, flat near-black, and the type carries the whole page. That is the
register nabilissa.com works in, and it is a genuinely different kind of
premium — there is nothing to hide behind, so the setting has to be right.

Content photography stays in both. It is the *ground* that changes.

Two things worth keeping:

- **It unmounts, it does not hide.** `display: none` would have been one CSS
  line and would have left six full-viewport images decoded in memory and a
  per-frame damped follow still running against elements nobody can see. The
  point of the mode is that the page stops doing the work. Measured: 30 images
  in the DOM becomes 24, and `.backdrop` is absent rather than invisible.
- **A blocking snippet in `<head>` applies the stored mode before first paint.**
  Without it the page always paints photographic and corrects itself after
  hydration, so anyone who chose ink gets a flash of the photo ground on every
  navigation. `suppressHydrationWarning` on `<html>` because React correctly
  reports the attribute the snippet stamped as a server/client mismatch — that
  is intended, and this is the sanctioned way to say so.

Almost all of ink mode is **removal**. Half the treatments on this site exist to
fight a photograph — scrims, wells, pools of shadow, a wide soft text-shadow
sized to survive a chapter statement lapping sunlit timber. On flat black each
one becomes a faint grey smear announcing where a problem used to be. The
discipline of the mode is deleting them, not restyling them.

### 2 · The specimen index is now a light surface

Dense tabular information is the one thing on this page that genuinely reads
better on paper than on night — it is the argument the whole second site is
built on, and it holds here. It also gives the descent a second beat of
daylight, so the wall is no longer the only one.

Measured on the cream ground: names 15.55:1, metadata and numerals 4.83:1,
heading 15.55:1, the seal-brown hint 6.31:1. All clear AA.

The chrome inversion therefore had to stop belonging to the wall. It now lives
in `lib/light.ts` as a shared registry with one frame loop for all light
surfaces, testing coverage of the header's real box rather than overlap.
Verified: `data-light` is true over the specimen and the wall, false over the
founder and the layers.

### 3 · A founder section, from the reference recording

Full-bleed monochrome portrait bleeding off the left edge, a large thin
statement lapping its lower right, a narrow column of small copy, and a
signature slot. The scale gap between statement and body — about six to one —
is most of the effect; set the copy larger and the two argue.

Monochrome for the same reason the reference is: it separates the one person on
the page from all the warm timber photography around him without needing a
frame. Measured: the statement laps the portrait by 448px.

**All of it is placeholder and none may ship.** The portrait is `maker.webp`, a
stranger from a free stock pool, already flagged in `public/img/README.md`; it
must not appear under a real person's name. The words are mine, written in a
voice whose questionnaire has been outstanding since the first build. There is
no signature — the mark and attribution stand in until somebody sends a scan.

A studio headshot would have been closer to the reference. Every free source
reachable from here — Wikimedia Commons, Openverse — returned archival
nineteenth-century plates, and a maker at the bench suits a timber merchant
better than a generic stock portrait would have.

**The reference's press-logo ticker is deliberately not built.** Indrakosh is
Est. 2025 and has no press. Inventing mastheads is the kind of claim a
competitor checks, and it is the same mistake as the "240+ materials" figure
that was cut earlier. The slot is trivial to add the day there is something true
for it.

### 4 · The beats and the manifesto, rebuilt against the reference

Stepping the two recordings side by side, the gap was not motion. It was the
deal between type and ground.

The reference gives its statement the **entire screen on clean black**: stacked
lines, hairline weight, enormous, tight leading, last line in accent, nothing
else present. Ours put medium-weight type at half that size directly on a busy
end-grain photograph — so the type never got to dominate and the photograph
never got to be looked at. Both lost.

Three changes, in order of how much they mattered:

1. **Clear the ground.** A scrim under these two sections only, fading out at
   both edges so there is no seam. The backdrop is still continuous; for one
   screen it is a stage rather than a subject.
2. **Weight and case.** Weight 300, uppercase, with tracking *opened* — the
   −0.035em that suited the lowercase display setting jams capitals together.
3. **Leading 0.94**, so the lines lock into a single mass.

The stair and the closing line breaking to the far side are kept.

**And then I made it too big and had to measure my way back.** The first cut at
7.4vw came out at 105.6px, which measured **844px of block in an 810px
viewport** — the closing line was simply off-screen at every desktop width.
That is a worse failure than being too small. Capitals at weight 300 with tight
leading already carry the reference's character; the extra 30px was buying
nothing. Now 72px, and the block measures 452px at 1600×900, 452px at 1440×810
and 402px at 1280×720 — fits everywhere.

### A performance scare that was not one

The first frame-pacing run after all of this read p95 13.9ms against 7.2ms
before, and a single-shot A/B appeared to blame the founder portrait's
`grayscale()` filter. It also reported that *removing* the new scrims and
*removing the whole founder section* made things **worse** — which is
impossible, and was the tell.

Re-run properly as three interleaved pairs so machine drift cancels:

```
with grayscale   p95: 7.2, 14.0, 7.1   median 7.2
without          p95: 7.1, 14.1, 7.1   median 7.1
```

Identical, and both series carry the same bimodal 7 / 14 / 7 pattern. That is
the machine, not the page. **There is no regression**; p95 is ~7.2ms exactly as
before. Recording it because I nearly optimised away a filter that costs
nothing, on the strength of one unpaired sample.

### Verified

| | |
|---|---|
| Imagery switch | plates 6 → 0, backdrop unmounts, 30 → 24 images, survives reload, round-trips |
| Ink ground | `rgb(14, 5, 2)`, scrims and text-shadows dropped |
| Specimen on cream | 15.55 / 4.83 / 4.83 / 6.31 — all clear AA |
| Chrome inversion | true over specimen and wall, false over founder and layers |
| Founder | 3 lines, brass accent, monochrome, laps the portrait by 448px |
| Beats block | 452 / 452 / 402px against 900 / 810 / 720 viewports |
| Frame pacing | p95 7.2ms (paired median), no regression |
| Horizontal overflow | none at 1600 or 390 |
| Console | clean apart from the three known unlicensed-font 404s |

**Undo this entry**

```bash
git revert --no-edit 828e775
```

Or return to the backup point entirely:

```bash
git checkout backup/pre-ink-toggle-2026-08-22
```

---

## 2026-08-22 · `76455ab` — The specimen index, the quadriptych, and an audit of everything that was not premium

Backed up first, two ways: tag `backup/pre-premium-pass-2026-08-22`, and
`backups/landingpage-20260822-1504.tar.gz` outside git.

### 1 · The sideways materials band is gone; a specimen index replaces it

Ported from the paper edition (`landingpage2`) and restyled for the night
ground. The reason it is a straight win: the band was seven photographs going
past, and you could not learn a single fact from it — not what a material was,
where it came from, or what it was for, which is the only question somebody
standing in a showroom is actually asking. Now the pictures are a preview that
follows the cursor, so nothing is lost and the content arrives.

It also gave the page something it needed structurally: **one settled ground.**
Everything else floats over the moving backdrop, and floating dense information
over a photograph is exactly how the four-layer section became unreadable. Data
gets a surface. The well is a gradient, not a panel, so there is no seam and the
page still reads as one continuous descent.

`.slab` and the strip's `label` are retired with it. `Strip.tsx` stays — the
wall still uses it.

### 2 · Audit of the whole site, at 1600×900, nineteen screens

Walked the entire page and looked at every screen. Four things were not good
enough, and all four are fixed.

**The four layers were the worst thing on the page.** Four headings and four
sentences floating directly on the moving backdrop, half a screen of dead air
between each, and body copy that was effectively unreadable wherever the plate
behind it happened to be lit. No imagery at all, in the section that is the
brand's own spine.

Rebuilt as a **quadriptych**: four tall panels side by side, each with its own
picture, the number in the corner and the text standing on a graded floor. Text
on a photograph needs its own ground and these panels bring one. Nothing else on
this site is composed as a row of equals — every other section is deliberately
asymmetric — which is the second reason for it: the four layers *are* a set of
four, so this is the one place where symmetry says something true.

The body copy is held back until you point at a panel, so a four-across row
reads as four titles rather than four paragraphs competing for one glance. On
touch, where there is no hover, it is simply always shown.

**The closing statement sat on the brightest part of the salon plate** — cream
type on a lit curtain. It now has a soft elliptical pool of ground under it:
invisible where the plate is already dark, doing the work where it is not. No
panel edge.

**Content was colliding with the fixed chrome.** The right-aligned manifesto ran
straight through the "Plan a visit" pill. The header scrim alone could not fix
it, because the pill is a bordered shape with type inside it, so anything
passing behind reads as interference rather than as depth. The pill now carries
its own blurred ground, and the header scrim is deeper and reaches further.

**The chrome inversion was firing on overlap rather than coverage.** Introduced
last entry: an IntersectionObserver against the top 9% of the viewport, which
fires the moment the cream band *touches* the header. So on the way out, the
chrome stayed inked while only its top 40px were still over cream and its lower
half was already over the dark section — ink on ink, for about 90px of scroll.

The question is not "does the band touch the header" but "does the band cover
it", so it now measures exactly that against the header's real box instead of a
percentage guess. Verified across the whole handover: `light` matches
`coversHeader` at every sampled position, with the flip between offsets 2560 and
2640.

### Two mistakes I made in this pass and had to repair

Worth recording because both were self-inflicted and both were caught by
reading the file rather than by the page looking wrong.

- A comment inserted before `.top-cta {` matched **`:root[data-light] .top-cta`**
  first and spliced itself into the middle of that selector. CSS permits
  comments between selector parts, so it parsed cleanly as a descendant
  selector — meaning the dark pill ground applied *only* over the cream wall,
  the exact inverse of the intent, with no error anywhere.
- The same replacement ran on **both** occurrences, leaving the base rule with
  two `transition` declarations where the later one silently won.

### Verified, headless Chrome

| | |
|---|---|
| Specimen index | 8 rows, all exactly 69px, `.slab` count 0 |
| Cursor preview | lights the correct row, follows, brass hover `rgb(217,180,120)` |
| Quadriptych | 4 panels, 4 images, body reveals to 144px on hover, always open on touch |
| Chrome inversion | matches header coverage at every sampled offset |
| Frame pacing | 1067 frames, median 7.0ms, p95 7.2ms, 0.3% late |
| Horizontal overflow | none at 1600 or 390 |
| Page length | 16.7 viewports desktop, 16 mobile |
| Console | clean apart from the three known unlicensed-font 404s |

**Undo this entry**

```bash
git revert --no-edit 76455ab
```

Or return to the backup point entirely:

```bash
git checkout backup/pre-premium-pass-2026-08-22
```

---

## 2026-08-22 · `69ba5c5` — Fix: the wall was not moving at all

Reported as "this part is not moving", and it was — the wall sat dead still
through its entire section. Measured before touching anything:

```
WALL  bandClientW 3114   trackScrollW 3114   distance 0
```

`distance` is `scrollWidth − clientWidth`, so at zero there was literally
nowhere to travel and the transform stayed at 0 the whole way through.

**Cause, and it was mine.** I gave `.wallwrap .strip` `overflow: visible` in the
previous entry so the cards' drop shadows and vertical offsets would not be
clipped. But `.strip-pin` is a grid, and its single column was the implicit
`auto` — which sizes to its items' max-content. The item contains a
`width: max-content` track, so the column blew out to the track's full 3114px
and stretched the band to exactly the track width. Band width and track width
being equal is precisely the state in which nothing can move.

The materials strip was only escaping this by accident: its `overflow: hidden`
makes it a scroll container, and a scroll container's intrinsic contribution
ignores its overflowing content, so its column stayed at the viewport width.
That is a load-bearing side effect of an overflow value chosen for a completely
unrelated reason, which is not something to leave in place.

**Fix:** pin the column explicitly on the shared `.strip-pin` —
`grid-template-columns: minmax(0, 1fr)` — so neither band depends on its
overflow value to get its width right.

After, at 1920×950:

| | band | track | distance | travel across the runway |
|---|---|---|---|---|
| Materials strip | 1920 | 3272 | 1352 | 0 → −342 → −680 → −1018 → −1356 |
| The wall | 1920 | 3114 | 1194 | 0 → −302 → −601 → −899 → −1198 |

The strip's numbers are unchanged from before the fix, which is the check that
matters — the shared rule did not disturb the band that was already working.
No horizontal overflow (1920/1920), no page errors.

**Undo this entry**

```bash
git revert --no-edit 69ba5c5
```

---

## 2026-08-22 · `52501a9` — The nav stops fading, the copy waits for the picture, and the page finally goes to daylight

**1 · The nav holds one weight while it travels.** The scrim under the header
was ramping from 0 to 1 across the entire rise, so the nav appeared to be fading
in the whole way from the centre line to the top. Removed. It now travels at a
constant weight and the scrim arrives only in the last few percent, once it is
home. Nothing about the nav should be *becoming* anything while it moves — it
should simply be moving.

Measured, top/opacity/scrim: `358/1/0 → 262/1/0 → 149/1/0 → 53/1/0 → 0/1/1`.

**2 · The beats and the manifesto stopped stacking on one margin.** Two blocks
of large type hard against the same edge read as one long column that happens to
have a gap in it. The four beats now walk — each line steps further in than the
last — and the closing line breaks the pattern by jumping to the far side at a
larger size. Three lines establish a rhythm so the fourth can refuse it, which
is what makes "And then silence." land as a turn rather than as a fourth item in
a list. The manifesto answers from the right edge.

Measured left edges: `72 → 137 → 202`, then the last beat at `655`, manifesto
`776–1368` in a 1440 frame.

Also fixed an outright contradiction: `.mani-t` was set `text-align: center`
directly underneath a comment explaining that nothing here is ever centred. The
comment was right.

**3 · The pictures are much bigger, and the copy waits for them.** Media height
went from 68svh to 86svh (697px measured at 810), pinned nearer the top, on
wider columns. The previous size left a band of empty page above and below each
one, which made them read as illustrations dropped into an article rather than
as the thing you are looking at.

The gate is the more important half. The copy used to fire off a fixed 1020ms
timer started when the image first became visible — a guess dressed up as a cue,
and one that falls out of step the moment you change scroll speed. `Chapter.tsx`
now watches the media's top edge each frame and opens the gate only once it has
settled against its sticky offset. It latches, so scrolling back up does not
un-reveal the words; text that re-hides when you reverse reads as a bug.

Measured, mediaTop → state(bodyOpacity):
`500→wait(0)  260→wait(0)  60→wait(0)  49→IN(0)  49→IN(0.13)  −52→IN(0.99)`.
The words do not exist until the picture has stopped at 49 and nothing before.

**4 · All four chapters** are one component now, so this is the behaviour
everywhere rather than four copies that will drift apart.

**5 · The strip has a focus.** Each frame grows and lights as it reaches the
middle of the screen and returns to normal as it carries on left, so the band
always has exactly one subject and the rest are context — a spotlight travelling
along the strip rather than a row of equals sliding past. Smoothstepped, so the
peak is rounded rather than a cone with a point on it at dead centre.

The measurement is cached against a ResizeObserver rather than read per frame:
`getBoundingClientRect()` on every slab on every frame is a forced synchronous
layout per slab per frame, and it is entirely avoidable — the slabs never move
relative to the track, so their centres are constants plus the track's translate.

Measured `--f` across the band: `0, 0, 0.446, 0.898, 0.013, 0, 0`. One subject.

**6 · "Everything, under one roof" is now a wall.** Rebuilt from the attached
recording, which is worth describing precisely because almost none of it is a
carousel: the covers are big, each is rotated a degree or three off square, they
overlap each other *and* the headline, they sit at different heights, and the
whole thing is on a light ground while the rest of that site is black.

That last part is why this section exists in this form. **The Brand Guidelines
say to use cream and warm neutrals as the foundation. This page has been dark
throughout, and I have flagged that contradiction since the first pass.** One
full-height cream surface in the middle of the descent settles it honestly: the
page goes to the brand's own ground for its one moment of daylight, and coming
back out into the dark afterwards makes both read stronger than either alone.

It also finally gives `--seal` somewhere to live. It is a brand colour the
guidelines permit on light surfaces only, so on a black page it had nowhere to
go — 2.46:1 on the night ground, **6.32:1 here**, which clears AA for body.

Same physics as the materials band (pinned, sprung, centre-focused), a
completely different skin — one implementation, two surfaces.

Three things had to be fixed after the first cut, all of them caught by looking:

- **Cards overflowed the pin.** Width-driven sizing plus an aspect ratio is how:
  a 31vw card at 3/4 is 600px tall before the focus scale multiplies it. Now
  sized by height, so the tallest possible card — biggest size, full focus, at
  its furthest vertical offset — still lands inside. Measured card tops
  226–341 in an 810px pin.
- **The headline was completely buried.** The point of putting type behind the
  pictures is that you can still see enough of it to finish the sentence
  yourself; three lines with all three covered is a rendering fault, not depth.
  Two lines now, with the first clear above the cards and the second lapped.
- **The header vanished.** Cream chrome on a cream ground. `Strip.tsx` now sets
  `data-light` on the root for exactly as long as a light band is under the
  header — watching the top sliver of the viewport, not plain visibility, or the
  header would invert while the band was still at the bottom of the screen.
  Measured: nav colour `rgb(26,10,4)` over the wall, cream everywhere else.

Real drop shadows on the cards, which are legal here and nowhere else on this
site: on the night ground a shadow is invisible, so cards would be floating on
nothing; on cream it is what lifts them off the surface.

### Verified, headless Chrome, 1440×810

| | |
|---|---|
| Nav rise | opacity constant at 1 throughout; scrim 0 until navTop = 0 |
| Chapter gate | copy hidden at mediaTop 500/260/60, reveals at 49 |
| Media height | 697px (was ~550) |
| Strip focus | 0, 0, 0.446, 0.898, 0.013, 0, 0 — one subject |
| Wall | cream #eee6d7, 8 cards, rotations −3.4° to +3.2°, widths 232–338 |
| Chrome inversion | ink over the wall, cream elsewhere |
| Beat stagger | 72 → 137 → 202, last at 655; manifesto 776–1368 |
| Horizontal overflow | none (1440/1440) |
| Page length | 19.1 viewports |
| Console | clean apart from the three known unlicensed-font 404s |

**Undo this entry**

```bash
git revert --no-edit 52501a9
```

---

## 2026-08-21 · `e378f54` — Smooth scroll, pinned chapters, and text that stops being flat

Six things were asked for. All six are in, and every one of them was measured
rather than eyeballed — the numbers are at the bottom.

**1 · The scroll itself is now sprung, and that is the whole answer to "add a
smooth delay to everything that moves with the scroller".**

Reading the reference site's own stylesheet settles what it was doing: it runs
**Lenis**, and it declares one curve — `--default-ease: cubic-bezier(.83,0,.17,1)`
— which it then uses on very nearly every transition it has. The Lenis part is
the important half. On that site the *scroll position itself* is a damped follow
of the wheel, so every scroll-linked animation on the page inherits the
smoothing for free. Ours were reacting to raw wheel deltas, which arrive as
coarse ~100px steps. You cannot ease your way out of a stepped input, which is
why adding easing to individual animations had not fixed the feel.

So the smoothing now happens at the source: `app/lib/smooth.ts`. It drives the
**real** scroll position via `scrollTo()` rather than transforming a wrapper —
the usual shortcut, and one that silently kills `position: sticky` and
`animation-timeline: scroll()`, both of which this page depends on heavily.
The physics is a critically damped spring (ω = 12 rad/s), not a lerp: a lerp
moves at full speed on its first frame, so it has no inertia and the start of
every scroll is a step. ζ is exactly 1 — any overshoot at all would mean the
page drifts past where you stopped, which reads as broken rather than as luxury.

Measured: one 400px wheel notch now plays out over **129 frames**, travelling
3px in the first 7ms, peaking near the middle, and landing exactly on 400.
Before, it was one 400px jump in a single frame.

Left alone on touch on purpose — native momentum scrolling on a phone beats
anything synthesised, and "sync touch" is where smooth-scroll libraries earn
their reputation. Verified off: `pointer: coarse` → smoothing disabled.

**2 · The text was flat because it was sliding.** Every word rose straight up
the Y axis and faded, on the same plane at the same angle, so twelve of them
read as one block wiping on. Each word now lies face-down below its own mask
line and swings up onto the page — a genuine `rotateX(-62deg)` on a 900px
perspective, hinged at its own baseline, coming out of a 5px blur on the
reference's easeInOutQuint. You can see the word *turn*, so it has a front and a
back and it occupies space. Confirmed in the computed matrices mid-flight:
`matrix3d(1,0,0,0, 0, 0.863, -0.505, …)` resolving to identity, staggered per
word, blur 4.5px → 0.

Body copy got the *other* half of the reference's treatment, and it is a
different idea — `app/components/Sweep.tsx`. Stepping the reference, the tail of
every paragraph is visibly dimmer than its head and resolves as the block rises.
That is not an arrival, it is a reading light travelling through the sentence
under your control. Each word derives its own opacity from two custom properties
on the parent, so a frame costs one property write on the container rather than
one per word. Measured on a 29-word paragraph: a clean six-word gradient,
1 → 0.91 → 0.74 → 0.58 → 0.41 → 0.24 → 0.13.

The floor is 0.13 rather than 0 deliberately — text that is genuinely invisible
until you reach it reads as a loading failure.

**3 · The four-figure stat row is gone.** The client was right that it did not
make sense. Three of the four were restating things the page already says better
in prose, the row read as a dashboard bolted onto an essay, and the fourth
("240+ materials") was a number I invented as a placeholder and had flagged as
such — a fabricated inventory figure is exactly the kind of claim a competitor
checks. `figures` is left in `data.ts` in case the real numbers ever arrive;
`Tally` is now unused.

**4 · The chapter pictures are pinned.** The picture wipes in, holds, and then
does not move again until the last line of text beside it has left the screen —
at which point the next chapter's picture rises to replace it and pushes this
one off. `position: sticky` on the media column, with the copy column tall
enough to sustain it.

The detail that makes or breaks this: `align-self: start`. A grid item is
stretched to its row by default, and a sticky element with no room inside its
own box can never stick — left stretched, the picture drifted with the copy and
the whole idea collapsed silently.

Measured at 1440×810: **media top stays at 89, 89, 89 across 500px of scroll**
while the copy travels 515 → 265 → 15, then the media releases at 900.

The image also arrives faster and settles longer, as asked: the wipe is 880ms
(was 1200ms) and the picture eases out of a 1.13 push-in over 1600ms afterwards.
The wipe tells you it has arrived; the scale keeps it alive for a moment so it
does not simply stop dead. The copy waits 1020ms — the wipe plus one response
beat — before it begins.

Aspect-ratio-per-chapter had to go: at span 6 a 4:5 crop is taller than the
viewport, so it could never sit still in one. Widths now vary while the height
is shared, which gives four different proportions without re-cutting a crop.

**5 · The strip does not start until it is centred.** The section is now taller
than the viewport with the band pinned in the middle of it. The pin engages at
the exact moment the wrapper's top edge meets the top of the viewport, which is
also the moment the strip is centred on screen — so "arrived" and "progress
zero" are the same instant, and the strip is never already half spent by the
time you can see it. The pin is also what buys back the runway: mapping the
whole horizontal distance onto the band's own height meant a few hundred pixels
of scroll dragged the strip several thousand pixels sideways.

Measured: **track x = 0, 0, 0** at wrapTop 600, 200, 0 — dead still until
centred — then −435, −994, −1653.

Fixed a real bug while in there: `dt` from the shared frame loop is in
**milliseconds**, and the spring was clamping it with `Math.min(dt, 1/30)`,
which always returned 1/30 and therefore always integrated a fixed 33ms step
regardless of the actual frame time. The strip ran at double speed on a 120Hz
display. Now `Math.min(dt / 1000, 1/30)`.

**6 · The luxury pass.** `--ease` (the reference's own curve) and `--lag: 300ms`
are now tokens, and the arrival transitions are on them: the hero lines went
from 420ms on a homemade curve with 42ms of stagger to 780ms with 96ms, the
unmask and the slab filters moved across, and the kinetic words are on it too.

One flourish taken from the reference: a single pass of light across the accent
word as it lands. The reference carries exactly one of these on its homepage —
a `text-shine` class on one word — and nothing else. That restraint is the
point: a sheen on every accent is a casino; a sheen on one word per screen is a
material catching the light. Two stacked backgrounds, because clipping a
background to the glyphs needs transparent text, which would otherwise throw the
brass fill away.

**Mobile.** The pin cannot engage in a single-column stack, so the picture just
scrolls past normally there — which is the right behaviour anyway. But the tall
copy column exists *only* to sustain a pin, so without one it was a viewport and
a half of empty scrolling; it is now desktop-only, and the strip's runway is
shorter on a phone. Mobile went from 18.5 viewports to **13.5**.

### Verified, headless Chrome, 1440×810 and 390×844

| | |
|---|---|
| Wheel notch → glide | 129 frames, lands exactly on 400px |
| Chapter pin | media 89 / 89 / 89 while copy 515 → 265 → 15 |
| Strip before centre | x = 0 / 0 / 0, then −435 / −994 / −1653 |
| Sweep gradient | 29 words, 1 → 0.91 → 0.74 → 0.58 → 0.41 → 0.24 → 0.13 |
| Frame pacing | 1264 frames, median 6.9ms, p95 7.2ms, 0.2% late |
| Horizontal overflow | none at either width (1440/1440, 390/390) |
| Page length | 17.2 viewports desktop, 13.5 mobile |
| Console | clean apart from the three known unlicensed-font 404s |

**Undo this entry**

```bash
git revert --no-edit e378f54
```

---

## 2026-08-21 · `1448133` — Nav-first scroll, sprung strip, chapters rebuilt to the reference

**The hero holds while the nav travels.** The hero is now 155svh tall with its
contents `position: sticky`, so the first ~55svh of scroll moves nothing but the
nav; once the nav is home the whole thing scrolls away normally. Measured: nav
313 → 195 → 76 → 0 across scroll 0/150/300/400 while the headline sits at 182
throughout, then releases.

Sticky rather than a scroll-jack, deliberately. The scrollbar still means what it
says, you can flick straight past, and nothing intercepts the wheel — the page
just happens to have a tall first section.

"DINDIGUL · TAMIL NADU" removed from the header.

**The horizontal strip is a real spring now.** It was using `damp()`, which is
first order — it only ever decays toward its target, so it started and stopped
abruptly and had no momentum of its own. It read as a value being interpolated,
because it was one.

Replaced with a second-order spring: acceleration is the spring pulling toward
the target minus a damper resisting velocity, integrated per frame. Stiffness
110, damping 16.5, ζ ≈ 0.78 — under-damped enough to feel physical without
wobbling. The strip now takes a moment to get moving, keeps travelling when the
scroll stops, and settles with a trace of overshoot. The timestep is clamped to
1/30s because a spring integrated with the huge `dt` that arrives after a
backgrounded tab explodes rather than settles.

**Chapters rebuilt to the reference's composition.** Studied the new recording
frame by frame. What it does that a 50/50 grid does not:

- it never uses the same arrangement twice, and never centres anything;
- images sit at different widths, different aspect ratios and different vertical
  offsets;
- the statement beside a picture *overlaps its edge* rather than sitting in a
  tidy column;
- no two pictures travel at the same rate.

So: four bespoke arrangements, aspect ratios 4:5 / 3:2 / 5:7 / 16:10, vertical
offsets from −10vh to +16vh, and parallax that increases per chapter (12, 19, 26,
33) — that difference in rate is what makes the page read as depth rather than as
a list.

The hierarchy inverted with it. The reference gives its display size to the
*phrase* ("BOLD WHEN NEEDED"), not to a heading above it, so the evocative line
is now the big thin uppercase statement and "01 · THE LOG" is a small label. The
closing word takes the brass, as the reference's last line does.

The manifesto is no longer centred — the reference sets statements against a left
edge and leaves the rest of the frame empty, which is what makes the negative
space read as deliberate rather than as a gap.

**Fixed while checking.** The first cut overlapped the copy two columns into the
picture, which put the body paragraph directly on lit timber and made it
genuinely unreadable. Overlap cut to one column so the body clears the image
entirely, and both the statement and the body carry a wide, very soft shadow —
invisible on the black ground, and the difference between legible and not over
the few letters that do lap a picture.

**Verified in Chrome:** 392 frames through the opening, median 16.7ms, p95
16.8ms, 0.5% late. Full scroll pass at 1440×810 and 390×844 — no horizontal
overflow at either, 13.6 / 13.1 viewports, zero console errors beyond the three
known font 404s.

**Not done this pass.** The reference's scattered multi-image collage — several
pictures of different sizes overlapping within one screen — is a bigger structural
change than the chapters and needs more images than the ten usable ones we have.
Flagged rather than half-built.

## 2026-08-21 · `7a4d763` — Nav on the centre line, right-to-left headline, panels that rise

Three notes from the client, all checked against the reference frame by frame at
15fps rather than eyeballed.

**1. The nav belongs on the hero's centre line, then sticks.** It now starts
vertically centred — logo far left, the four-layer index at ~70%, the CTA hard
right, which is the reference's exact arrangement — and rides to the top over the
first 55svh of scroll, where it stays. Scroll-linked and transform-only, so it is
compositor work and never touches layout. Measured: navTop 313 → 155 → 0 → 0 at
scroll 0 / 200 / 500 / 1500.

The centred "DINDIGUL · TAMIL NADU" label had to go with it: on the centre line it
sat directly on the headline. It now fades in as the nav reaches the top, which is
also why the reference has nothing in the middle.

**2. The headline was appearing, not arriving.** Stepped at 15fps, the reference
wipes each line **from its right edge leftward** — "CAN" arrives as N, then AN,
then CAN, so the word assembles against reading order. That is the whole reason it
lands instead of switching on. Ours now does the same: `clip-path: inset(0 0 0
100%)` → `inset(0 0 0 0)` per line, ~42ms of stagger, 420ms each.

Swapping the hero off `Kinetic` to do this silently broke the accent — the rule
targeted `.kin-i`, which no longer existed, so "UNLOCKED" lost its brass. Fixed.

**3. The panels rise from small boxes near the bottom.** They were dilating
symmetrically from their centres. The reference does not: a small box appears low
in the frame and its *top edge climbs* while the bottom stays put. Separate top
and bottom insets now, driven by a keyframe animation rather than a transition
because the shape has to pass through an intermediate state — a stop at 14% lands
the small low box before the climb begins.

**And the thing that was actually making it feel rough.**

The client said the motion was not smooth. It was not, and it was not any of the
above — it was the **film grain**. A/B in Chrome, everything else identical:

| | frames in 7.5s | late frames |
|---|---|---|
| with grain animating | 225 | 36% |
| grain disabled | 380 | 4% |

It alone was eating ~40% of the frame budget, and the comment above it in the
stylesheet claimed it was cheap. `inset: -50%` made the layer **four times the
viewport area**, it carried `mix-blend-mode: overlay`, and it changed three times
a second — so it was re-blending four viewports of pixels, three times a second,
for the entire life of the page. A blended layer forces everything beneath it to
be re-composited on every change.

Overscan cut from -50% to -6% (the jitter only travels 1.5%; the rest was pure
waste), promoted to its own compositor layer, jitter slowed to 1200ms, and held
completely still until `data-ready` — the opening is the one moment the page
cannot afford it, with three blinds clipping, the mark assembling and the plate
settling at once.

**After, three runs back to back:** 430 / 431 / 430 frames, median 16.7ms,
p95 16.7–16.8ms, **0–2% late**. The gap to "grain disabled" is now 430 vs 434 —
inside the noise, where it used to be 225 vs 380.

*Measurement note: an earlier reading of 46–54% late frames was the host machine,
not the build — 18 Chrome processes and 2.2GB of the client's own browsing. The
numbers above are a controlled A/B run back to back so load hits both arms
equally.*

Full page still clean: no horizontal overflow at 1440×810 or 390×844, zero
console errors beyond the three known font 404s.

## 2026-08-21 · `f286d11` — The stutter after the opening, fixed at the cause

The client recorded the jump. It was not a frame-rate problem at all — it was a
**cut**.

**What was actually happening.** The reveal painted its *own* copy of the hero
inside the loader, then handed over to the real backdrop when the loader
unmounted. Measured at the handover:

| | rendered rect |
|---|---|
| loader's copy | 1280 × 720 at (0, 0) |
| backdrop plate | 1566.7 × 881.3 at (−143.4, −80.6) |

A **22% scale jump in a single frame**, because the plate carries `inset: -10%`
overscan (added earlier to stop the drift exposing a seam) plus a resting
`scale(1.02)`. No amount of easing fixes a cut.

**The fix removes the second image entirely.** The three windows are now holes
punched in black blinds sitting directly on top of the real backdrop — what
opens is the page itself. Two things fall out of that:

- nothing can drift out of register, because there is only one image;
- the element being animated is a flat colour rather than a 1.5MP photograph.
  `clip-path` is **not** compositor-accelerated, so animating it over an image
  forced a full repaint of that image every frame.

**A CSS trap worth recording.** `clip-path: polygon()` is a *single* path, so
listing the outer corners and then the inner ones draws a connector edge between
them — which renders as a diagonal slash across each blind, not a hole. `evenodd`
does not save it. The fix is to travel in along the bottom edge, around the hole
and back out along the same line, so the connector is traversed twice and
cancels.

**Long tasks.** Six backdrop plates were all fetched at high priority, landing
three long tasks (181ms, 98ms, 59ms) right where the reveal plays — a 181ms task
drops eleven frames. Only the first frame is urgent now; the rest are
`fetchPriority="low"` and arrive while you read.

**Then the physics that was missing.** The image now *settles* rather than simply
appearing: an `entry` factor decays exponentially from 1 once the windows start
cutting and feeds a small extra scale into every plate, so the picture is still
easing to rest while you are first seeing it — a camera settling rather than a
cut. Measured: 1.075 → 1.0517 → 1.0271 → 1.0216 → 1.0203 → 1.02, converged.

This is only safe *because* the duplicate image is gone. Moving the picture
during the reveal would have been impossible in the old structure.

Each blind also gets slightly more travel time than the one before it, so the
three read as panels of different mass rather than one animation on a delay.

**Measured after, in Chrome:** 386 frames through the whole opening — **median
16.7ms, p95 16.8ms**, i.e. a locked 60. Frames over 32ms: 6 of 386 (1.6%), and
the outlier is the initial navigation frame before anything animates. Long tasks
down from 181/98/59 to 73/78. No horizontal overflow at 1440×810 or 390×844,
zero console errors beyond the three known font 404s.

## 2026-08-21 · `bdb19cf` — Opening paced faster; hero matched to the reference

**Faster.** Same beats, same order, same proportions — just paced up. The whole
opening now runs **~6.0s** rather than 7.8s. The one thing kept is the pause
after the name (700ms → 380ms, not removed): that gap is what makes the lockup
read as a name being written rather than a progress bar, and it is the first
thing that dies when people copy this pattern. All values live in one `TIMELINE`
object in `Loader.tsx`.

**The hero now matches the reference's proportions.** Pulled a clean frame from
the video at 9.6s and compared side by side. What the reference actually does,
and what we were not doing:

- The headline is **uppercase, thin, one or two words per line over five or six
  short lines** — not a two-line sentence-case headline with a paragraph under it.
  That extreme scale contrast against 10–11px chrome *is* the effect.
- A stacked micro-list sits out to the right at the vertical middle. Ours is the
  four layers, which is the page's actual spine — the reference uses its roles.
- A two-line `SCROLL DOWN / …` label sits bottom-left, aligned to the headline's
  indent rather than the gutter.

Set in the TEXT weight of the brand face rather than the display weight. p.34
specifies Medium for H1, and Medium at this size reads heavy and commercial;
the reference's thin setting is most of why it feels architectural. Neue Haas
Grotesk Display Pro 45 Light is still the brand's own face, so this is a weight
choice inside the system, not outside it.

**Fixed while comparing:**
- First attempt set the headline at 9.4vw, which put five lines at ~17% of
  viewport height each — "unlocked" fell below the fold and took the index and
  scroll label with it. The reference fits six lines *plus* a scroll label in
  720px, at ~11.5% per line. Now 6.6vw.
- The vw-based indent looked considered at 1440 and ate a quarter of the line on
  a 390px phone. Gated to ≥760px.

**Known gap.** Our headline is heavier than the reference's. The reference uses a
genuinely thin face; our fallback is Arimo, whose lightest weight is 400. Nothing
lighter exists in it, and adding a fourth family to chase thinness would break
the guideline against mixing font styles that was enforced two commits ago. This
resolves itself when Neue Haas 45 Light is licensed — it is already first in the
stack.

**Verified in Chrome** (Puppeteer): sequence captured frame by frame; hero
compared against the video frame at 1280×650; 390×844 and 1440×900 both show no
horizontal overflow, headline clear of the scroll label, zero console errors
beyond the three known font 404s.

## 2026-08-21 · `b0130f7` — Opening retimed to the reference exactly, three-window reveal

Two things were wrong with the previous pass, both found by stepping the video
at 10fps instead of 3fps.

**1. The reveal is three windows, not one scaling image.** I read it as a single
photo scaling up. It is not: three panels open independently, staggered ~170ms
apart, each growing from a small rectangle to its own third of the screen. The
giveaway is that the picture inside never moves — so each panel is a *window*
onto a fixed image, and the seams vanish the moment the windows meet. Rebuilt
that way: `position: fixed` image inside each panel keeps all three in register.

Easing matters here more than duration. The first attempt used `--out`
(expo-out), which is front-loaded — the windows sprang open inside 200ms and the
staggered middle, the part that makes it read as three separate openings, was
gone before you could see it. Now `cubic-bezier(0.62, 0, 0.24, 1)`, which holds
the middle.

**2. Everything ran a second late.** The spinner's 1.7s floor was measured from
`performance.now()` captured inside the effect — i.e. from React hydration, not
from page load. In dev that is ~1s after first paint, so the whole sequence slid.
`performance.now()` is already navigation-relative, so the fix was to use the rAF
timestamp directly. Also narrowed the watch list to the single frame the windows
actually reveal and preloaded it at high priority; waiting on three images had
been pushing beat 1 past its mark on a cold load.

**Measured against the reference, in Chrome:**

| beat | video | ours |
|---|---|---|
| spinner ends | 1.7s | 1.75s |
| symbol | 1.9s | 1.9s |
| typing starts | 2.4s | 2.4s |
| name complete | 3.0s | 3.2s |
| divider + second half | 3.75s | 3.9s |
| lockup fades | 4.7s | 4.9s |
| windows open | 5.1s | 5.1s |
| image whole | 6.8s | 6.8s |
| headline arrives | 7.4s | 7.6s |

Within ~200ms throughout.

**The pause is deliberate.** The reference types NABIL, waits ~700ms with the
caret blinking, then types ISSA. That gap is what makes it read as a name being
written rather than a progress bar; ours holds the same beat between INDRAKOSH
and the tagline. `TYPE_HOLD` in the TIMELINE object — do not remove it.

⚠️ **It runs 7.8s**, because that is what the reference runs and it was asked for
exactly. That is long for a retail site. Every value lives in one `TIMELINE`
object in `Loader.tsx`; halving `TYPE_HOLD`, `LOCKUP_HOLD` and `IMAGE_HOLD`
brings it to ~5.5s without changing the feel.

**Verified in Chrome** (Puppeteer-driven, since the extension is offline and the
in-app pane will not composite): full sequence captured frame by frame at
1280×720; full-page pass at 1440×810 and 390×844 — no horizontal overflow at
either, loader unmounts cleanly, `main` and header reach full opacity, 13.8 and
12.7 viewports, zero console errors beyond the three known unlicensed-font 404s.

## 2026-08-21 · `380588c` — Opening rebuilt to the reference recording

Backed up first: tag `backup/before-video-loader-2026-08-21`, plus a file copy
at `indhrakosh/backup-landingpage-2026-08-21.zip` (50 files, 5.1 MB, no
node_modules).

**What the video actually contains.** Stepped frame by frame with ffmpeg — it is
the nabilissa.com opening, 10.7s at 1280×720, and it runs in five beats:

| | beat | what happens |
|---|---|---|
| 1 | spin | Two arcs 180° apart on one circle, rotating while their sweep breathes open and shut. Runs for the whole load. |
| 2 | mark | Arcs release; the logo symbol takes their place. |
| 3 | type | The wordmark types in letter by letter with a caret bar after it. |
| 4 | tag | The caret stops blinking and *becomes the divider* of the lockup — "NABIL\|ISSA". Same element, two jobs. |
| 5 | open | Lockup fades; the hero scales up from a small centred rectangle to full bleed. |

**What we built.** The same five beats, with our own assets:

- The arcs are brass on the night ground, built from two `stroke-dasharray`
  circles half a turn apart — verified against the reference by rasterising the
  same keyframe maths offline.
- Beat 2 does not fade the symbol in, it **assembles** it: 27 rays scale out of
  the burst centre staggered from the crown outward (ray 13 at 0s, ±6 at 154ms,
  the ends at 286ms), petals rise off the plinth, the sparkle snaps last.
- Beat 3 types INDRAKOSH in Medusa Gothic by writing `textContent`, so the caret
  is pushed along by the letters rather than positioned against them.
- Beat 4 reuses the reference's best idea: the caret becomes the lockup's
  divider and the real tagline opens out beside it.
- Beat 5 scales `.backdrop` from `0.16` to `1`. Because the backdrop is fixed
  and full-viewport, scaling it *is* the reference's move — a small rectangle of
  the image growing to full bleed, with the page's own ground showing around it
  on the way.

`main` is held at `opacity: 0` until the ground arrives, because otherwise the
hero's kinetic type fires behind the curtain and is finished before anyone
sees it.

Timing: spinner floors at 900ms (so a warm cache still reads as deliberate) and
ceilings at 4.5s; the scripted beats then run ~3.4s.

**Removed.** `Key.tsx` — the key-fill loader it belonged to is gone. Recoverable
from `c7b680e` if you want it reinstated as an extra beat.

**Verification — done properly, in Chrome.** Both supplied browser surfaces were
unavailable (extension reported zero connected browsers; the in-app pane will not
composite, which freezes rAF *and* CSS transitions). Installed Puppeteer and
drove its own Chrome instead, which is the real thing rather than a proxy for it.

Timed capture of the running sequence:

| t | beat | word | backdrop |
|---|---|---|---|
| 200–1700ms | spin | — | 0.16 |
| 2100ms | mark | — | 0.16 |
| 2500ms | type | `IN` | 0.16 |
| 2900ms | type | `INDRAKOSH` | 0.16 |
| 3300ms | tag | `INDRAKOSH` + divider + tagline | 0.16 |
| 4100ms | open | — | 0.71 |
| 4600ms | open | — | 0.99 |

Full-page pass at 1440×810 and 390×844: no horizontal overflow at either
(`scrollWidth === clientWidth`), 13.8 viewports, all four chapter images load and
their masks open to `inset(0px)`, and the only console errors are the three
expected unlicensed-font 404s.

Both horizontal-motion behaviours measured rather than assumed:
- the materials strip translates **1602px** across its scroll pass;
- the marquee drifts 6.2px/400ms at rest and 67.9px/400ms under scroll — **11×**,
  confirming the velocity coupling is live and not decorative.

**Timing tightened after seeing it.** First capture ran 6.3s end to end: the three
watched hero images decode in ~2.3s cold, and the beats added another 4. Spinner
floor 900→700ms, ceiling 4500→2600ms, 68→58ms per character, beats compressed,
reveal 1500→1200ms. Now ~4.7s.

## 2026-08-20 · `c7b680e` — The key loader, the symbol, and a stat row that parses

**The loader is now the key.** Guidelines p.18 — the aesthetic-direction spread
— is a gold heirloom key hanging against a line-drawn door, and the positioning
line is "Indrakosh is the key that opens a world of possibilities". So the
loading bar *is* a key: it fills with brass from the bit upward as the page
loads, and at 100% it turns 90° in the lock before the curtain parts.

`Key.tsx` draws it — trefoil bow, collar, shaft, warded bit — rather than
lifting the raster from the PDF, because a flat image can neither fill
progressively nor turn. It renders one layer and the loader stacks two (a faint
ghost, a brass copy under a clip), because clipping a plain `<div>` is reliable
everywhere while percentage `inset()` on an SVG group resolves against user
space and differs between engines. The key pivots at 50%/72% — where a real key
turns, not its centre.

**The symbol is back.** `Mark.tsx` restored from `2d34034` and placed in the
three spots that need it: beside the wordmark in the header, above the key in
the loader (the key is literally the negative space inside that mark, so showing
both states the idea without a caption), and above the wordmark in the footer.
Still the interim reconstruction — see the file header.

**The stat row was unreadable and is rewritten.** It rendered as:

    100km
    the only one for

…which is a sentence with its head cut off. The lead-in now sits ABOVE the
number and the noun below, so each cell reads top-to-bottom as one phrase.
Provenance is recorded per figure in `data.ts`, because two of the four are the
client's own claims and one is mine:

| | source |
|---|---|
| 4 layers of a home | REAL — the Guidelines' four layers |
| The only destination for 100 km in every direction | REAL — Guidelines p.5, verbatim claim |
| All of it under 1 roof | REAL — "Every layer of a home. Under one roof." |
| More than 240 materials on the floor | **INVENTED** — no source. Get the real number or cut the cell. |

**Verification note.** The key's geometry was checked by rasterising the same
paths offline; the DOM wiring, clip default, pivot and colours were measured in
the running page. The fill-and-turn itself was *not* watched end to end — the
Chrome extension disconnected mid-session and the in-app pane does not
composite, which freezes rAF. The phase machine is the one already observed
working; only the visual changed.

## 2026-08-20 · `f2eeab7` — Brand guideline applied; horizontal motion added

**Typography is now the brand's, not mine.** Bodoni Moda and JetBrains Mono are
gone — they were my picks, and p.34 is explicit: "Don't mix several font styles
in one layout."

| Role | Face | State |
|---|---|---|
| Wordmark | Medusa Gothic | **loaded** — header, loader, footer only, per "used exclusively for the wordmark" |
| Display + body | Neue Haas Grotesk Display Pro, Medium | falls through — not licensed for web |
| Accent / labels | Cocogoose DemiBold | falls through — not licensed, and the weight may not exist |

The fallback is **Arimo**, chosen for one reason: Neue Haas Grotesk *is*
Helvetica, Arial is metrically identical to Helvetica, and Arimo is metrically
identical to Arial. When the licence lands, dropping the woff2 into `/fonts`
changes the rendering without moving a line of text.

A grotesk sets wider and heavier than a didone at the same px, so the whole
display scale came down a step and the tracking tightened. Italic accents are
gone with it — Neue Haas has no true italic, only an oblique, and a sloped
grotesk at 9vw reads as a mistake. The brand has a colour system instead.

**Colour is now the four brand hexes verbatim** (#af541f / #561300 / #eee6d7 /
#93301f) plus a value ramp of those four. Measured against the ground:

| | on #1a0a04 | |
|---|---|---|
| soapstone #eee6d7 | 15.55:1 | AAA — body and headlines |
| brass #d9b478 | 9.87:1 | AAA — the accent that can be read |
| terracotta #af541f | 3.77:1 | **large text only** — the manifesto line, nothing else |
| seal brown #93301f | 2.46:1 | **fails on dark** — it is a cream-ground colour, so it never appears as text here |

That last row is why seal brown is absent: it is not a dark-ground colour, and
using it as text would have been guideline-compliant on paper and illegible on
screen.

**Horizontal motion, two kinds, deliberately different physics**

- `Strip.tsx` — a materials band that travels sideways as you scroll down
  through it. Scroll-linked and *damped*, not mapped 1:1; a rigid
  `translateX = progress × distance` welds the strip to the scrollbar and feels
  like dragging a window. Nothing is pinned; the page scroll is untouched.
- `Marquee.tsx` — now a body with momentum rather than a CSS keyframe. Baseline
  drift, accelerated by scroll velocity, **reverses when you scroll up**, eases
  back when you stop. Wraps on a true modulus of half the track width, which is
  what keeps it seamless in both directions — a reset-to-zero marquee visibly
  jumps the moment you scroll upward.
- The rail keeps its tracked velocity, friction and end spring.

**Bugs found by walking the whole page in real Chrome**

- **A hard horizontal seam across the backdrop.** Plates drift ±6% of their
  height at `inset: 0`, which slid each image off the viewport edge and exposed
  the ground as a band — a seam, in the one design whose entire premise is that
  there are no seams. Plates now overscan at `inset: -10%`.
- **The header disappeared entirely** over the mid-brown end-grain plate.
  `mix-blend-mode: difference` looked clever on the dark plates; cream
  differenced against a mid tone lands back on a mid tone. Replaced with a short
  gradient scrim, which is boring and works at every value behind it.
- **Dragging the rail ran a text selection** across the captions and painted
  half the row in the ::selection colour. Added `user-select: none` and
  disabled native image drag.

**Known deviation, for a decision**

The guidelines say "use cream and warm neutrals as the foundation" and this page
is dark-dominant. It is defensible — the brand's own storefront application
(p.36) is charcoal and brass, and the ground here is a shade of DARK TERRACOTTA
rather than a neutral black — but it is a deviation and it is deliberate, not an
oversight. Say the word and I will build the cream-ground variant to compare.

## 2026-08-20 · `0da2524` — Rebuilt from zero: one continuous descent

The client rejected the previous site outright and asked for a full rewrite with
no sectioning, real photography and "wow" motion. `app/` was deleted and rebuilt.

**The idea.** There are no sections in the visual sense. A single fixed image
stack sits behind the entire page and cross-fades as you scroll, so the ground
never cuts. Everything floats over it. The `<section>` elements that remain are
for screen readers and skip links, not for the eye.

**Look.** Near-black warm ground (a shade of the brand's dark terracotta, so
timber photographs sit *in* it rather than on it), cream, brass, one terracotta
accent. Bodoni Moda for display at up to 11rem — the real wordmark face, Medusa
Gothic, is a high-contrast romanesque serif, so a didone is the closest thing
that can actually be licensed. Archivo reads; JetBrains Mono does the technical
labels, which keeps the page from reading as a perfume ad.

**Photography.** 20 images sourced from Unsplash, graded in CSS rather than
baked so the real shoot can drop straight in. See `public/img/README.md` — none
of it is Indrakosh and all of it is on borrowed time.

**Motion.** `lib/raf.ts` runs one animation loop for the whole page; twelve
components each with their own rAF is twelve layout reads per frame. Damping is
frame-rate independent (exponential decay over elapsed time), because the naive
`a += (b-a)*0.1` settles twice as fast on a 120Hz display.

- Loader: counter tied to real decoded images, curtain parts.
- Backdrop: damped cross-fade + drift across six plates.
- Kinetic type: per-word mask reveal on a sqrt-eased stagger.
- Rail: drag with tracked velocity, friction, spring rubber-band at the ends;
  claims the wheel only on clearly horizontal intent, and has arrow-key support.
- Parallax, clip-path unmask, count-up tallies, marquee, magnetic cursor.

Nothing is pinned and the scroll is never hijacked. Reduced motion collapses all
of it; with JS off the noscript block reveals everything.

**Bugs found by looking at the running page**

- The loader sat at `000%` forever. It called `setState` sixty times a second,
  which re-ran its own effect, which reset the elapsed timer and the decoded
  count on every frame. Per-frame numbers are not React state — the digits are
  written straight to the DOM now, and the effect runs once.
- Every headline word ran into the next — "Everylayerofahome". The inter-word
  space was inside `.kin-w`, whose `overflow: hidden` ate it. Space moved outside.
- "unlocked" was clipped off the right edge at 1550px, silently, because
  `overflow-x` was hiding it. Hero dropped from 12.5vw to 10.2vw.
- 60px of phantom horizontal scroll: a clipped subtree still contributes to
  `documentElement.scrollWidth` when only `<body>` clips. Added `overflow-x: clip`
  on `<html>` too (clip, not hidden — hidden makes the root a scroll container
  and kills `position: sticky` everywhere below).
- The Mill chapter image carried a legible third-party tool brand. Swapped.
- One high-key frame in the rail punched a white hole in the page. Swapped.
- Footer wordmark lost its final letter at 15.5vw. Reduced to 11.6vw.

**Verified in real Chrome** (the in-app Browser pane was not compositing, which
freezes rAF and IntersectionObserver — nothing motion-driven can be tested
there): loader completes, hero reads correctly, all four chapters, marquee, rail,
layers, closing and footer. Mobile at 375px has zero horizontal overflow.

## 2026-08-20 · `f9ccf33` — Redesign: procedural timber and cinematic chapters

The first version was structurally a brochure. I read nabilissa.com's DOM
rather than eyeballing it and found the thing that was actually missing: that
page is **44 viewports tall and every chapter opens with a section exactly one
viewport high** — a full-screen title card — before a long body. That single
structural fact is most of why those sites feel cinematic. Ours had no cards at
all; chapters just started with a two-column grid.

The other problem was honest: those sites carry 83 images. We have ten usable
ones and no shoot booked, so half the page was placeholder boxes.

**Added — `app/lib/timber.ts` + `components/Timber.tsx`**

The site now draws its own material. Real end grain — growth rings with
year-to-year width variation, an off-centre pith, heartwood/sapwood, medullary
rays, radial seasoning checks and a bark collar — and real flat-sawn cathedral
figure, in teak, rosewood and mahogany. Seeded, so a given species always draws
the same log and server and client agree.

This is not filler standing in for content. Indrakosh is a timber business,
Chapter I is literally "it stands as a tree, not a catalogue", and a real
cross-section is the most honest hero the page could have. It costs nothing, is
resolution-independent, and stays correct when commissioned renders arrive.

Pure 2D-context code with no DOM references, so the identical function runs in
Node against `@napi-rs/canvas` — which is how the grain was tuned, since the
Browser pane would not composite screenshots.

**Changed**

- `components/Chapter.tsx` rebuilt: full-viewport card (dark, full-bleed
  material, title at `clamp(3.25rem, 13vw, 11rem)`) then a cream body.
  `AnimationSlot` is gone — chapters carry real material now.
- `page.tsx` — the three timbers in Chapter I are no longer a list with pictures
  beside it; the three drawn cross-sections **are** the list. Chapter II shows
  the same species as sawn boards, so the transition between chapters is the cut.
- `globals.css` — sections 11–14 replaced. The silence interlude gets a full
  screen and 4.5rem type. Page is now 17 viewports, up from about 11.
- `content.ts` — `timbers` entries carry an explicit `species`.

**Fixed during verification**

- Runtime crash: `SPECIES[species]` was undefined because I passed the
  placeholder id `"third"` through an `as Species` cast. The cast is what hid
  it from the compiler — removed, and `timbers` is now typed so the species must
  be real. The third timber draws as mahogany while its *name* stays a
  placeholder.
- The card veil double-darkened with a linear *and* a radial and buried the
  material. Title measured 15.6:1, so there was headroom to give the grain back;
  now it weights toward the type in the lower-left and reads around 8:1.

**Verified**

Card height exactly 100svh · title 166px at 1265px wide · chapter numeral
9.9:1, quote 12.0:1, title 15.6:1 before the veil was lightened · no horizontal
page overflow · only 404s are the three unlicensed fonts.

## 2026-08-20 · `58a1222` — Doors drawn, not photographed

The photographic doors were replaced. Reason, plainly: the only door image
available was an AI render of a European-classical door — off-brand for Tamil
Nadu, incoherent under close inspection — and a flat photo split down the middle
reads as cardboard the moment it rotates, because it has no thickness and its
shading does not change with the swing.

**Added**

- `components/DoorLeaf.tsx` — the leaf drawn in brass line on near-black timber.
  This is page 18 of the Brand Guidelines, the aesthetic-direction spread, which
  is itself a line drawing of a grand double door in gold with a key. Vector, so
  it is crisp at any size and costs a few KB. Both leaves are one drawing
  mirrored, so the carving matches across the join.

**Changed**

- `Doors.tsx` no longer uses `next/image`; it renders two `DoorLeaf`s.
- `globals.css` — `.door-leaf img` rules replaced by `.door-svg`, and the leaf
  shading rewritten so the hinge side darkens and the leading edge catches
  brass as the leaf swings. Without that the pair reads as one flat image
  folding rather than two doors opening.
- `public/deck/door-grand.webp` is retained but no longer referenced.

## 2026-08-20 · `3e0adcf` — Brand foundation base

First restore point. Nothing before this exists.

- Token layer in `app/globals.css`: the four brand colours plus a derived warm
  ramp, the spec'd type scale, spacing rhythm.
- Three damped-spring easings baked into native CSS `linear()` — `--ease-settle`
  (ζ 0.82), `--ease-snap` (ζ 0.68), `--ease-heavy` (ζ 1.0).
- `@font-face` wiring, `local()`-first, with a Helvetica-metric fallback chain.
- `components/Mark.tsx` — the Indrakosh symbol, parametric so each ray, petal
  and the sparkle animate independently. **Interim artwork, see the file header.**
- `components/Overture.tsx` — the load sequence.
- `components/Reveal.tsx` — scroll reveal, native scroll-timeline first,
  IntersectionObserver fallback, visible with no JS.
- `content.ts` — copy sourced only from the brand documents, with typed
  placeholders for anything unanswered.

Two bugs found by looking at the running page rather than trusting the build:

- The Cocogoose trial installed on this machine ships broken digit glyphs — `01`
  rendered as CJK. Fixed by dropping the loose `local("Cocogoose")` lookup and
  adding a `unicode-range` guard.
- The hero bloom at `opacity: .42` was greying the whole page and dragging body
  copy under AA. Reduced to `.14` with `mix-blend-mode: multiply`.

## 2026-08-20 · `aa1dd5a` — Six chapters, the doors, the chapter bar

Restructured to the architecture in the client's handwritten notebook.

**Added**

- `components/Doors.tsx` + CSS — the grand-doors intro. One photograph drawn
  twice, each half hinged on its outer edge under a shared perspective, warm
  light behind. Opens on scroll.
- `components/ChapterNav.tsx` + CSS — the fixed bottom chapter bar. Anatomy read
  off nabilissa.com's DOM: active item expands into the free space on the left,
  the rest stay compact on the right, each carries a progress line that fills as
  you scroll through that chapter, "Back to start" at the end.
- `components/Chapter.tsx` — the chapter shell in the notebook's layout
  (animation area left, text right), plus `AnimationSlot`, which states on the
  page which asset is missing and what it has to do.
- `public/deck/*.webp` — 24 images pulled from the Executive Portfolio deck,
  resized to max 1600px and converted to WebP. 965 KB total.

**Changed**

- `content.ts` rewritten around six chapters: Log, Mill, Hand, Founder, House,
  Visit. Chapter quotes taken verbatim from the notebook where it supplies them.
- `Overture.tsx` no longer owns a full-screen stage. It writes its phase to
  `document.documentElement` so the door stage, ground and header can all react
  in CSS, and hands the viewport to `Doors`.
- `Header.tsx` — dropped the section nav; the chapter bar already does that job.
- `Reveal.tsx` — now forwards `data-*` props.
- `globals.css` — sections 6 and 9 replaced by sections 9–14.

**Fixed during verification**

- Doors did not move at all. The `animation` shorthand resets
  `animation-duration` to `0s`, which silently kills a scroll-driven animation.
  Replaced with longhand plus `animation-duration: auto`, and swapped `view()`
  for `scroll(root block)` with a real `0 100svh` range, which is predictable
  for a subject that starts at the top of the document.
- Intro copy was dark ink over a dark door photograph. The intro is now cream
  throughout on a feathered radial scrim, because the ground behind it changes
  from dark timber to bright glow and neither is safe for dark text.
- `.intro-copy` overflowed narrow viewports — a grid item with only `max-width`
  sizes to `max-content`. Added `width: 100%`.
- "We mill the timber we crave" was terracotta on dark timber, well under AA.
  Changed to brass, which is the brand's dark-ground accent.
- Light behind the doors was near-black, reading as a hole rather than a
  threshold. Brightened substantially.
- Header CTA wrapped to two lines; slot placeholder grew to a full screen on
  mobile. Both capped.

---

## Known gaps, carried forward

- **Founder chapter** is wired but unwritten — swapping in the copy is a single
  edit to `founder` in `content.ts`.
- **Fonts**: three of the four brand faces are not licensed for web use.
- **The mark** is an interim reconstruction pending official vector artwork.
- **Deck imagery**: only about ten of the deck files are large enough to use.
  The rest are 374×230 thumbnails. None of them are photographs of Indrakosh.
- **Chapters I–III have no assets yet** — the animation slots name what is needed.
