import { cn } from "@/lib/utils"

/* Every widget reveals its parts off the same counter. */
export function Step({
  as = "div",
  at,
  shown,
  className,
  children,
}: {
  as?: "blockquote" | "div" | "footer" | "li" | "section" | "tr"
  at: number
  shown: number
  className?: string
  children: React.ReactNode
}) {
  const on = at < shown
  const Component = as
  return (
    <Component
      className={cn("transition-[opacity,transform] duration-300", className)}
      style={{
        opacity: on ? 1 : 0,
        transform: on || as === "tr" ? "none" : "translateY(6px)",
      }}
    >
      {children}
    </Component>
  )
}
