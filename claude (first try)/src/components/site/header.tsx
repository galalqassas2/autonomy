"use client"

import * as React from "react"
import { animate, onScroll, utils } from "animejs"
import { MobileDrawer } from "./header-mobile-drawer"
import { chapters } from "@/lib/nav"
import { cn } from "@/lib/utils"

import { RobotMark } from "./robot-mark"
import { Wordmark } from "./wordmark"

type Underline = { left: number; width: number }

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [pastHero, setPastHero] = React.useState(false)
  const [active, setActive] = React.useState<string | null>(null)
  const [underline, setUnderline] = React.useState<Underline | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const linksRef = React.useRef<HTMLElement>(null)
  const progressRef = React.useRef<HTMLSpanElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  /* A sentinel replaces a scroll listener for the 12px glass threshold. */
  React.useEffect(() => {
    const sentinel = sentinelRef.current
    const hero = document.getElementById("hero")
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)

    let heroObserver: IntersectionObserver | undefined
    if (hero) {
      heroObserver = new IntersectionObserver(
        ([entry]) => setPastHero(!entry.isIntersecting),
        { threshold: 0 },
      )
      heroObserver.observe(hero)
    }

    return () => {
      observer.disconnect()
      heroObserver?.disconnect()
    }
  }, [])

  /* The progress line is scrubbed by scroll position, not by a timer. */
  React.useEffect(() => {
    const bar = progressRef.current
    if (!bar) return
    utils.set(bar, { scaleX: 0 })
    const progress = animate(bar, {
      scaleX: [0, 1],
      ease: "linear",
      autoplay: onScroll({
        target: document.body,
        axis: "y",
        enter: "top top",
        leave: "bottom bottom",
        sync: true,
      }),
    })
    return () => {
      progress.revert()
    }
  }, [])

  /* A chapter counts as current while it crosses the header band. */
  React.useEffect(() => {
    const targets = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(chapters.find((c) => visible.has(c.id))?.id ?? null)
      },
      { rootMargin: "-64px 0px -85% 0px", threshold: 0 },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  /* Slide the underline onto whichever chapter is current. */
  React.useEffect(() => {
    const container = linksRef.current
    const link = container?.querySelector<HTMLElement>(
      `[data-chapter="${active}"]`,
    )
    setUnderline(
      link ? { left: link.offsetLeft, width: link.offsetWidth } : null,
    )
  }, [active, pastHero])

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-3 h-px w-px" />

      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-4">
        <div
          data-scrolled={scrolled}
          className={cn(
            "site-glass pointer-events-auto relative mx-auto flex w-full max-w-[1200px] items-center gap-4 overflow-hidden rounded-lg px-4 sm:px-5",
            scrolled ? "h-[52px]" : "h-[60px]",
          )}
        >
          <a href="#hero" className="flex shrink-0 items-center gap-2 text-ink">
            <RobotMark size={26} />
            <Wordmark />
            <span className="sr-only">Autonomy, back to the top</span>
          </a>

          <nav
            ref={linksRef}
            aria-label="Chapters"
            className={cn(
              "relative mx-auto hidden items-center gap-6 transition-opacity duration-300 xl:flex",
              pastHero ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                data-chapter={chapter.id}
                aria-current={active === chapter.id ? "true" : undefined}
                className={cn(
                  "text-sm leading-none transition-colors duration-200",
                  active === chapter.id
                    ? "text-ink"
                    : "text-ink-mute hover:text-ink",
                )}
              >
                {chapter.label}
              </a>
            ))}
            <span
              aria-hidden="true"
              className="absolute -bottom-2 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out"
              style={{
                left: underline?.left ?? 0,
                width: underline?.width ?? 0,
                opacity: underline ? 1 : 0,
              }}
            />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a
              href="#start"
              className={cn(
                "btn btn-primary hidden h-9 px-4 md:inline-flex",
                scrolled && "h-[34px]",
              )}
            >
              <span className="xl:hidden">Get started</span>
              <span className="hidden xl:inline">Start your first automation</span>
            </a>

            <MobileDrawer
              chapters={chapters}
              active={active}
              open={sheetOpen}
              onOpenChange={setSheetOpen}
            />
          </div>

          <span
            ref={progressRef}
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary"
          />
        </div>
      </header>
    </>
  )
}
