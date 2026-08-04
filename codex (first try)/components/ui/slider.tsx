"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-11 w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-[#dfe5e2]">
        <SliderPrimitive.Range className="absolute h-full bg-brand-strong" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-5 rounded-full border-[5px] border-white bg-brand-strong shadow-[0_0_0_1px_rgba(4,107,74,0.28),0_4px_10px_rgba(12,21,18,0.18)] transition-transform active:scale-110" />
    </SliderPrimitive.Root>
  );
}
