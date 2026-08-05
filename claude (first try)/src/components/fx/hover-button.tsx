"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Circle = {
  id: number
  x: number
  y: number
  color: string
  fadeState: "in" | "out" | null
}

const MAX_CIRCLES = 12
const THROTTLE_MS = 100

type HoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /* Renders an anchor instead, for CTAs that navigate. */
  href?: string
}

/*
  Glass button that trails soft emerald circles under the pointer.
  Only ever used on canvas-night surfaces, per section 5.1 of the brief.
*/
export function HoverButton({
  className,
  children,
  disabled,
  href,
  ...props
}: HoverButtonProps) {
  const buttonRef = React.useRef<HTMLElement>(null)
  const [circles, setCircles] = React.useState<Circle[]>([])
  const [trails, setTrails] = React.useState(false)
  const lastAdded = React.useRef(0)
  const timers = React.useRef<number[]>([])
  const nextId = React.useRef(0)

  /* No hover on touch, and nothing to trail under reduced motion. */
  React.useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setTrails(!coarse.matches && !reduce.matches)
    sync()
    coarse.addEventListener("change", sync)
    reduce.addEventListener("change", sync)
    return () => {
      coarse.removeEventListener("change", sync)
      reduce.removeEventListener("change", sync)
    }
  }, [])

  React.useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    },
    [],
  )

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id)
      fn()
    }, ms)
    timers.current.push(id)
  }

  /* One timeout chain per circle, owned here, so nothing double schedules. */
  const createCircle = (x: number, y: number) => {
    const width = buttonRef.current?.offsetWidth ?? 0
    const stop = width ? (x / width) * 100 : 50
    const id = nextId.current++
    const circle: Circle = {
      id,
      x,
      y,
      color: `linear-gradient(to right, var(--circle-start) ${stop}%, var(--circle-end) ${stop}%)`,
      fadeState: null,
    }

    setCircles((prev) =>
      prev.length >= MAX_CIRCLES ? prev : [...prev, circle],
    )

    const setState = (fadeState: "in" | "out") =>
      setCircles((prev) =>
        prev.map((c) => (c.id === id ? { ...c, fadeState } : c)),
      )

    schedule(() => setState("in"), 16)
    schedule(() => setState("out"), 1000)
    schedule(() => setCircles((prev) => prev.filter((c) => c.id !== id)), 2200)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!trails || disabled) return
    const now = performance.now()
    if (now - lastAdded.current < THROTTLE_MS) return
    lastAdded.current = now
    const rect = event.currentTarget.getBoundingClientRect()
    createCircle(event.clientX - rect.left, event.clientY - rect.top)
  }

  const trail = circles.map(({ id, x, y, color, fadeState }) => (
    <span
      key={id}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-[-1] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg",
        "transition-opacity duration-300",
        fadeState === "in" && "opacity-75",
        fadeState === "out" && "opacity-0 duration-[1.2s]",
        !fadeState && "opacity-0",
      )}
      style={{ left: x, top: y, background: color }}
    />
  ))

  const shared = {
    onPointerMove: handlePointerMove,
    className: cn(
      "relative isolate inline-flex items-center gap-2 overflow-hidden rounded-sm px-5 py-2.5",
      "text-sm leading-none font-medium text-on-dark",
      "bg-white/[0.04] backdrop-blur-lg",
      "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit]",
      "before:shadow-[inset_0_0_0_1px_rgba(62,207,142,0.2),inset_0_0_16px_0_rgba(62,207,142,0.1),inset_0_-3px_12px_0_rgba(62,207,142,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
      "before:transition-transform before:duration-300",
      disabled
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer active:before:scale-[0.975]",
      className,
    ),
    style: {
      "--circle-start": "var(--primary-a90)",
      "--circle-end": "var(--primary-deep-a90)",
    } as React.CSSProperties,
  }

  if (href) {
    return (
      <a
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        href={href}
        {...shared}
      >
        {trail}
        {children}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      disabled={disabled}
      {...shared}
      {...props}
    >
      {trail}
      {children}
    </button>
  )
}
