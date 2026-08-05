export type Tone = "neutral" | "white" | "ink" | "green"

export type Shape =
  | { k: "slab"; x: number; y: number; w: number; h: number; r?: number; d?: number; tone: Tone }
  | { k: "disc"; cx: number; cy: number; rad: number; d?: number; tone: Tone }
  | { k: "mark"; x: number; y: number; w: number; h: number; r?: number; flat?: boolean; tone: Tone }
  | { k: "path"; d: string; flat?: boolean; stroke?: number; tone: Tone }

const slab = (
  x: number,
  y: number,
  w: number,
  h: number,
  tone: Tone,
  r?: number,
): Shape => ({ k: "slab", x, y, w, h, tone, r })

const disc = (cx: number, cy: number, rad: number, tone: Tone): Shape => ({
  k: "disc",
  cx,
  cy,
  rad,
  tone,
})

const mark = (
  x: number,
  y: number,
  w: number,
  h: number,
  tone: Tone,
  r?: number,
): Shape => ({ k: "mark", x, y, w, h, tone, r, flat: true })

/*
  Nineteen icons, one vocabulary: extruded slabs, extruded discs and flat
  marks. Nothing here draws a side face, a gloss or a contact shadow.
*/
export const ICON_SHAPES = {
  /* Trust strip */
  hub: [
    mark(30.5, 20, 3, 24, "neutral"),
    { k: "path", d: "M18 24 L32 34 L30 37 L16 27 Z", tone: "neutral", flat: true },
    { k: "path", d: "M46 24 L32 34 L34 37 L48 27 Z", tone: "neutral", flat: true },
    disc(15, 22, 6, "neutral"),
    disc(49, 22, 6, "neutral"),
    disc(32, 50, 6, "neutral"),
    disc(32, 32, 10, "green"),
  ],
  chip: [
    mark(20, 8, 3, 8, "neutral"),
    mark(30.5, 8, 3, 8, "neutral"),
    mark(41, 8, 3, 8, "neutral"),
    mark(20, 48, 3, 8, "neutral"),
    mark(30.5, 48, 3, 8, "neutral"),
    mark(41, 48, 3, 8, "neutral"),
    slab(14, 15, 36, 34, "neutral", 9),
    slab(23, 24, 18, 16, "green", 5),
  ],
  pin: [
    { k: "path", d: "M32 56 L20 38 L44 38 Z", tone: "neutral" },
    disc(32, 27, 15, "neutral"),
    disc(32, 26, 6.5, "green"),
  ],

  /* Department selector */
  receipt: [
    { k: "path", d: "M16 12 h32 v38 l-5.3 -4 l-5.4 4 l-5.3 -4 l-5.3 4 l-5.4 -4 L16 50 Z", tone: "white" },
    mark(22, 21, 20, 3.4, "neutral"),
    mark(22, 29, 14, 3.4, "green"),
    mark(22, 37, 17, 3.4, "neutral"),
  ],
  funnel: [
    { k: "path", d: "M12 15 h40 L37 34 v10 l-10 6 V34 Z", tone: "neutral" },
    disc(41, 48, 7, "green"),
  ],
  crates: [
    slab(12, 34, 18, 16, "neutral", 4),
    slab(34, 34, 18, 16, "neutral", 4),
    slab(23, 15, 18, 16, "green", 4),
  ],
  bubbles: [
    slab(10, 14, 34, 24, "neutral", 8),
    { k: "path", d: "M18 36 h10 l-9 9 Z", tone: "neutral", flat: true },
    slab(28, 30, 26, 20, "green", 7),
  ],
  badge: [
    slab(11, 14, 42, 34, "white", 8),
    disc(23, 28, 7, "green"),
    mark(34, 24, 14, 3.4, "neutral"),
    mark(34, 32, 10, 3.4, "neutral"),
  ],

  /* The work */
  clock: [
    disc(32, 32, 20, "neutral"),
    disc(32, 32, 13.5, "white"),
    mark(30.6, 21, 2.8, 13, "ink"),
    mark(32, 30.6, 11, 2.8, "green"),
  ],
  coins: [
    slab(14, 40, 36, 11, "neutral", 5.5),
    slab(14, 29, 36, 11, "neutral", 5.5),
    slab(14, 18, 36, 11, "green", 5.5),
  ],
  quality: [
    slab(13, 12, 38, 40, "white", 8),
    mark(20, 21, 8, 3.4, "green"),
    mark(31, 21, 13, 3.4, "neutral"),
    mark(20, 30, 8, 3.4, "neutral"),
    mark(31, 30, 13, 3.4, "neutral"),
    mark(20, 39, 8, 3.4, "neutral"),
    mark(31, 39, 8, 3.4, "neutral"),
  ],
  inbox: [
    slab(10, 24, 44, 26, "neutral", 7),
    { k: "path", d: "M12 26 L32 40 L52 26 v-6 H12 Z", tone: "green" },
  ],

  /* The build */
  map: [
    slab(10, 14, 44, 36, "white", 8),
    {
      k: "path",
      d: "M19 43 C 27 43, 25 32, 32 32 C 39 32, 37 21, 45 21",
      tone: "green",
      stroke: 3.4,
      flat: true,
    },
    disc(19, 43, 4.5, "ink"),
    disc(45, 21, 4.5, "green"),
  ],
  target: [
    disc(32, 32, 21, "neutral"),
    disc(32, 32, 14, "white"),
    disc(32, 32, 7, "green"),
  ],
  blocks: [
    slab(12, 33, 19, 18, "neutral", 4),
    slab(33, 33, 19, 18, "neutral", 4),
    slab(22.5, 13, 19, 18, "green", 4),
  ],
  gauge: [
    disc(32, 36, 21, "neutral"),
    { k: "path", d: "M13 34 A 19 19 0 0 1 51 34 Z", tone: "white", flat: true },
    mark(30.6, 20, 2.8, 17, "green"),
    disc(32, 36, 5, "ink"),
  ],

  /* Trust chapter */
  shield: [
    { k: "path", d: "M32 9 L52 17 v16 c0 12 -9 19 -20 23 C21 52 12 45 12 33 V17 Z", tone: "neutral" },
    {
      k: "path",
      d: "M27 32 v-4 a5 5 0 0 1 10 0 v4",
      tone: "green",
      stroke: 3,
      flat: true,
    },
    slab(24, 30, 16, 13, "green", 3.5),
  ],
  rack: [
    slab(12, 39, 40, 13, "neutral", 4),
    slab(12, 25, 40, 13, "neutral", 4),
    slab(12, 11, 40, 13, "neutral", 4),
    disc(20, 17, 3, "green"),
    disc(20, 31, 3, "green"),
    disc(20, 45, 3, "green"),
  ],
  key: [
    disc(22, 32, 13, "neutral"),
    disc(22, 32, 5, "white"),
    mark(33, 28.5, 20, 7, "green", 3.5),
    mark(41, 35.5, 5, 7, "green", 2),
    mark(49, 35.5, 5, 7, "green", 2),
  ],
} satisfies Record<string, Shape[]>

export type Icon3DName = keyof typeof ICON_SHAPES
