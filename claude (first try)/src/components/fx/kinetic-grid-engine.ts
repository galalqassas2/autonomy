export type Point = { x: number; y: number }
export type Ripple = { x: number; y: number; radius: number; opacity: number; born: number }

const INFLUENCE_RADIUS = 260
const MAX_WARP = 24
const DOT_SPACING = 28
const LERP_SPEED = 0.08
const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 }
const NODE_BASE_RADIUS = 1.8
const NODE_ACTIVE_RADIUS = 3.2
const AWAY = -9999

const THEME = {
  bg: "#051229",
  lineActive: { r: 212, g: 175, b: 55, a: 0.85 },
  nodeActive: { r: 212, g: 175, b: 55, a: 1.0 },
  glow: "212,175,55",
  ripple: "212,175,55",
}

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number,
) {
  const r = Math.round(lerpN(base.r, active.r, t))
  const g = Math.round(lerpN(base.g, active.g, t))
  const b = Math.round(lerpN(base.b, active.b, t))
  return `rgba(${r},${g},${b},${lerpN(base.a, active.a, t).toFixed(3)})`
}

function cellSize(width: number) {
  return width < 1024 ? 96 : 72
}

export class KineticGridEngine {
  private ctx: CanvasRenderingContext2D
  private mouse: Point = { x: AWAY, y: AWAY }
  private target: Point = { x: AWAY, y: AWAY }
  private ripples: Ripple[] = []
  private size = { w: 0, h: 0 }
  
  private pts: Point[][] = []
  private prox: number[][] = []
  private cols = 0
  private rows = 0
  
  private frame = 0
  running = false

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  private ensureGrid(nextCols: number, nextRows: number) {
    if (nextCols === this.cols && nextRows === this.rows) return
    this.cols = nextCols
    this.rows = nextRows
    this.pts = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({ x: 0, y: 0 })),
    )
    this.prox = Array.from({ length: this.rows }, () => new Array<number>(this.cols).fill(0))
  }

  setSize(width: number, height: number, dpr: number, canvas: HTMLCanvasElement) {
    this.size.w = width
    this.size.h = height
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  draw(now: number) {
    const { w: W, h: H } = this.size
    if (!W || !H) return

    const ctx = this.ctx

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = THEME.bg
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = "rgba(255,255,255,0.05)"
    for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
      for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
        ctx.beginPath()
        ctx.arc(x, y, 0.7, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i]
      const age = (now - r.born) / 1000
      r.radius = Math.max(0, age * 400)
      r.opacity = Math.max(0, 1 - age * 1.2)
      if (r.opacity <= 0) this.ripples.splice(i, 1)
    }

    const cell = cellSize(W)
    this.ensureGrid(
      Math.max(2, Math.ceil(W / cell)) + 1,
      Math.max(2, Math.ceil(H / cell)) + 1,
    )
    const cellW = W / (this.cols - 1)
    const cellH = H / (this.rows - 1)
    const edgeMargin = 1.5

    for (let row = 0; row < this.rows; row++) {
      const colPinRow = Math.min(row / edgeMargin, (this.rows - 1 - row) / edgeMargin, 1)
      for (let col = 0; col < this.cols; col++) {
        const gx = col * cellW
        const gy = row * cellH
        const colPin = Math.min(
          col / edgeMargin,
          (this.cols - 1 - col) / edgeMargin,
          1,
        )
        const pin = colPin * colPin * colPinRow * colPinRow

        const dx = gx - this.mouse.x
        const dy = gy - this.mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        let rx = 0
        let ry = 0
        for (const r of this.ripples) {
          const rdx = gx - r.x
          const rdy = gy - r.y
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
          const diff = rdist - r.radius
          if (Math.abs(diff) < 55) {
            const strength = (1 - Math.abs(diff) / 55) * r.opacity * 18 * pin
            const angle = Math.atan2(rdy, rdx)
            const sign = diff < 0 ? 1 : -1
            rx += Math.cos(angle) * strength * sign
            ry += Math.sin(angle) * strength * sign
          }
        }

        const point = this.pts[row][col]
        if (dist < INFLUENCE_RADIUS && dist > 0 && pin > 0) {
          const t = dist / INFLUENCE_RADIUS
          const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60)
          const warp = eased * MAX_WARP * pin
          const angle = Math.atan2(dy, dx)
          point.x = gx - Math.cos(angle) * warp + rx
          point.y = gy - Math.sin(angle) * warp + ry
        } else {
          point.x = gx + rx
          point.y = gy + ry
        }
        this.prox[row][col] = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pin
      }
    }

    const segment = (p1: Point, p2: Point, pr1: number, pr2: number) => {
      const avg = (pr1 + pr2) / 2
      const t = avg * avg * (3 - 2 * avg)
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.strokeStyle = lerpColor(LINE_BASE, THEME.lineActive, t)
      ctx.lineWidth = lerpN(0.8, 1.5, t)
      ctx.stroke()
    }

    ctx.lineCap = "butt"
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 1; col++) {
        segment(this.pts[row][col], this.pts[row][col + 1], this.prox[row][col], this.prox[row][col + 1])
      }
    }
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows - 1; row++) {
        segment(this.pts[row][col], this.pts[row + 1][col], this.prox[row][col], this.prox[row + 1][col])
      }
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const p = this.pts[row][col]
        const pr = this.prox[row][col]
        const t = pr * pr * (3 - 2 * pr)
        const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t)

        if (t > 0.3) {
          const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7)
          const grd = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR)
          grd.addColorStop(0, `rgba(${THEME.glow},${(t * 0.3).toFixed(3)})`)
          grd.addColorStop(1, `rgba(${THEME.glow},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = lerpColor({ r: 255, g: 255, b: 255, a: 0.2 }, THEME.nodeActive, t)
        ctx.fill()
      }
    }

    for (const r of this.ripples) {
      ctx.beginPath()
      ctx.arc(r.x, r.y, Math.max(0, r.radius), 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${THEME.ripple},${(r.opacity * 0.28).toFixed(3)})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  private loop = (now: number) => {
    this.mouse.x = lerpN(this.mouse.x, this.target.x, LERP_SPEED)
    this.mouse.y = lerpN(this.mouse.y, this.target.y, LERP_SPEED)
    this.draw(now)
    this.frame = requestAnimationFrame(this.loop)
  }

  start() {
    if (this.running) return
    this.running = true
    this.frame = requestAnimationFrame(this.loop)
  }

  stop() {
    if (!this.running) return
    this.running = false
    cancelAnimationFrame(this.frame)
  }

  setTarget(x: number, y: number) {
    this.target.x = x
    this.target.y = y
  }

  addRipple(x: number, y: number) {
    this.ripples.push({
      x,
      y,
      radius: 0,
      opacity: 1,
      born: performance.now(),
    })
  }

  resetTarget() {
    this.target.x = AWAY
    this.target.y = AWAY
  }
}
