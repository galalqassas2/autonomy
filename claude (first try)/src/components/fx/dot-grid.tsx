import { cn } from "@/lib/utils"

/*
  The still stand-in for KineticGrid: under 768px, and under reduced motion.
*/
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  )
}
