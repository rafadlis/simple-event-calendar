const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

export function CalendarHeader() {
  return (
    <>
      {DAYS_OF_WEEK.map((day) => (
        <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground border-b border-r">
          {day}
        </div>
      ))}
    </>
  )
}
