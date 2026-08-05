"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface HoverCircle {
  id: number;
  x: number;
  y: number;
  background: string;
}

type HoverButtonStyle = React.CSSProperties & {
  "--circle-start"?: string;
  "--circle-end"?: string;
};

export interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  (
    {
      children,
      className,
      disabled,
      onPointerCancel,
      onPointerEnter,
      onPointerLeave,
      onPointerMove,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listeningRef = React.useRef(false);
    const lastAddedRef = React.useRef(0);
    const nextIdRef = React.useRef(0);
    const timersRef = React.useRef(new Set<number>());
    const [circles, setCircles] = React.useState<HoverCircle[]>([]);
    const reduceMotion = useReducedMotion();

    const setRefs = React.useCallback((node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }, [forwardedRef]);

    const createCircle = React.useCallback((x: number, y: number) => {
      const width = buttonRef.current?.offsetWidth ?? 0;
      if (width === 0) return;

      const stop = Math.max(0, Math.min(100, (x / width) * 100));
      const id = nextIdRef.current;
      nextIdRef.current += 1;
      setCircles((current) => [
        ...current.slice(-11),
        {
          id,
          x,
          y,
          background: `linear-gradient(to right, var(--circle-start) ${stop}%, var(--circle-end) ${stop}%)`,
        },
      ]);

      const timer = window.setTimeout(() => {
        setCircles((current) => current.filter((circle) => circle.id !== id));
        timersRef.current.delete(timer);
      }, 1400);
      timersRef.current.add(timer);
    }, []);

    React.useEffect(() => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    }, []);

    const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
      if (
        event.defaultPrevented
        || disabled
        || reduceMotion
        || !listeningRef.current
        || event.pointerType === "touch"
      ) return;

      const now = performance.now();
      if (now - lastAddedRef.current < 100) return;

      lastAddedRef.current = now;
      const bounds = event.currentTarget.getBoundingClientRect();
      createCircle(event.clientX - bounds.left, event.clientY - bounds.top);
    }, [createCircle, disabled, onPointerMove, reduceMotion]);

    const handlePointerEnter = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(event);
      listeningRef.current = !event.defaultPrevented && !disabled && event.pointerType !== "touch";
    }, [disabled, onPointerEnter]);

    const stopListening = React.useCallback(() => {
      listeningRef.current = false;
    }, []);

    const handlePointerLeave = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event);
      stopListening();
    }, [onPointerLeave, stopListening]);

    const handlePointerCancel = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerCancel?.(event);
      stopListening();
    }, [onPointerCancel, stopListening]);

    const mergedStyle: HoverButtonStyle = {
      "--circle-start": "#9ef3d3",
      "--circle-end": "#00a870",
      ...style,
    };

    return (
      <button
        ref={setRefs}
        data-slot="hover-button"
        disabled={disabled}
        className={cn(
          "relative isolate inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden rounded-[12px] bg-ink px-5 text-base font-semibold leading-6 text-white",
          "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:shadow-[inset_0_0_0_1px_rgba(158,243,211,0.18),inset_0_0_16px_rgba(158,243,211,0.08),inset_0_-3px_12px_rgba(0,168,112,0.12)] before:transition-transform before:duration-300",
          "active:before:scale-[0.975] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        style={mergedStyle}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerCancel}
        {...props}
      >
        {circles.map((circle) => (
          <span
            key={circle.id}
            className="animate-hover-orb pointer-events-none absolute z-0 size-3 rounded-full blur-lg"
            style={{ left: circle.x, top: circle.y, background: circle.background }}
            aria-hidden="true"
          />
        ))}
        <span className="relative z-[2] inline-flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  },
);

HoverButton.displayName = "HoverButton";

export { HoverButton };
