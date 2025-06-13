"use client"

import { useLocaleStore } from "@/lib/date-fns"

export function CalendarHeader() {
  const { currentLocale } = useLocaleStore()

  // Define day names based on locale
  const getDaysOfWeek = () => {
    if (currentLocale === "id") {
      return ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"]
    }
    return ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  }

  const DAYS_OF_WEEK = getDaysOfWeek()

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
