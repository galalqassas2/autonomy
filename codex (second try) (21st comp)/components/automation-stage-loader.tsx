"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AutomationStage = dynamic(() => import("@/components/automation-stage"), { ssr: false });

export function AutomationStageLoader() {
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
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="automation-loader" id="automation" ref={ref}>{near ? <AutomationStage /> : <div className="automation-placeholder" aria-hidden="true" />}</div>;
}
