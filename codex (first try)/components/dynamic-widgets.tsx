"use client";

import dynamic from "next/dynamic";

function InstrumentSkeleton({ height = 420, label }: { height?: number; label: string }) {
  return (
    <div
      className="mt-12 animate-pulse overflow-hidden rounded-[20px] border border-hairline bg-white p-6 sm:p-8"
      style={{ minHeight: height }}
      role="status"
      aria-label={label}
    >
      <div className="h-5 w-32 rounded-md bg-surface" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-44 rounded-[14px] bg-surface" />
        <div className="h-44 rounded-[14px] bg-surface" />
      </div>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="mt-14 grid animate-pulse gap-8 md:grid-cols-4" role="status" aria-label="Loading build steps">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="grid grid-cols-[56px_1fr] gap-4 md:block">
          <div className="size-14 rounded-[14px] bg-surface" />
          <div className="md:mt-6">
            <div className="h-5 w-24 rounded bg-surface" />
            <div className="mt-4 h-16 rounded bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConstellationSkeleton() {
  return (
    <div className="mt-12 animate-pulse" role="status" aria-label="Loading connected tools">
      <div className="mx-auto h-12 max-w-xl rounded-[12px] bg-white" />
      <div className="mx-auto mt-10 min-h-[560px] max-w-[980px] rounded-[20px] border border-hairline bg-white" />
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="mt-10 animate-pulse border-t border-hairline" role="status" aria-label="Loading frequently asked questions">
      {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-16 border-b border-hairline" />)}
    </div>
  );
}

export const DeferredTimeCalculator = dynamic(
  () => import("@/components/time-calculator").then((module) => module.TimeCalculator),
  { ssr: false, loading: () => <InstrumentSkeleton label="Loading time calculator" height={560} /> },
);

export const DeferredJobPicker = dynamic(
  () => import("@/components/job-picker").then((module) => module.JobPicker),
  { ssr: false, loading: () => <InstrumentSkeleton label="Loading job examples" height={520} /> },
);

export const DeferredBuildProgress = dynamic(
  () => import("@/components/build-progress").then((module) => module.BuildProgress),
  { ssr: false, loading: () => <ProgressSkeleton /> },
);

export const DeferredConstellation = dynamic(
  () => import("@/components/constellation").then((module) => module.Constellation),
  { ssr: false, loading: () => <ConstellationSkeleton /> },
);

export const DeferredFAQ = dynamic(
  () => import("@/components/faq").then((module) => module.FAQ),
  { ssr: false, loading: () => <FAQSkeleton /> },
);
