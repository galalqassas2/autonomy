"use client"

import * as React from "react"
import { Suspense, lazy } from "react"

import { RobotPlaceholder } from "@/components/ui/robot-placeholder"

const Spline = lazy(() => import("@splinetool/react-spline"))

interface SplineSceneProps {
  scene: string
  className?: string
  /* Fires once the scene has actually finished loading and is rendering,
     not just once the JS chunk has arrived — the two can be seconds apart
     for a multi-megabyte scene. Callers use this to know when it is safe
     to reveal the canvas instead of a placeholder. */
  onLoad?: () => void
}

/*
  Suspense alone only covers the loading state, not a genuine failure. A
  ChunkLoadError (a flaky connection, an ad blocker, a stale deploy) throws
  past Suspense and, with nothing catching it, takes down the whole React
  tree, not just this panel, which is what happened the first time this
  loaded outside a slow-network-safe position. This boundary is the fix:
  worst case, the scene silently does not appear, and the rest of the page
  around it keeps working.
*/
class SplineBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SplineScene failed to load, showing fallback.", error)
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/*
  The loading (and, via SplineBoundary, the failure) fallback is the site's
  own robot placeholder rather than a generic spinner, so a slow connection
  never shows a blank panel: something on-brand is there from first paint
  and stays there for as long as the real scene takes to arrive.
*/
export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const fallback = <RobotPlaceholder />

  return (
    <SplineBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Spline scene={scene} className={className} onLoad={onLoad} />
      </Suspense>
    </SplineBoundary>
  )
}
