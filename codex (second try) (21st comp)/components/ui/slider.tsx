"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root className={cn("slider", className)} {...props}>
      <SliderPrimitive.Track className="slider-track">
        <SliderPrimitive.Range className="slider-range" />
      </SliderPrimitive.Track>
      {Array.from({ length: props.value?.length ?? props.defaultValue?.length ?? 1 }).map((_, index) => (
        <SliderPrimitive.Thumb className="slider-thumb" key={index} />
      ))}
    </SliderPrimitive.Root>
  );
}
