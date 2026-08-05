"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

type Point = { x: number; y: number };

export default function KineticGrid() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const activeRef = useRef(false);
  const visibleRef = useRef(true);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1, cell: 72, cols: 0, rows: 0 });
  const pointsRef = useRef<Float32Array>(new Float32Array());
  const pointerRef = useRef<Point>({ x: -9999, y: -9999 });
  const targetRef = useRef<Point>({ x: -9999, y: -9999 });
  const rippleRef = useRef({ x: 0, y: 0, started: 0 });
  const [staticGrid, setStaticGrid] = useState(true);

  useEffect(() => {
    const media = matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setStaticGrid(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (staticGrid) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const drawContext = context;

    function resize() {
      if (!wrapper || !canvas) return;
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const cell = rect.width < 1024 ? 96 : 72;
      const cols = Math.ceil(rect.width / cell) + 2;
      const rows = Math.ceil(rect.height / cell) + 2;
      sizeRef.current = { width: rect.width, height: rect.height, dpr, cell, cols, rows };
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      drawContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointsRef.current = new Float32Array(cols * rows * 2);
    }

    function draw(time: number) {
      const { width, height, cell, cols, rows } = sizeRef.current;
      pointerRef.current.x += (targetRef.current.x - pointerRef.current.x) * 0.08;
      pointerRef.current.y += (targetRef.current.y - pointerRef.current.y) * 0.08;
      const points = pointsRef.current;
      const rippleAge = time - rippleRef.current.started;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const index = (row * cols + col) * 2;
          const baseX = (col - 1) * cell;
          const baseY = (row - 1) * cell;
          const dx = baseX - pointerRef.current.x;
          const dy = baseY - pointerRef.current.y;
          const distance = Math.hypot(dx, dy);
          const pull = Math.max(0, 1 - distance / 230) * 18;
          const rippleDistance = Math.hypot(baseX - rippleRef.current.x, baseY - rippleRef.current.y);
          const ripple = rippleAge < 1100 ? Math.sin((rippleDistance - rippleAge * 0.28) * 0.08) * Math.max(0, 1 - Math.abs(rippleDistance - rippleAge * 0.28) / 110) * 8 : 0;
          points[index] = baseX - (distance ? dx / distance : 0) * pull;
          points[index + 1] = baseY - (distance ? dy / distance : 0) * pull + ripple;
        }
      }

      drawContext.clearRect(0, 0, width, height);
      drawContext.lineWidth = 1;
      drawContext.strokeStyle = "rgba(255,255,255,0.13)";
      for (let row = 0; row < rows; row += 1) {
        drawContext.beginPath();
        for (let col = 0; col < cols; col += 1) {
          const index = (row * cols + col) * 2;
          if (col === 0) drawContext.moveTo(points[index], points[index + 1]); else drawContext.lineTo(points[index], points[index + 1]);
        }
        drawContext.stroke();
      }
      for (let col = 0; col < cols; col += 1) {
        drawContext.beginPath();
        for (let row = 0; row < rows; row += 1) {
          const index = (row * cols + col) * 2;
          if (row === 0) drawContext.moveTo(points[index], points[index + 1]); else drawContext.lineTo(points[index], points[index + 1]);
        }
        drawContext.stroke();
      }
      if (activeRef.current && visibleRef.current) frameRef.current = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      activeRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(draw);
      }
    }, { rootMargin: "200px" });
    intersectionObserver.observe(wrapper);
    const visibility = () => {
      visibleRef.current = !document.hidden;
      if (!document.hidden && activeRef.current) frameRef.current = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", visibility);
    resize();

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [staticGrid]);

  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    targetRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function ripple(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    rippleRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, started: performance.now() };
  }

  return (
    <div className="kinetic-grid" onPointerDown={ripple} onPointerLeave={() => { targetRef.current = { x: -9999, y: -9999 }; }} onPointerMove={move} ref={wrapperRef}>
      {staticGrid ? <div className="static-dot-grid" /> : <canvas aria-hidden="true" ref={canvasRef} />}
    </div>
  );
}
