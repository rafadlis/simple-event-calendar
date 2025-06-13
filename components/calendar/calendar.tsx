"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay,
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { EventType } from "@/types/calendar"
import { CalendarEvent } from "./calendar-event"
import { CalendarHeader } from "./calendar-header"

interface CalendarProps {
  events?: EventType[]
  currentDate: Date // Add this line
  onEventClick?: (event: EventType) => void
  onDateClick?: (date: Date) => void
  onAddEvent?: (date: Date) => void
  className?: string
}

export function EventCalendar({
  events = [],
  currentDate,
  onEventClick,
  onDateClick,
  onAddEvent,
  className,
}: CalendarProps) {
  // Remove the internal state for currentDate and view
  // Replace:
  // const [currentDate, setCurrentDate] = React.useState(new Date())
  // const [view, setView] = React.useState<"month" | "week" | "day">("month")

  // With:
  // No internal state needed as we'll use props
  const [view, setView] = React.useState<"month" | "week" | "day">("month")

  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Remove these internal navigation methods:
  // const goToToday = () => setCurrentDate(new Date())
  // const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  // const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date)
    }
  }

  const handleAddEvent = (date: Date) => {
    if (onAddEvent) {
      onAddEvent(date)
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.start)
      return isSameDay(eventDate, date)
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-auto">
        {view === "month" && (
          <div className="grid grid-cols-7 h-full border-t border-l">
            <CalendarHeader />

            {days.map((day, dayIdx) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[120px] p-1 border-b border-r relative",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                    isCurrentDay && "bg-blue-50",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 text-sm",
                        isCurrentDay && "bg-primary text-primary-foreground rounded-full",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddEvent(day)
                        }}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="mt-1 space-y-1 max-h-[80%] overflow-hidden">
                    {dayEvents.map((event) => (
                      <CalendarEvent key={event.id} event={event} onClick={() => onEventClick && onEventClick(event)} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
