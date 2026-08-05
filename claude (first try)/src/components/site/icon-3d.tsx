import { ICON_SHAPES, type Icon3DName, type Shape, type Tone } from "./icon-3d-shapes"

/*
  One camera, one light, one material for all nineteen feature icons.
  Camera: front facing with a 15 degree downward tilt, so every solid shows
  its face and a compressed top, and never a side.
  Light: key from the upper left at 45 degrees, one soft fill, no rim.
  Matte clay. Palette locked to ink, white, primary and primary soft.
*/
const TONES: Record<Tone, { top: string; from: string; to: string }> = {
  neutral: { top: "#eaeded", from: "#d8dcdc", to: "#b2b8b9" },
  white: { top: "#ffffff", from: "#f7f9f9", to: "#dfe4e4" },
  ink: { top: "#3f4547", from: "#2c3133", to: "#191d1e" },
  green: { top: "#5ee6a3", from: "#3ecf8e", to: "#1f9d6d" },
}

const DEPTH = 5

function Solid({ shape, uid }: { shape: Shape; uid: string }) {
  const fill = `url(#${uid}-${shape.tone})`
  const top = TONES[shape.tone].top

  if (shape.k === "mark") {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.w}
        height={shape.h}
        rx={shape.r ?? shape.h / 2}
        fill={shape.flat ? top : fill}
      />
    )
  }

  if (shape.k === "path") {
    if (shape.stroke) {
      return (
        <path
          d={shape.d}
          fill="none"
          stroke={shape.flat ? top : fill}
          strokeWidth={shape.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )
    }
    return <path d={shape.d} fill={shape.flat ? top : fill} />
  }

  if (shape.k === "disc") {
    const d = shape.d ?? DEPTH
    return (
      <>
        <ellipse
          cx={shape.cx}
          cy={shape.cy - d * 0.26}
          rx={shape.rad}
          ry={shape.rad}
          fill={top}
        />
        <circle cx={shape.cx} cy={shape.cy} r={shape.rad} fill={fill} />
      </>
    )
  }

  const d = shape.d ?? DEPTH
  const r = shape.r ?? Math.min(shape.w, shape.h) / 3
  const lift = d * 0.26

  return (
    <>
      <rect
        x={shape.x}
        y={shape.y - lift}
        width={shape.w}
        height={shape.h}
        rx={r}
        fill={top}
      />
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.w}
        height={shape.h}
        rx={r}
        fill={fill}
      />
    </>
  )
}

export function Icon3D({
  name,
  size = 40,
}: {
  name: Icon3DName
  size?: number
}) {
  const uid = `i3-${name}`
  return (
    <svg
      role="presentation"
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {(Object.keys(TONES) as Tone[]).map((tone) => (
          <linearGradient
            key={tone}
            id={`${uid}-${tone}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor={TONES[tone].from} />
            <stop offset="100%" stopColor={TONES[tone].to} />
          </linearGradient>
        ))}
      </defs>
      {ICON_SHAPES[name].map((shape, i) => (
        <Solid key={i} shape={shape} uid={uid} />
      ))}
    </svg>
  )
}
