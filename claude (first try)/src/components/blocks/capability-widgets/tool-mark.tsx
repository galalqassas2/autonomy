import { cn } from "@/lib/utils"

export function ToolMark({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg className={cn("size-5", className)} aria-hidden="true" focusable="false">
      <use href={`#tool-${slug}`} />
    </svg>
  )
}
