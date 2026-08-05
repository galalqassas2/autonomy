"use client";

import { useMemo, useState } from "react";

import { AnimatedNumber } from "@/components/animated-number";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const currencies = ["EUR", "GBP", "USD"] as const;

export function TimeCalculator() {
  const [people, setPeople] = useState(3);
  const [times, setTimes] = useState(12);
  const [minutes, setMinutes] = useState(6);
  const [cost, setCost] = useState("");
  const [currency, setCurrency] = useState<(typeof currencies)[number]>("EUR");
  const results = useMemo(() => {
    const monthlyHours = Math.max(0, people * times * minutes * 20 / 60);
    const annualDays = monthlyHours * 12 / 8;
    const hourlyCost = Math.max(0, Number(cost) || 0);
    return { monthlyHours, annualDays, annualCost: hourlyCost * monthlyHours * 12 };
  }, [cost, minutes, people, times]);
  const filled = Math.min(40, Math.round(results.monthlyHours / 2));

  return (
    <section className="section section-soft">
      <div className="container calculator-layout">
        <div className="calculator-copy">
          <h2>You are not buying software.<br />You are buying back hours.</h2>
          <p>Put in your own numbers. The answer below is yours, we did not choose it.</p>
          <div className="calculator-controls">
            <CalculatorSlider label="People doing this task" max={50} min={1} onChange={setPeople} value={people} />
            <CalculatorSlider label="Times per day" max={100} min={1} onChange={setTimes} value={times} />
            <CalculatorSlider label="Minutes each time" max={60} min={1} onChange={setMinutes} value={minutes} />
            <div className="cost-field">
              <label htmlFor="hourly-cost">Average hourly cost</label>
              <div>
                <select aria-label="Currency" className="select" onChange={(event) => setCurrency(event.target.value as (typeof currencies)[number])} value={currency}>
                  {currencies.map((item) => <option key={item}>{item}</option>)}
                </select>
                <Input id="hourly-cost" inputMode="decimal" min="0" onChange={(event) => setCost(event.target.value)} placeholder="Optional" type="number" value={cost} />
              </div>
            </div>
          </div>
        </div>
        <div className="calculator-results" aria-live="polite">
          <div className="result-grid">
            <article><strong>{results.monthlyHours > 40 ? "40+" : <AnimatedNumber format={(value) => Math.round(value).toLocaleString()} value={results.monthlyHours} />}</strong><span>hours per month</span></article>
            <article><strong><AnimatedNumber format={(value) => Math.round(value).toLocaleString()} value={results.annualDays} /></strong><span>working days per year</span></article>
            {cost && <article><strong><AnimatedNumber format={(value) => new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)} value={results.annualCost} /></strong><span>cost per year</span></article>}
          </div>
          <div className="week-grid" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, index) => <i className={index >= 40 - filled ? "is-filled" : ""} key={index} style={{ "--cell-index": index } as React.CSSProperties} />)}
          </div>
          <p>These are your numbers, not ours. We will check them with you in the first hour.</p>
        </div>
      </div>
    </section>
  );
}

function CalculatorSlider({ label, max, min, onChange, value }: { label: string; max: number; min: number; onChange: (value: number) => void; value: number }) {
  return (
    <div className="calculator-slider">
      <div><label>{label}</label><output>{value}</output></div>
      <Slider aria-label={label} aria-valuetext={`${value} ${label.toLowerCase()}`} max={max} min={min} onValueChange={([next]) => onChange(next)} step={1} value={[value]} />
      <span><small>{min}</small><small>{max}</small></span>
    </div>
  );
}
