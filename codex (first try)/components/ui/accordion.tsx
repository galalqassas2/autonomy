"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-hairline", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-ink transition-colors hover:text-brand-strong focus-visible:text-brand-strong data-[state=open]:text-brand-strong",
          className,
        )}
        {...props}
      >
        {children}
        <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-hairline bg-surface transition-transform duration-300 group-data-[state=open]:rotate-45">
          <Icon name="plus" size={18} aria-hidden />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
      <div className={cn("max-w-[68ch] pb-6 pr-14 text-base leading-7 text-body", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
