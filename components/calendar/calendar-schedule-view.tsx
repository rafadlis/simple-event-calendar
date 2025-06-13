"use client"

import * as React from "react"
import { format, parseISO, isSameDay, addMonths, isAfter, isBefore } from "date-fns"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import type { EventType } from "@/types/calendar"

interface ScheduleViewProps {
  currentDate: Date
  events: EventType[]
  onEventClick?: (event: EventType) => void
  rangeInMonths?: number
}

export function CalendarScheduleView({ currentDate, events, onEventClick, rangeInMonths = 12 }: ScheduleViewProps) {
  // Group events by date
  const groupedEvents = React.useMemo(() => {
    const startDate = currentDate
    const endDate = addMonths(currentDate, rangeInMonths)

    // Filter events within the date range
    const filteredEvents = events.filter((event) => {
      const eventDate = parseISO(event.start)
      return (
        (isAfter(eventDate, startDate) || isSameDay(eventDate, startDate)) &&
        (isBefore(eventDate, endDate) || isSameDay(eventDate, endDate))
      )
    })

    // Sort events by date
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      return parseISO(a.start).getTime() - parseISO(b.start).getTime()
    })

    // Group events by date
    const grouped: Record<string, EventType[]> = {}

    sortedEvents.forEach((event) => {
      const eventDate = parseISO(event.start)
      const dateKey = format(eventDate, "yyyy-MM-dd")

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }

      grouped[dateKey].push(event)
    })

    return grouped
  }, [currentDate, events, rangeInMonths])

  // Get unique dates
  const uniqueDates = Object.keys(groupedEvents).sort()

  if (uniqueDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-muted-foreground">No events in this time period</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y">
      {uniqueDates.map((dateKey) => {
        const date = parseISO(dateKey)
        const eventsForDate = groupedEvents[dateKey]

        return (
          <div key={dateKey} className="py-4">
            <div className="flex items-baseline mb-2">
              <h3 className="text-2xl font-bold mr-2">{format(date, "d")}</h3>
              <div className="text-sm text-muted-foreground uppercase">{format(date, "MMM, EEE")}</div>
            </div>

            <div className="space-y-2 pl-2">
              {eventsForDate.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start py-2 cursor-pointer hover:bg-muted/50 rounded-md px-2"
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <div className="mr-4 pt-1">
                    <Circle
                      className={cn("h-3 w-3 fill-current", event.color ? `text-${event.color}-600` : "text-green-600")}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">
                      {event.allDay
                        ? "All day"
                        : `${format(parseISO(event.start), "h:mm a")} - ${format(parseISO(event.end), "h:mm a")}`}
                    </div>
                    <div className="font-medium">{event.title}</div>
                    {event.description && <div className="text-sm text-muted-foreground mt-1">{event.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
