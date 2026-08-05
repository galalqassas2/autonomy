"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

interface Ripple extends Point {
  radius: number;
  opacity: number;
  born: number;
}

type GridColor = "default" | "monochrome";

export interface KineticGridProps {
  children?: ReactNode;
  className?: string;
  globalColor?: GridColor;
}

const CELL_SIZE = 55;
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 28;
const LERP_SPEED = 0.08;
const OFFSCREEN_POINT = -9999;
const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 };
const NODE_BASE_RADIUS = 1.8;
const NODE_ACTIVE_RADIUS = 3.2;

const themes = {
  default: {
    background: "#161618",
    lineActive: { r: 74, g: 158, b: 255, a: 0.9 },
    nodeActive: { r: 74, g: 158, b: 255, a: 1 },
    glow: "74,158,255",
    ripple: "100,180,255",
  },
  monochrome: {
    background: "#0c1512",
    lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
    nodeActive: { r: 255, g: 255, b: 255, a: 1 },
    glow: "255,255,255",
    ripple: "255,255,255",
  },
} as const;

function lerp(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  amount: number,
) {
  const red = Math.round(lerp(base.r, active.r, amount));
  const green = Math.round(lerp(base.g, active.g, amount));
  const blue = Math.round(lerp(base.b, active.b, amount));
  const alpha = lerp(base.a, active.a, amount);

  return `rgba(${red},${green},${blue},${alpha.toFixed(3)})`;
}

function getWarpedPoint(
  gridX: number,
  gridY: number,
  column: number,
  row: number,
  mouse: Point,
  ripples: Ripple[],
  columns: number,
  rows: number,
) {
  const edgeMargin = 1.5;
  const columnPin = Math.min(column / edgeMargin, (columns - 1 - column) / edgeMargin, 1);
  const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
  const pinFactor = columnPin * columnPin * rowPin * rowPin;
  const deltaX = gridX - mouse.x;
  const deltaY = gridY - mouse.y;
  const distance = Math.hypot(deltaX, deltaY);
  const proximity = Math.max(0, 1 - distance / INFLUENCE_RADIUS) * pinFactor;
  let rippleX = 0;
  let rippleY = 0;

  for (const ripple of ripples) {
    const rippleDeltaX = gridX - ripple.x;
    const rippleDeltaY = gridY - ripple.y;
    const rippleDistance = Math.hypot(rippleDeltaX, rippleDeltaY);
    const waveWidth = 55;
    const difference = rippleDistance - ripple.radius;

    if (Math.abs(difference) < waveWidth) {
      const strength = (1 - Math.abs(difference) / waveWidth) * ripple.opacity * 18 * pinFactor;
      const angle = Math.atan2(rippleDeltaY, rippleDeltaX);
      const direction = difference < 0 ? 1 : -1;
      rippleX += Math.cos(angle) * strength * direction;
      rippleY += Math.sin(angle) * strength * direction;
    }
  }

  if (distance >= INFLUENCE_RADIUS || distance === 0 || pinFactor === 0) {
    return { point: { x: gridX + rippleX, y: gridY + rippleY }, proximity };
  }

  const normalizedDistance = distance / INFLUENCE_RADIUS;
  const falloff = normalizedDistance < 0.01
    ? 0
    : (1 - normalizedDistance) ** 2 * Math.min(1, distance / 60);
  const warp = falloff * MAX_WARP * pinFactor;
  const angle = Math.atan2(deltaY, deltaX);

  return {
    point: {
      x: gridX - Math.cos(angle) * warp + rippleX,
      y: gridY - Math.sin(angle) * warp + rippleY,
    },
    proximity,
  };
}

export default function KineticGrid({
  children,
  className,
  globalColor = "default",
}: KineticGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: OFFSCREEN_POINT, y: OFFSCREEN_POINT });
  const targetMouseRef = useRef<Point>({ x: OFFSCREEN_POINT, y: OFFSCREEN_POINT });
  const ripplesRef = useRef<Ripple[]>([]);
  const animationFrameRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { width, height } = sizeRef.current;
    if (!width || !height) return;

    const mouse = mouseRef.current;
    const ripples = ripplesRef.current;
    const theme = themes[globalColor];

    context.clearRect(0, 0, width, height);
    context.fillStyle = theme.background;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(255,255,255,0.05)";
    for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
      for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
        context.beginPath();
        context.arc(x, y, 0.7, 0, Math.PI * 2);
        context.fill();
      }
    }

    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      const age = (now - ripple.born) / 1000;
      ripple.radius = Math.max(0, age * 400);
      ripple.opacity = Math.max(0, 1 - age * 1.2);
      if (ripple.opacity === 0) ripples.splice(index, 1);
    }

    const columns = Math.max(2, Math.ceil(width / CELL_SIZE)) + 1;
    const rows = Math.max(2, Math.ceil(height / CELL_SIZE)) + 1;
    const cellWidth = width / (columns - 1);
    const cellHeight = height / (rows - 1);
    const points: Point[][] = [];
    const proximities: number[][] = [];

    for (let row = 0; row < rows; row += 1) {
      points[row] = [];
      proximities[row] = [];

      for (let column = 0; column < columns; column += 1) {
        const { point, proximity } = getWarpedPoint(
          column * cellWidth,
          row * cellHeight,
          column,
          row,
          mouse,
          ripples,
          columns,
          rows,
        );
        points[row][column] = point;
        proximities[row][column] = proximity;
      }
    }

    const drawSegment = (start: Point, end: Point, startProximity: number, endProximity: number) => {
      const average = (startProximity + endProximity) / 2;
      const intensity = average * average * (3 - 2 * average);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, intensity);
      context.lineWidth = lerp(0.8, 1.5, intensity);
      context.stroke();
    };

    context.lineCap = "butt";
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns - 1; column += 1) {
        drawSegment(
          points[row][column],
          points[row][column + 1],
          proximities[row][column],
          proximities[row][column + 1],
        );
      }
    }

    for (let column = 0; column < columns; column += 1) {
      for (let row = 0; row < rows - 1; row += 1) {
        drawSegment(
          points[row][column],
          points[row + 1][column],
          proximities[row][column],
          proximities[row + 1][column],
        );
      }
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const point = points[row][column];
        const proximity = proximities[row][column];
        const intensity = proximity * proximity * (3 - 2 * proximity);
        const radius = lerp(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, intensity);

        if (intensity > 0.3) {
          const glowRadius = radius + lerp(0, 6, (intensity - 0.3) / 0.7);
          const gradient = context.createRadialGradient(
            point.x,
            point.y,
            radius * 0.5,
            point.x,
            point.y,
            glowRadius,
          );
          gradient.addColorStop(0, `rgba(${theme.glow},${(intensity * 0.3).toFixed(3)})`);
          gradient.addColorStop(1, `rgba(${theme.glow},0)`);
          context.beginPath();
          context.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
          context.fillStyle = gradient;
          context.fill();
        }

        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = lerpColor(
          { r: 255, g: 255, b: 255, a: 0.2 },
          theme.nodeActive,
          intensity,
        );
        context.fill();
      }
    }

    for (const ripple of ripples) {
      context.beginPath();
      context.arc(ripple.x, ripple.y, Math.max(0, ripple.radius), 0, Math.PI * 2);
      context.strokeStyle = `rgba(${theme.ripple},${(ripple.opacity * 0.28).toFixed(3)})`;
      context.lineWidth = 1.5;
      context.stroke();
    }
  }, [globalColor]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const interactionTarget = container.parentElement ?? container;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;
    let isAnimating = false;

    const stopAnimation = () => {
      isAnimating = false;
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    };

    const animate = (now: number) => {
      if (!isAnimating) return;
      const mouse = mouseRef.current;
      const target = targetMouseRef.current;
      mouse.x = lerp(mouse.x, target.x, LERP_SPEED);
      mouse.y = lerp(mouse.y, target.y, LERP_SPEED);
      draw(now);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isVisible || motionQuery.matches) {
        stopAnimation();
        draw(performance.now());
        return;
      }
      if (isAnimating) return;
      isAnimating = true;
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.getContext("2d")?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      sizeRef.current = { width, height };
      draw(performance.now());
    };

    const getLocalPoint = (event: PointerEvent | MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const point = getLocalPoint(event);
      if (mouseRef.current.x === OFFSCREEN_POINT) mouseRef.current = point;
      targetMouseRef.current = point;
    };

    const handlePointerLeave = () => {
      const offscreen = { x: OFFSCREEN_POINT, y: OFFSCREEN_POINT };
      mouseRef.current = offscreen;
      targetMouseRef.current = offscreen;
    };

    const handleClick = (event: MouseEvent) => {
      const point = getLocalPoint(event);
      ripplesRef.current.push({ ...point, radius: 0, opacity: 1, born: performance.now() });
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startAnimation();
      else stopAnimation();
    }, { rootMargin: "120px" });

    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    motionQuery.addEventListener("change", startAnimation);
    interactionTarget.addEventListener("pointermove", handlePointerMove);
    interactionTarget.addEventListener("pointerleave", handlePointerLeave);
    interactionTarget.addEventListener("click", handleClick);
    resize();

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", startAnimation);
      interactionTarget.removeEventListener("pointermove", handlePointerMove);
      interactionTarget.removeEventListener("pointerleave", handlePointerLeave);
      interactionTarget.removeEventListener("click", handleClick);
    };
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate min-h-screen w-full overflow-hidden",
        globalColor === "monochrome" ? "bg-ink" : "bg-[#161618]",
        className,
      )}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 size-full" aria-hidden="true" />
      <div className="relative z-[1] size-full">{children}</div>
    </div>
  );
}
