"use client";

import { forwardRef, useEffect, useRef, useState, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

type Circle = {
  id: number;
  x: number;
  y: number;
  fading: boolean;
};

type HoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const HoverButton = forwardRef<HTMLButtonElement, HoverButtonProps>(function HoverButton({ className, children, disabled, ...props }, ref) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const timeouts = useRef<number[]>([]);
  const counter = useRef(0);
  const blocked = useRef(false);

  useEffect(() => {
    blocked.current = matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => timeouts.current.forEach((timeout) => clearTimeout(timeout));
  }, []);

  function createCircle(event: MouseEvent<HTMLButtonElement>) {
    if (blocked.current || disabled || circles.length >= 12) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const id = counter.current++;
    setCircles((current) => [...current, { id, x: event.clientX - rect.left, y: event.clientY - rect.top, fading: false }]);
    const fade = window.setTimeout(() => {
      setCircles((current) => current.map((circle) => circle.id === id ? { ...circle, fading: true } : circle));
    }, 280);
    const remove = window.setTimeout(() => {
      setCircles((current) => current.filter((circle) => circle.id !== id));
      timeouts.current = timeouts.current.filter((timeout) => timeout !== fade && timeout !== remove);
    }, 760);
    timeouts.current.push(fade, remove);
  }

  return (
    <button className={cn("hover-button", className)} disabled={disabled} onMouseMove={createCircle} ref={ref} type="button" {...props}>
      <span className="hover-button-label">{children}</span>
      {circles.map((circle) => (
        <span className={cn("hover-circle", circle.fading && "is-fading")} key={circle.id} style={{ left: circle.x, top: circle.y }} />
      ))}
    </button>
  );
});
