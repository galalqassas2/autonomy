"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

type AnimatedNumberProps = {
  format: (value: number) => string;
  value: number;
};

export function AnimatedNumber({ format, value }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (ref.current) ref.current.textContent = format(latest);
  });

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] });
    return () => controls.stop();
  }, [motionValue, value]);

  return <span ref={ref}>{format(value)}</span>;
}
