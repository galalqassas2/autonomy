"use client"

import * as React from "react"

import { useNearViewport, useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

/*
  Forty filaments drifting across a band, thinner and fainter toward the top.
  The only WebGL on the page. The renderer is imported when the section comes
  near rather than at the top of the file, so it stays out of the first load,
  and the context is dropped again on unmount. Colour is read from --primary,
  so it follows the palette rather than repeating it.
*/

/* Above this the shader costs more than the effect is worth. */
const MAX_RENDER_DIM = 1920

const VERTEX = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uResolution;
  uniform vec3 uColor;
  uniform float uAmplitude;
  uniform float uDistance;

  const int LINES = 40;
  const float LINE_WIDTH = 7.0;
  const float LINE_BLUR = 10.0;

  float perlin(vec2 p) {
    vec2 cell = floor(p);
    vec4 offsets = p.xyxy - vec4(cell, cell + 1.0);
    vec4 corners = vec4(cell.xy, cell.xy + 1.0);
    corners -= floor(corners * (1.0 / 71.0)) * 71.0;
    corners += vec2(26.0, 161.0).xyxy;
    corners *= corners;
    corners = corners.xzxz * corners.yyww;

    vec4 gradX = fract(corners * (1.0 / 951.135664)) - 0.49999;
    vec4 gradY = fract(corners * (1.0 / 642.949883)) - 0.49999;
    vec4 grads = inversesqrt(gradX * gradX + gradY * gradY)
      * (gradX * offsets.xzxz + gradY * offsets.yyww);
    grads *= 1.41421356;

    vec2 blend = offsets.xy * offsets.xy * offsets.xy
      * (offsets.xy * (offsets.xy * 6.0 - 15.0) + 10.0);
    vec4 weights = vec4(blend, vec2(1.0 - blend));
    return dot(grads, weights.zxzx * weights.wwyy);
  }

  float onePixel() {
    return 1.0 / max(uResolution.x, uResolution.y);
  }

  /* One filament. Flat at the left edge, loosening as it crosses. */
  float filament(vec2 st, float width, float depth) {
    float split = 0.1 + depth * 0.4;
    float swing = smoothstep(split, 0.7, st.x) * 0.5 * uAmplitude;
    float blur = smoothstep(split, split + 0.05, depth) * depth;
    float t = uTime / 10.0;

    float wave = mix(
      perlin(vec2(t, st.x + depth) * 2.5),
      perlin(vec2(t, st.x + t) * 3.5) / 1.5,
      st.x * 0.3
    );

    float y = 0.5 + (depth - 0.5) * uDistance + wave * 0.5 * swing;
    float feather = width * 0.5 + LINE_BLUR * onePixel() * blur;

    float top = smoothstep(y + feather, y, st.y);
    float bottom = smoothstep(y, y - feather, st.y);
    float fade = 1.0 - smoothstep(0.0, 1.0, pow(depth, 0.3));

    return clamp((top - bottom) * fade, 0.0, 1.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    float clear = 1.0;
    for (int i = 0; i < LINES; i++) {
      float depth = float(i) / float(LINES);
      clear *= 1.0 - filament(uv, LINE_WIDTH * onePixel() * (1.0 - depth), depth);
    }

    float ink = 1.0 - clear;
    gl_FragColor = vec4(uColor * ink, ink);
  }
`

export function Filaments({
  amplitude = 0.9,
  distance = 0.35,
  className,
}: {
  amplitude?: number
  distance?: number
  className?: string
}) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const near = useNearViewport(hostRef, "300px")
  const reduce = useReducedMotion()

  React.useEffect(() => {
    const host = hostRef.current
    if (!host || !near) return

    let stop: (() => void) | undefined
    let cancelled = false

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
          uResolution: { value: [1, 1, 1] },
          uColor: {
            value: new Color(
              getComputedStyle(host).getPropertyValue("--primary").trim(),
            ),
          },
          uAmplitude: { value: amplitude },
          uDistance: { value: distance },
        },
      })
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

      const resize = () => {
        const { clientWidth: width, clientHeight: height } = host
        const base = Math.min(window.devicePixelRatio || 1, 2)
        const longest = Math.max(width, height) * base
        renderer.dpr =
          longest > MAX_RENDER_DIM ? (base * MAX_RENDER_DIM) / longest : base
        renderer.setSize(width, height)
        program.uniforms.uResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ]
      }

      const observer = new ResizeObserver(resize)
      observer.observe(host)
      resize()

      let frame = 0
      const draw = (now: number) => {
        program.uniforms.uTime.value = now * 0.001
        renderer.render({ scene: mesh })
        frame = requestAnimationFrame(draw)
      }

      if (reduce) renderer.render({ scene: mesh })
      else frame = requestAnimationFrame(draw)

      stop = () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        gl.getExtension("WEBGL_lose_context")?.loseContext()
        gl.canvas.remove()
      }
    })

    return () => {
      cancelled = true
      stop?.()
    }
  }, [near, reduce, amplitude, distance])

  return <div ref={hostRef} aria-hidden="true" className={cn("filaments", className)} />
}
