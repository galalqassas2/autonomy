import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[12px] px-5 text-[0.92rem] font-semibold transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white shadow-[0_10px_28px_-16px_rgba(12,21,18,0.7)] hover:-translate-y-px hover:bg-[#16231f] hover:shadow-[0_14px_32px_-16px_rgba(12,21,18,0.58)]",
        secondary:
          "border border-hairline-strong bg-white text-ink hover:-translate-y-px hover:border-ink/25 hover:shadow-[0_10px_24px_-18px_rgba(12,21,18,0.35)]",
        ghost: "bg-transparent px-3 text-ink hover:bg-surface",
        icon: "size-11 rounded-[12px] border border-hairline bg-white p-0 text-ink hover:border-hairline-strong hover:bg-surface",
      },
      size: {
        default: "h-12",
        sm: "h-11 px-4 text-sm",
        lg: "h-[3.35rem] px-6",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
