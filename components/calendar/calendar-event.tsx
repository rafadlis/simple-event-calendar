"use client"
import { cn } from "@/lib/utils"
import type { EventType } from "@/types/calendar"

interface CalendarEventProps {
  event: EventType
  onClick?: () => void
}

export function CalendarEvent({ event, onClick }: CalendarEventProps) {
  return (
    <div
      className={cn(
        "text-xs px-2 py-1 rounded-md truncate cursor-pointer transition-all duration-200 hover:shadow-md hover:z-10",
        event.color
          ? `bg-${event.color}-600 text-white hover:bg-${event.color}-700`
          : "bg-green-600 text-white hover:bg-green-700",
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick()
      }}
    >
      {event.title}
    </div>
  )
}
