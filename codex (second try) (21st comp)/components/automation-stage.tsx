"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import { ArrowsInIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";

import { FlowCanvas } from "@/components/flow-canvas";
import { HoverButton } from "@/components/hover-button";
import { LeadDialog } from "@/components/lead-dialog";

const KineticGrid = dynamic(() => import("@/components/kinetic-grid"), { ssr: false });

const captions = [
  "An order arrives from your store.",
  "Stock is checked. Nobody asked it to.",
  "The invoice writes itself.",
  "Your team is told. Elapsed: 1.2 seconds.",
];

const logLines = ["Order received", "Stock confirmed", "Invoice created", "Team notified"];

export default function AutomationStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const frameIdRef = useRef(0);
  const activeStepRef = useRef(0);
  const touchesRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef({ distance: 0, zoom: 100, panX: 0, panY: 0, mouseX: 0, mouseY: 0, dragging: false });
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const resetView = useCallback(() => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setOrigin({ x: 50, y: 50 });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStarted(true);
      setActiveStep(4);
      setCompleted(true);
      if (totalRef.current) totalRef.current.textContent = "1.2";
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting && !reduce) setStarted(true);
      if (!entry.isIntersecting) {
        const rect = entry.boundingClientRect;
        if (rect.top > innerHeight || rect.bottom < -innerHeight) resetView();
      }
    }, { threshold: 0.4 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [resetView]);

  useEffect(() => {
    if (!visible || !started || completed) return;
    lastRef.current = performance.now();
    const tick = (time: number) => {
      elapsedRef.current += time - lastRef.current;
      lastRef.current = time;
      const nextStep = Math.min(3, Math.floor(elapsedRef.current / 1875));
      if (nextStep !== activeStepRef.current) {
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
      }
      if (elapsedRef.current >= 7500) {
        setCompleted(true);
        setActiveStep(4);
        const countStarted = performance.now();
        const count = (now: number) => {
          const value = Math.min(1.2, ((now - countStarted) / 600) * 1.2);
          if (totalRef.current) totalRef.current.textContent = value.toFixed(1);
          if (value < 1.2) requestAnimationFrame(count);
        };
        requestAnimationFrame(count);
        return;
      }
      frameIdRef.current = requestAnimationFrame(tick);
    };
    frameIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameIdRef.current);
  }, [completed, started, visible]);

  function replay() {
    cancelAnimationFrame(frameIdRef.current);
    elapsedRef.current = 0;
    activeStepRef.current = 0;
    setActiveStep(0);
    setCompleted(false);
    setStarted(true);
    if (totalRef.current) totalRef.current.textContent = "0.0";
  }

  function setZoomLevel(next: number, point = { x: 50, y: 50 }) {
    setZoom(Math.max(50, Math.min(150, Math.round(next / 10) * 10)));
    setOrigin(point);
  }

  function wheel(event: WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomLevel(zoom + (event.deltaY < 0 ? 10 : -10), { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      touchesRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchesRef.current.size === 2) {
        const [a, b] = [...touchesRef.current.values()];
        gestureRef.current.distance = Math.hypot(a.x - b.x, a.y - b.y);
        gestureRef.current.zoom = zoom;
        gestureRef.current.panX = pan.x;
        gestureRef.current.panY = pan.y;
        gestureRef.current.mouseX = (a.x + b.x) / 2;
        gestureRef.current.mouseY = (a.y + b.y) / 2;
      }
      return;
    }
    if (event.button !== 0 || !frameRef.current) return;
    const contentIsLarger = 1650 * (zoom / 100) > frameRef.current.clientWidth;
    if (!contentIsLarger) return;
    gestureRef.current = { ...gestureRef.current, mouseX: event.clientX, mouseY: event.clientY, panX: pan.x, panY: pan.y, dragging: true };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      if (!touchesRef.current.has(event.pointerId)) return;
      touchesRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchesRef.current.size === 2) {
        event.preventDefault();
        const [a, b] = [...touchesRef.current.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        setZoomLevel(gestureRef.current.zoom * (distance / gestureRef.current.distance));
        setPan({
          x: gestureRef.current.panX + (a.x + b.x) / 2 - gestureRef.current.mouseX,
          y: gestureRef.current.panY + (a.y + b.y) / 2 - gestureRef.current.mouseY,
        });
      }
      return;
    }
    if (!gestureRef.current.dragging) return;
    setPan({ x: gestureRef.current.panX + event.clientX - gestureRef.current.mouseX, y: gestureRef.current.panY + event.clientY - gestureRef.current.mouseY });
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    touchesRef.current.delete(event.pointerId);
    gestureRef.current.dragging = false;
  }

  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "+" || event.key === "=") setZoomLevel(zoom + 10);
    if (event.key === "-") setZoomLevel(zoom - 10);
    if (event.key === "0") resetView();
  }

  return (
    <section className="automation-stage section" ref={sectionRef}>
      <KineticGrid />
      <div className="container automation-content">
        <p className="automation-caption" aria-live="polite">{captions[Math.min(activeStep, 3)]}</p>
        <div
          aria-label="Automation canvas zoom controls"
          className="zoom-frame"
          onKeyDown={keyDown}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onWheel={wheel}
          ref={frameRef}
          tabIndex={0}
        >
          <div className="zoom-layer" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`, transformOrigin: `${origin.x}% ${origin.y}%` }}>
            <FlowCanvas activeStep={activeStep} completed={completed} controlDisabled={!completed} controlLabel={completed ? "Replay" : "Run"} onControl={completed ? replay : undefined} />
          </div>
          <div className="zoom-controls" role="group" aria-label="Canvas zoom">
            <button aria-label="Zoom out" onClick={() => setZoomLevel(zoom - 10)} type="button"><MinusIcon aria-hidden="true" /></button>
            <output aria-live="polite" aria-label={`Zoom level ${zoom} percent`}>{zoom}%</output>
            <button aria-label="Zoom in" onClick={() => setZoomLevel(zoom + 10)} type="button"><PlusIcon aria-hidden="true" /></button>
            <button aria-label="Fit canvas" onClick={resetView} type="button"><ArrowsInIcon aria-hidden="true" /></button>
          </div>
        </div>
        <div className="run-log" aria-label="Automation run log">
          {logLines.map((line, index) => (
            <div className={index <= activeStep || completed ? "is-printed" : ""} key={line}>
              <time>Now</time><span>{line}</span><b>{index < activeStep || completed ? "done" : "waiting"}</b>
            </div>
          ))}
        </div>
        <div className="automation-total">
          <span>Total time</span>
          <strong><span ref={totalRef}>{completed ? "1.2" : "0.0"}</span> seconds</strong>
        </div>
        <div className="automation-cta">
          <p>That is one process. Most teams have twelve.</p>
          <LeadDialog><HoverButton>Start your first automation</HoverButton></LeadDialog>
        </div>
      </div>
    </section>
  );
}
