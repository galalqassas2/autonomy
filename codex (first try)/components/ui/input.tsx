import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[12px] border border-hairline-strong bg-white px-4 text-base text-ink transition-[border-color,box-shadow] placeholder:text-muted focus-visible:border-brand-strong focus-visible:shadow-[0_0_0_3px_rgba(0,168,112,0.14)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
