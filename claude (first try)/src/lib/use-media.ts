"use client"

import * as React from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [query])

  return matches
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/* True once the element has come within `margin` of the viewport. */
export function useNearViewport(
  ref: React.RefObject<HTMLElement | null>,
  margin = "200px",
) {
  const [near, setNear] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element || near) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: margin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, margin, near])

  return near
}
