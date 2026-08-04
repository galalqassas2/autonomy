"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={cn(
          "dialog-content fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[38rem] -translate-x-1/2 -translate-y-1/2 gap-6 overscroll-contain overflow-y-auto rounded-[20px] border border-white/80 bg-white p-6 shadow-[0_28px_90px_-28px_rgba(12,21,18,0.45)] sm:p-8",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 grid size-11 place-items-center rounded-[12px] text-muted transition-colors hover:bg-surface hover:text-ink" aria-label="Close form">
          <Icon name="x" size={20} aria-hidden />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-3xl font-semibold tracking-[-0.035em] text-ink", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("max-w-[52ch] text-base leading-7 text-body", className)} {...props} />;
}
