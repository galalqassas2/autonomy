"use client"

import * as React from "react"

import { useMediaQuery, useNearViewport, useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

const MAX_RENDER_DIM = 1280
const FRAME_MS = 1000 / 30

const VERTEX = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor;

  float ray(vec2 coord, float seed, float speed) {
    vec2 source = vec2(uResolution.x * 1.04, -uResolution.y * 0.18);
    vec2 offset = coord - source;
    float distance = length(offset);
    float cone = pow(max(dot(normalize(offset), vec2(0.0, 1.0)), 0.0), 1.45);
    float angle = atan(offset.x, offset.y);
    float shimmer = 0.58 + 0.42 * sin(angle * seed + uTime * speed);
    float fade = 1.0 - smoothstep(uResolution.x * 0.18, uResolution.x * 1.2, distance);
    return cone * shimmer * fade;
  }

  void main() {
    vec2 coord = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
    float strength = ray(coord, 31.7, 0.24) * 0.56;
    strength += ray(coord, 19.3, 0.17) * 0.34;
    strength *= 1.0 - smoothstep(0.42, 1.0, coord.y / uResolution.y);
    strength *= 0.15;
    gl_FragColor = vec4(uColor, strength);
  }
`

export function LightRays({ className }: { className?: string }) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const near = useNearViewport(hostRef, "300px")
  const reduce = useReducedMotion()
  const compact = useMediaQuery("(max-width: 767px)")

  React.useEffect(() => {
    const host = hostRef.current
    const staticOnly =
      reduce ||
      compact ||
      window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)")
        .matches
    if (!host || !near || staticOnly) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    import("ogl").then(({ Color, Mesh, Program, Renderer, Triangle }) => {
      if (cancelled) return

      const renderer = new Renderer({ alpha: true })
      const gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      host.appendChild(gl.canvas)

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uColor: {
            value: new Color(
              getComputedStyle(host).getPropertyValue("--primary").trim(),
            ),
          },
        },
      })
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

      const resize = () => {
        const { clientWidth: width, clientHeight: height } = host
        if (!width || !height) return

        const base = Math.min(window.devicePixelRatio || 1, 1.5)
        const longest = Math.max(width, height) * base
        renderer.dpr =
          longest > MAX_RENDER_DIM ? (base * MAX_RENDER_DIM) / longest : base
        renderer.setSize(width, height)
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
      }

      const sizeObserver = new ResizeObserver(resize)
      sizeObserver.observe(host)
      resize()

      let visible = false
      let frame = 0
      let lastFrame = 0

      const stopDrawing = () => {
        cancelAnimationFrame(frame)
        frame = 0
      }

      const draw = (now: number) => {
        if (!visible || document.hidden) {
          frame = 0
          return
        }

        if (now - lastFrame >= FRAME_MS) {
          program.uniforms.uTime.value = now * 0.001
          renderer.render({ scene: mesh })
          lastFrame = now
        }
        frame = requestAnimationFrame(draw)
      }

      const startDrawing = () => {
        if (!frame && visible && !document.hidden) {
          frame = requestAnimationFrame(draw)
        }
      }

      const viewportObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          if (visible) startDrawing()
          else stopDrawing()
        },
        { threshold: 0.05 },
      )
      viewportObserver.observe(host)

      const handleVisibility = () => {
        if (document.hidden) stopDrawing()
        else startDrawing()
      }
      document.addEventListener("visibilitychange", handleVisibility)

      cleanup = () => {
        stopDrawing()
        sizeObserver.disconnect()
        viewportObserver.disconnect()
        document.removeEventListener("visibilitychange", handleVisibility)
        gl.getExtension("WEBGL_lose_context")?.loseContext()
        gl.canvas.remove()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [near, reduce, compact])

  return <div ref={hostRef} aria-hidden="true" className={cn("light-rays", className)} />
}
