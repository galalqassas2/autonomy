import { cn } from "@/lib/utils"

/* Every widget reveals its parts off the same counter. */
export function Step({
  at,
  shown,
  className,
  children,
}: {
  at: number
  shown: number
  className?: string
  children: React.ReactNode
}) {
  const on = at < shown
  return (
    <div
      className={cn("transition-[opacity,transform] duration-300", className)}
      style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(6px)" }}
    >
      {children}
    </div>
  )
}
