"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Section entry: fade plus a 22px rise over 700ms, staggered by index,
  fired once. The transition itself lives in globals.css so reduced motion
  can switch it off in one place.
*/
export function Reveal({
  children,
  index = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode
  index?: number
  className?: string
  as?: "div" | "li" | "section" | "article" | "header" | "p"
}) {
  const ref = React.useRef<HTMLElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-shown={shown}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${Math.min(index, 5) * 80}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
