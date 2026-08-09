"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  HandPalmIcon,
} from "@phosphor-icons/react/dist/ssr"
import { createTimeline, stagger, utils } from "animejs"

import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect"

const OUTCOMES = [
  { trigger: "Deal won", result: "Invoice sent", icon: CheckCircleIcon },
  { trigger: "New customer", result: "Record added", icon: CheckCircleIcon },
  { trigger: "Refund outside policy", result: "Asks you", icon: HandPalmIcon },
] as const

export function JudgmentList() {
  const listRef = React.useRef<HTMLUListElement>(null)

  useIsoLayoutEffect(() => {
    const list = listRef.current
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-judgment-row]"))
    const results = Array.from(
      list.querySelectorAll<HTMLElement>("[data-judgment-result]"),
    )

    utils.set(rows, { opacity: 0, translateY: 14 })
    utils.set(results, { opacity: 0, translateX: 10 })

    let timeline: ReturnType<typeof createTimeline> | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        timeline = createTimeline({ defaults: { ease: "outExpo" } })
          .add(rows, {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 420,
            delay: stagger(70),
          })
          .add(
            results,
            {
              opacity: [0, 1],
              translateX: [10, 0],
              duration: 360,
              delay: stagger(70),
            },
            "-=320",
          )

        observer.disconnect()
      },
      { threshold: 0.3 },
    )

    observer.observe(list)
    return () => {
      observer.disconnect()
      timeline?.revert()
      utils.set([...rows, ...results], { opacity: 1, transform: "none" })
    }
  }, [])

  return (
    <ul ref={listRef} aria-label="Example automation outcomes" className="judgment-list">
      {OUTCOMES.map((item) => {
        const StatusIcon = item.icon

        return (
          <li key={item.trigger} data-judgment-row className="judgment-item">
            <span className="t-body-md judgment-trigger">{item.trigger}</span>
            <ArrowRightIcon aria-hidden="true" size={16} className="judgment-arrow" />
            <span data-judgment-result className="t-body-md judgment-result">
              <StatusIcon aria-hidden="true" size={22} weight="fill" />
              {item.result}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
