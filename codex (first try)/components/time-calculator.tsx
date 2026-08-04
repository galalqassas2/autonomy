"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { useReducedMotion } from "motion/react";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Values = { people: number; times: number; minutes: number };
type Currency = "EUR" | "GBP" | "USD";

const numberFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });
const currencyFormatters: Record<Currency, Intl.NumberFormat> = {
  EUR: new Intl.NumberFormat("en", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
  GBP: new Intl.NumberFormat("en", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
};

export function TimeCalculator() {
  const [values, setValues] = useState<Values>({ people: 3, times: 12, minutes: 6 });
  const [hourly, setHourly] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const dailyHours = (values.people * values.times * values.minutes) / 60;
  const weeklyHours = dailyHours * 5;
  const yearlyHours = weeklyHours * 52;
  const monthlyHours = yearlyHours / 12;
  const workingDays = yearlyHours / 8;
  const hourlyCost = Number(hourly);
  const annualCost = hourly && Number.isFinite(hourlyCost) ? yearlyHours * Math.max(0, hourlyCost) : null;
  const weekCells = Math.min(40, Math.round(weeklyHours));

  return (
    <div className="mt-12 overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_24px_56px_-28px_rgba(12,21,18,0.18)]">
      <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
        <div className="border-b border-hairline bg-surface p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 border-b border-hairline pb-6">
            <span className="grid size-11 place-items-center rounded-[12px] bg-brand-tint text-brand-strong"><Icon name="sliders-horizontal-duotone" size={24} aria-hidden /></span>
            <div><h3 className="font-semibold text-ink">Your inputs</h3><p className="mt-1 text-sm text-muted">Change anything. Results update instantly.</p></div>
          </div>
          <div className="mt-6 flex flex-col gap-6">
            <RangeField label="People doing this task" value={values.people} min={1} max={50} onChange={(people) => setValues((current) => ({ ...current, people }))} />
            <RangeField label="Times per day" value={values.times} min={1} max={100} onChange={(times) => setValues((current) => ({ ...current, times }))} />
            <RangeField label="Minutes each time" value={values.minutes} min={1} max={60} onChange={(minutes) => setValues((current) => ({ ...current, minutes }))} />
          </div>
          <div className="mt-7 border-t border-hairline pt-6">
            <label htmlFor="hourly-cost" className="mb-2 block text-sm font-semibold text-ink">Average hourly cost <span className="font-normal text-muted">Optional</span></label>
            <div className="grid grid-cols-[92px_1fr] gap-2">
              <select name="currency" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} aria-label="Currency" className="h-12 rounded-[12px] border border-hairline-strong bg-white px-3 text-sm font-semibold text-ink focus-visible:border-brand-strong">
                <option value="EUR">EUR</option><option value="GBP">GBP</option><option value="USD">USD</option>
              </select>
              <Input id="hourly-cost" name="hourly-cost" type="number" min="0" inputMode="decimal" placeholder="Optional…" value={hourly} onChange={(event) => setHourly(event.target.value)} autoComplete="off" />
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">We hide the cost result until you add your own number.</p>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold text-muted">Time returned to your team</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <Metric value={monthlyHours} label="hours per month" />
            <Metric value={workingDays} label="working days per year" />
            {annualCost !== null && (
              <div className="sm:col-span-2 border-t border-hairline pt-6">
                <Metric value={annualCost} label="cost per year" currency={currency} />
              </div>
            )}
          </div>
          <div className="mt-9 border-t border-hairline pt-7">
            <div className="mb-4 flex items-center justify-between gap-4"><h4 className="text-sm font-semibold text-ink">A working week, reclaimed</h4><span className="text-xs font-medium text-muted">Each cell is one hour</span></div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3" aria-label={`${weekCells} hours reclaimed in a working week`}>
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, dayIndex) => (
                <div key={day}>
                  <div className="mb-2 text-center text-[0.68rem] font-semibold text-muted">{day}</div>
                  <div className="flex flex-col-reverse gap-1.5">
                    {Array.from({ length: 8 }, (_, index) => {
                      const filled = dayIndex * 8 + index < weekCells;
                      return <span key={index} className={`h-3 rounded-[4px] border transition-colors duration-300 ${filled ? "border-brand/30 bg-brand" : "border-hairline bg-surface"}`} style={{ transitionDelay: `${index * 40}ms` }} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-hairline bg-white px-5 py-4 text-sm leading-6 text-body sm:px-8">These are your numbers, not ours. We will check them with you in the first hour.</div>
    </div>
  );
}

function RangeField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-4"><label className="text-sm font-semibold text-ink">{label}</label><output className="min-w-12 rounded-[9px] border border-hairline bg-white px-2 py-1 text-center text-sm font-semibold tabular-nums text-ink">{value}</output></div>
      <Slider min={min} max={max} step={1} value={[value]} onValueChange={([next]) => onChange(next)} aria-label={label} aria-valuetext={`${value} ${label.toLowerCase()}`} />
      <div className="flex justify-between text-[0.68rem] font-medium text-muted"><span>{min}</span><span>{max}</span></div>
    </div>
  );
}

function Metric({ value, label, currency }: { value: number; label: string; currency?: Currency }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, { duration: 0.6, ease: [0.22, 0.61, 0.36, 1], onUpdate: setDisplay });
    previous.current = value;
    return () => controls.stop();
  }, [reduceMotion, value]);

  const formatter = currency ? currencyFormatters[currency] : numberFormatter;
  const content = formatter.format(Math.max(0, display));
  return (
    <div>
      <strong className="block break-words text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.06em] tabular-nums text-brand-strong">{content}</strong>
      <span className="mt-2 block text-sm font-medium text-body">{label}</span>
    </div>
  );
}
