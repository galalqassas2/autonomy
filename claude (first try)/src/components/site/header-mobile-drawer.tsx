"use client"

import * as React from "react"
import { CaretRightIcon, ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Wordmark } from "./wordmark"

type Chapter = { id: string; label: string }

export function MobileDrawer({
  chapters,
  active,
  open,
  onOpenChange,
}: {
  chapters: readonly Chapter[]
  active: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open chapters"
            className="grid size-9 place-items-center rounded-sm text-ink transition-colors hover:bg-white/10 xl:hidden"
          />
        }
      >
        <ListIcon size={20} />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[min(88vw,340px)] gap-0 border-l border-hairline bg-canvas-night p-0"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-hairline px-5 py-4">
          <SheetTitle className="text-ink">
            <Wordmark />
          </SheetTitle>
          <SheetClose
            render={
              <button
                type="button"
                aria-label="Close chapters"
                className="grid size-9 place-items-center rounded-sm text-ink-mute transition-colors hover:bg-white/[0.06] hover:text-ink"
              />
            }
          >
            <XIcon size={18} />
          </SheetClose>
        </SheetHeader>

        <nav aria-label="Chapters" className="flex flex-col p-3">
          {chapters.map((chapter, i) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              onClick={() => onOpenChange(false)}
              aria-current={active === chapter.id ? "true" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3.5 transition-colors",
                active === chapter.id
                  ? "bg-primary/[0.09] text-ink"
                  : "text-ink-mute hover:bg-white/[0.04] hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "t-mono w-5 shrink-0 text-xs",
                  active === chapter.id ? "text-primary" : "text-ink-faint",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium">{chapter.label}</span>
              <CaretRightIcon
                size={14}
                className="ml-auto shrink-0 text-ink-faint"
              />
            </a>
          ))}
        </nav>

        <div className="mt-auto border-t border-hairline p-4">
          <a
            href="#start"
            onClick={() => onOpenChange(false)}
            className="btn btn-primary btn-cta w-full"
          >
            Find your first automation
          </a>
          <p className="t-caption mt-3 text-center text-ink-mute-2">
            Hosted in Ireland. Never trained on your data.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
