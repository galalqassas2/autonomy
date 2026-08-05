"use client"

import * as React from "react"

import { useCountUp } from "@/components/fx/count-up"
import { Slider } from "@/components/ui/slider"

import { WeekGrid } from "./week-grid"

const WORKING_DAYS_PER_MONTH = 21.67
const WORKING_HOURS_PER_DAY = 8
const CURRENCIES = ["EUR", "GBP", "USD"] as const

type Currency = (typeof CURRENCIES)[number]

const inputs = [
  { key: "people", label: "People doing this task", min: 1, max: 50, initial: 3 },
  { key: "times", label: "Times per day", min: 1, max: 100, initial: 12 },
  { key: "minutes", label: "Minutes each time", min: 1, max: 60, initial: 6 },
] as const

const whole = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 0 })

function Result({
  value,
  label,
  suffix,
  prefix,
  capped,
}: {
  value: number
  label: string
  suffix?: string
  prefix?: string
  capped?: boolean
}) {
  const shown = useCountUp(value)
  return (
    <div className="flex flex-col gap-1">
      <p className="tabular text-[36px] leading-none font-medium text-ink">
        {prefix}
        {whole.format(Math.max(0, shown))}
        {capped ? "+" : ""}
        {suffix}
      </p>
      <p className="t-caption text-ink-mute">{label}</p>
    </div>
  )
}

export function TimeCalculator() {
  const [values, setValues] = React.useState({ people: 3, times: 12, minutes: 6 })
  const [rate, setRate] = React.useState("")
  const [currency, setCurrency] = React.useState<Currency>("EUR")

  const minutesPerDay = values.people * values.times * values.minutes
  const rawHoursPerMonth = (minutesPerDay * WORKING_DAYS_PER_MONTH) / 60
  /* Nobody spends more time on a task than the people have in a month. */
  const ceiling = values.people * WORKING_DAYS_PER_MONTH * WORKING_HOURS_PER_DAY
  const capped = rawHoursPerMonth > ceiling
  const hoursPerMonth = Math.min(rawHoursPerMonth, ceiling)

  const hoursPerYear = hoursPerMonth * 12
  const daysPerYear = hoursPerYear / WORKING_HOURS_PER_DAY
  const hoursPerWeek = (hoursPerMonth * 12) / 52

  const parsedRate = Number.parseFloat(rate)
  const showMoney = rate.trim() !== "" && Number.isFinite(parsedRate) && parsedRate > 0
  const costPerYear = showMoney ? hoursPerYear * parsedRate : 0

  const symbol = { EUR: "€", GBP: "£", USD: "$" }[currency]

  return (
    <section id="your-time" className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl max-w-[18ch] text-ink">
          You are not buying software.
          <br />
          You are buying back hours.
        </h2>
        <p className="t-body-lg mt-5 max-w-[56ch] text-ink-mute">
          Put in your own numbers. The answer below is yours, we did not choose it.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-7">
            {inputs.map((input) => (
              <div key={input.key} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={input.key} className="text-sm font-medium text-ink">
                    {input.label}
                  </label>
                  <span className="tabular text-sm text-ink-mute">
                    {values[input.key]}
                  </span>
                </div>
                <Slider
                  id={input.key}
                  min={input.min}
                  max={input.max}
                  step={1}
                  value={[values[input.key]]}
                  onValueChange={(next) =>
                    setValues((v) => ({
                      ...v,
                      [input.key]: Array.isArray(next) ? next[0] : next,
                    }))
                  }
                  valueText={`${values[input.key]} ${input.label.toLowerCase()}`}
                  thumbLabel={input.label}
                />
              </div>
            ))}

            <div className="flex flex-col gap-3 border-t border-hairline pt-7">
              <label htmlFor="rate" className="text-sm font-medium text-ink">
                Average hourly cost
                <span className="ml-2 font-normal text-ink-mute">optional</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="rate"
                  inputMode="decimal"
                  value={rate}
                  onChange={(event) =>
                    setRate(event.target.value.replace(/[^\d.]/g, ""))
                  }
                  placeholder="Leave blank to skip"
                  className="field"
                />
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as Currency)}
                  aria-label="Currency"
                  className="field w-auto shrink-0"
                >
                  {CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <div className="grid gap-8 sm:grid-cols-2">
              <Result
                value={hoursPerMonth}
                capped={capped}
                label="hours per month"
              />
              <Result value={daysPerYear} label="working days per year" />
              {showMoney ? (
                <Result
                  value={costPerYear}
                  prefix={symbol}
                  label="cost per year"
                />
              ) : null}
            </div>

            <WeekGrid hoursPerWeek={hoursPerWeek} />

            <p className="t-caption text-ink-mute">
              These are your numbers, not ours. We will check them with you in the
              first hour.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
