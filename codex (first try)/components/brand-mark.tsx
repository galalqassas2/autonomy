import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative block size-8 shrink-0 rounded-[10px] bg-ink", className)} aria-hidden="true">
      <span className="absolute left-[7px] top-[7px] h-[18px] w-[5px] -skew-x-12 rounded-full bg-brand" />
      <span className="absolute right-[7px] top-[7px] h-[18px] w-[5px] skew-x-12 rounded-full bg-white" />
      <span className="absolute bottom-[7px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-running" />
    </span>
  );
}
