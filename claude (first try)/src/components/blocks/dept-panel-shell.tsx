import { cn } from "@/lib/utils"

/*
  Shared chrome for the department panels, so five different artefacts still
  read as one family: same frame, same header bar, same status line.
*/
export function DeptPanel({
  title,
  status,
  children,
  className,
}: {
  title: string
  status: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-hairline",
        "bg-canvas-night shadow-[var(--elev-2)]",
        className,
      )}
    >
      <div className="flex h-12 items-center gap-3 border-b border-hairline px-4">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-white/12" />
          <span className="size-2 rounded-full bg-white/12" />
          <span className="size-2 rounded-full bg-white/12" />
        </span>
        <span className="text-sm font-medium text-ink">{title}</span>
        <span className="t-micro ml-auto flex items-center gap-1.5 text-ink-mute-2">
          <span
            className="size-1.5 rounded-full bg-primary"
            style={{ boxShadow: "var(--glow-soft)" }}
            aria-hidden="true"
          />
          {status}
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

export function Row({
  done,
  delay,
  children,
}: {
  done: boolean
  delay: number
  children: React.ReactNode
}) {
  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-hairline/70 py-3 last:border-b-0"
      style={{
        opacity: done ? 1 : 0.42,
        transition: `opacity 320ms var(--ease-out) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function Chip({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <span
      className="t-micro rounded-full px-2.5 py-1 transition-colors duration-300"
      style={{
        background: done ? "var(--primary-a12)" : "var(--white-a05)",
        color: done ? "var(--primary)" : "var(--ink-mute-2)",
      }}
    >
      {children}
    </span>
  )
}
