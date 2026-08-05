"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { useMediaQuery, useNearViewport, useReducedMotion } from "@/lib/use-media"

import { DotGrid } from "./dot-grid"

const KineticGrid = dynamic(() => import("./kinetic-grid"), { ssr: false })

/*
  Gate for the one KineticGrid instance on the page. It mounts only above
  768px, only with motion allowed, and only once the section is within
  200px of the viewport. Everything else gets the static dot grid.
*/
export function KineticGridMount() {
  const ref = React.useRef<HTMLDivElement>(null)
  const near = useNearViewport(ref)
  const wide = useMediaQuery("(min-width: 768px)")
  const reduce = useReducedMotion()

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {near && wide && !reduce ? <KineticGrid /> : <DotGrid />}
    </div>
  )
}
