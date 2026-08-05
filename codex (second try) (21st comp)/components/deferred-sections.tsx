"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";

const DepartmentSelector = dynamic(() => import("@/components/department-selector").then((module) => module.DepartmentSelector), { ssr: false });
const TimeCalculator = dynamic(() => import("@/components/time-calculator").then((module) => module.TimeCalculator), { ssr: false });
const IntegrationMarquee = dynamic(() => import("@/components/integration-marquee").then((module) => module.IntegrationMarquee), { ssr: false });
const FAQ = dynamic(() => import("@/components/faq").then((module) => module.FAQ), { ssr: false });

function DeferredSection({ Component, id, minHeight }: { Component: ComponentType; id: string; minHeight: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "500px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} ref={ref} style={near ? undefined : { minHeight }}>
      {near ? <Component /> : null}
    </div>
  );
}

export function DepartmentSelectorLoader() {
  return <DeferredSection Component={DepartmentSelector} id="departments" minHeight={820} />;
}

export function TimeCalculatorLoader() {
  return <DeferredSection Component={TimeCalculator} id="time" minHeight={780} />;
}

export function IntegrationMarqueeLoader() {
  return <DeferredSection Component={IntegrationMarquee} id="integrations" minHeight={940} />;
}

export function FAQLoader() {
  return <DeferredSection Component={FAQ} id="faq" minHeight={620} />;
}
