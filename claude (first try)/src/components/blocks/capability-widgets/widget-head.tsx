import { ToolMark } from "./tool-mark"

export function WidgetHead({
  tool,
  title,
  meta,
}: {
  tool: string
  title: string
  meta: string
}) {
  return (
    <header className="flex items-center gap-3 border-b border-hairline px-4 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/[0.05]">
        <ToolMark slug={tool} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-ink">{title}</span>
        <span className="t-micro truncate text-ink-mute-2">{meta}</span>
      </span>
    </header>
  )
}
