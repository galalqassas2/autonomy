const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const SLOTS = 8

/*
  A working week, eight hours a day. Cells fill emerald from the bottom of
  Monday onward, staggered by 40ms, so the loss reads as a shape.
*/
export function WeekGrid({ hoursPerWeek }: { hoursPerWeek: number }) {
  const filled = Math.min(DAYS.length * SLOTS, Math.round(hoursPerWeek))

  return (
    <div aria-hidden="true" className="flex gap-2">
      {DAYS.map((day, dayIndex) => (
        <div key={day} className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-col-reverse gap-1.5">
            {Array.from({ length: SLOTS }, (_, slot) => {
              const index = dayIndex * SLOTS + slot
              const on = index < filled
              return (
                <span
                  key={slot}
                  className="h-3 rounded-xs"
                  style={{
                    background: on ? "var(--primary)" : "var(--hairline-cool)",
                    transition: `background-color 260ms var(--ease-out) ${index * 40}ms`,
                  }}
                />
              )
            })}
          </div>
          <span className="t-micro text-center text-ink-mute">{day}</span>
        </div>
      ))}
    </div>
  )
}
