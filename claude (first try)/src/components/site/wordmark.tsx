import { cn } from "@/lib/utils"

/* Wordmark stands in until the client supplies logo files. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-[17px] leading-none font-medium tracking-[-0.02em]",
        className,
      )}
    >
      Autonomy
      <span className="text-primary">.</span>
    </span>
  )
}
