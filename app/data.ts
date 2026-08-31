/**
 * Placeholder content.
 *
 * The brand lines (name meaning, positioning, the four layers, the "silence"
 * opening) are the client's real copy from the Brand Guidelines. Everything
 * numeric — years, project counts, names, testimonials — is INVENTED as dummy
 * data for the design, at the client's request. None of it is verified and none
 * of it should ship. Anything fabricated is marked `demo: true`.
 */

export const brand = {
  name: "INDRAKOSH",
  tagline: "A world of interiors, unlocked",
  line: "We mill the timber we crave",
  place: "Dindigul · Tamil Nadu",
};

/**
 * The hero, restructured to the reference's proportions.
 *
 * The reference stacks its headline one or two words per line over six short
 * lines and sets everything else at 10–11px. That extreme scale contrast is the
 * whole effect — a conventional two-line headline with a paragraph under it
 * reads as a different kind of site entirely.
 *
 * `lines` rather than `words` because the breaks are art direction, not
 * wrapping: letting the browser choose them gives a different silhouette at
 * every viewport.
 */
export const hero = {
  over: "Est. 2025 — Dindigul",
  lines: ["Every", "layer", "of a", "home,", "unlocked"],
  // `index` (Structural / Surface / Ambience / Living) removed from the hero at
  // the client's request. The four layers still have a section of their own
  // further down, so nothing is lost — the hero just stops saying it twice.
  scroll: ["Scroll down", "to walk through"],
};

export const opening = [
  "The construction is done.",
  "The walls are up.",
  "The keys are in your hand.",
  "And then silence.",
];

export const manifesto = [
  "Other",
  "showrooms",
  "are",
  "built",
  "around",
  "products.",
  "We",
  "are",
  "built",
  "around",
  "the",
  "decision.",
];

/** Fixed backdrop plates. Each takes over as you scroll past its trigger. */
export const plates = [
  { src: "/img/hall.webp", alt: "A carved timber hall lit by late afternoon light." },
  { src: "/img/endgrain.webp", alt: "The sawn end of a log, growth rings and seasoning checks." },
  { src: "/img/mill.webp", alt: "A timber mill floor." },
  { src: "/img/workshop.webp", alt: "A carpenter's bench under a window." },
  { src: "/img/corridor.webp", alt: "A dark corridor of lit timber cabinetry." },
  { src: "/img/salon.webp", alt: "A warm salon with carved timber and deep seating." },
];

/**
 * Chapters, rebuilt as CLUSTERS.
 *
 * Each one now carries three frames rather than one. The reference never puts
 * a single picture beside a column of text — it scatters two or three at
 * different sizes, lets them bleed off opposite edges at different heights,
 * and drops the statement into the negative space between them. One picture
 * plus one text column is a layout; three pictures at three scales is a
 * composition, and that difference is the whole "visual attraction".
 *
 * `img` stays as the lead frame. `more` are the supporting two.
 */
export const chapters = [
  {
    k: "01",
    t: "The Log",
    q: "It stands as a tree, not a catalogue.",
    b: "We buy the log, not the finished panel. The grain, the density, the honesty of what ends up in your home is settled before anyone else has touched it.",
    img: "/img/knot.webp",
    alt: "A knot in weathered timber.",
    more: [
      { src: "/img/endgrain.webp", alt: "The sawn end of a log, growth rings and seasoning checks." },
      { src: "/img/bark.webp", alt: "The rough outer bark of a trunk." },
    ],
  },
  {
    k: "02",
    t: "The Mill",
    q: "The part nobody else has.",
    b: "Our own saw. Teak, rosewood and country hardwoods cut to the size the drawing asks for, rather than the size the market happens to stock.",
    // NOT sawing.webp — that frame carries a legible third-party tool brand
    // across the blade, and it is high-key B&W, which punches a white hole in
    // an otherwise warm, dark page.
    img: "/img/planks.webp",
    alt: "Sawn boards stacked warm side up.",
    more: [
      { src: "/img/mill.webp", alt: "A timber mill floor." },
      { src: "/img/weathered.webp", alt: "Grey weathered boards." },
    ],
  },
  {
    k: "03",
    t: "The Hand",
    q: "Some things you should be able to hand down.",
    b: "Machines cut. Hands finish. Carving, joinery, the last pass of oil — the part that decides whether a piece is furniture or an heirloom.",
    img: "/img/door-carved.webp",
    alt: "A carved door panel.",
    more: [
      { src: "/img/workshop.webp", alt: "A carpenter's bench under a window." },
      // NOT still.webp. Its alt text calls it "a dark still life in raking
      // light"; it is actually a yellow sunflower against a white wall, and in
      // the cluster it punched exactly the high-key hole the image README
      // warns about — the same reason brass-hook.webp was excluded.
      { src: "/img/door-gold.webp", alt: "A gilded carved door." },
    ],
  },
  {
    k: "04",
    t: "The House",
    q: "Every layer, under one roof.",
    b: "Structural, surface, ambience, living. Seen together, so the choices agree with each other instead of arriving from a dozen different shops.",
    img: "/img/stair.webp",
    alt: "A carved timber staircase.",
    more: [
      { src: "/img/corridor.webp", alt: "A dark corridor of lit timber cabinetry." },
      { src: "/img/cabinet.webp", alt: "Carved timber cabinetry." },
    ],
  },
];

/**
 * Rail frames are all low-key and warm on purpose. brass-hook.webp is a lovely
 * macro but it is shot against a bright green garden, and one high-key frame in
 * a row of dark ones reads as a hole punched in the page — no amount of CSS
 * filtering rescues a blown white background.
 */
export const rail = [
  { src: "/img/door-carved.webp", t: "Doors", n: "01", alt: "A carved door with brass furniture." },
  { src: "/img/cabinet.webp", t: "Cabinetry", n: "02", alt: "Carved timber cabinetry." },
  { src: "/img/lantern.webp", t: "Ambience", n: "03", alt: "A brass lantern pendant." },
  { src: "/img/planks.webp", t: "Surfaces", n: "04", alt: "Warm timber boards." },
  { src: "/img/still.webp", t: "Objects", n: "05", alt: "A dark still life in raking light." },
  { src: "/img/door-gold.webp", t: "Entrances", n: "06", alt: "A gilded carved door." },
  { src: "/img/salon.webp", t: "Living", n: "07", alt: "A warm salon with deep seating." },
  { src: "/img/weathered.webp", t: "Timber", n: "08", alt: "Weathered grey boards." },
];

export const marquee = [
  "Nattu Teak",
  "Rosewood",
  "Mahogany",
  "Brass",
  "Veneer",
  "Louvers",
  "Terracotta",
  "Soapstone",
  "Glass",
];

/**
 * The stat row.
 *
 * Rewritten because the first version read as four beheaded sentences: the big
 * number came first and the label under it, so "the only one for" landed
 * BELOW "100km" and the row said "100km / the only one for". Nonsense.
 *
 * Each figure now has a lead-in ABOVE the number and the noun below it, so it
 * reads top-to-bottom as one phrase.
 *
 * Provenance matters here — two of these are the client's own claims and two
 * are mine:
 *   4 layers      REAL. The Guidelines' four layers: structural, surface,
 *                 ambience, living.
 *   100 km        REAL. Guidelines p.5: "the only destination in Dindigul and
 *                 across a hundred kilometres in every direction."
 *   1 roof        REAL. "Every layer of a home. Under one roof."
 *   240+          INVENTED. A placeholder count with no source. Either get the
 *                 real number or cut the cell — a fabricated inventory figure
 *                 is the kind of thing a competitor checks.
 */
export const figures = [
  { over: "Every layer of a home", v: 4, suffix: "", l: "structural · surface · ambience · living", demo: false },
  { over: "The only destination for", v: 100, suffix: " km", l: "in every direction", demo: false },
  { over: "All of it under", v: 1, suffix: "", l: "roof", demo: false },
  { over: "More than", v: 240, suffix: "", l: "materials on the floor", demo: true },
];

/**
 * The four layers — the brand's actual spine, and previously the weakest thing
 * on the page: four headings and four sentences floating over a lit photograph,
 * with the body copy effectively unreadable and half a screen of dead space
 * between each. They carry images now and stand as a quadriptych.
 */
export const layers = [
  { n: "01", t: "Structural", b: "Foundations, frames and the elements that decide the shape of a home before anything decorative is chosen.", img: "/img/door-grand.webp", alt: "A tall carved timber door in a stone opening." },
  { n: "02", t: "Surface", b: "Timber, stone and finish — the materials you actually touch, and the ones that age in public.", img: "/img/planks.webp", alt: "Sawn boards stacked warm side up." },
  { n: "03", t: "Ambience", b: "Light first, then everything light falls on. The quiet mechanics of how a room feels after dark.", img: "/img/lantern.webp", alt: "A brass lantern pendant lit from within." },
  { n: "04", t: "Living", b: "Furniture, objects and the last ten per cent that turns a finished building into somebody's house.", img: "/img/salon.webp", alt: "A warm salon with carved timber and deep seating." },
];

export const closing = {
  q: "Indrakosh is the key that opens a world of possibilities for the home.",
  cta: "Plan a visit",
};

/**
 * The materials band — travels sideways as you scroll down it.
 *
 * Deliberately different physics from the rail: this one is passive and
 * scroll-driven, the rail is active and drag-driven. Two kinds of horizontal
 * movement in one page reads as intent; two of the same reads as a template.
 */
export const strip = [
  { src: "/img/endgrain.webp", t: "End grain", alt: "The sawn end of a log." },
  { src: "/img/knot.webp", t: "Figure", alt: "A knot in weathered timber." },
  { src: "/img/bark.webp", t: "Bark", alt: "The rough outer bark of a trunk." },
  { src: "/img/planks.webp", t: "Boards", alt: "Warm sawn boards." },
  { src: "/img/weathered.webp", t: "Weathering", alt: "Grey weathered boards." },
  { src: "/img/door-carved.webp", t: "Carving", alt: "A carved door panel." },
  { src: "/img/still.webp", t: "Patina", alt: "A dark still life in raking light." },
];

/**
 * The specimen index — replaces the sideways-travelling materials band.
 *
 * The band showed seven pictures and told you nothing about any of them. This
 * says what each material actually is, where it comes from and what it is for,
 * which is the question somebody standing in a showroom is actually asking.
 * Species and origins are DEMO data: plausible for a Tamil Nadu timber
 * merchant, not verified, and not the client's list.
 */
export const specimens = [
  { n: "01", t: "Nattu Teak", sp: "Tectona grandis", from: "Local, Dindigul belt", use: "Doors, frames, joinery", img: "/img/planks.webp", alt: "Warm sawn teak boards.", demo: true },
  { n: "02", t: "Rosewood", sp: "Dalbergia latifolia", from: "Western Ghats", use: "Furniture, carving", img: "/img/knot.webp", alt: "Figured grain in dark timber.", demo: true },
  { n: "03", t: "End grain", sp: "Mixed hardwood", from: "Our own mill", use: "Flooring, counters", img: "/img/endgrain.webp", alt: "The sawn end of a log, growth rings visible.", demo: true },
  { n: "04", t: "Weathered oak", sp: "Quercus, reclaimed", from: "Reclaimed stock", use: "Cladding, panelling", img: "/img/weathered.webp", alt: "Grey weathered boards.", demo: true },
  { n: "05", t: "Bark face", sp: "Live edge", from: "Our own mill", use: "Tables, shelving", img: "/img/bark.webp", alt: "The rough outer bark of a trunk.", demo: true },
  { n: "06", t: "Brass", sp: "Cast and drawn", from: "Kumbakonam", use: "Furniture, lighting", img: "/img/lantern.webp", alt: "A brass lantern pendant.", demo: true },
  { n: "07", t: "Carved panel", sp: "Seasoned hardwood", from: "In-house workshop", use: "Doors, screens", img: "/img/door-carved.webp", alt: "A carved door panel.", demo: true },
  { n: "08", t: "Patina", sp: "Aged surfaces", from: "Various", use: "Objects, detail", img: "/img/still.webp", alt: "A dark still life in raking light.", demo: true },
];

/**
 * The founder section.
 *
 * Built from the client's reference recording: a full-bleed monochrome
 * portrait with a large thin statement lapping its edge, a narrow column of
 * small copy beside it, and a signature.
 *
 * EVERYTHING HERE IS PLACEHOLDER and none of it may ship as-is:
 *   · The portrait is `maker.webp` — a stranger from a free stock pool, the
 *     same one flagged in public/img/README.md. It must not appear under a
 *     real person's name. A studio headshot would have been closer to the
 *     reference, but every free source I could reach returned archival
 *     nineteenth-century plates, and a maker at the bench is a better fit for
 *     a timber merchant than a generic stock portrait would have been.
 *   · The words are mine. The founder questionnaire has been outstanding since
 *     the first build, so this is written in his voice without his input.
 *   · There is no signature. The reference has a real handwritten one; ours is
 *     the wordmark until somebody sends a scan.
 *
 * The reference also runs a press-logo ticker under this section — dezeen,
 * Vogue, i-D and so on. Deliberately NOT built: Indrakosh is Est. 2025 and has
 * no press, and inventing mastheads is the kind of claim that gets checked.
 * The slot is easy to add the day there is something true to put in it.
 */
export const founder = {
  h: ["Timber,", "light &", "stillness"],
  body: [
    "We started with a saw and a view about panels: that buying the finished sheet means buying somebody else's judgement about the tree.",
    "So the log comes to us whole. What that buys you is the boring, expensive part nobody sees — grain matched across a run, density that will not move in a Dindigul summer, and a floor that still looks chosen in twenty years.",
  ],
  by: "The founder",
  role: "Indrakosh · Dindigul",
  img: "/img/maker.webp",
  alt: "A maker working a length of timber at the bench.",
  demo: true,
};
