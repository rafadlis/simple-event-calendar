"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { EventType } from "@/types/calendar"
import { CalendarEvent } from "./calendar-event"
import { CalendarHeader } from "./calendar-header"
import { formatWithLocale } from "@/lib/date-fns"

interface CalendarProps {
  events?: EventType[]
  currentDate: Date
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
  const [view, setView] = React.useState<"month" | "week" | "day">("month")

  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

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
                    "min-h-[120px] p-1 border-b border-r relative cursor-pointer transition-colors duration-200 hover:bg-accent/50 group",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                    isCurrentDay && "bg-blue-50 hover:bg-blue-100",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 text-sm transition-all duration-200 hover:scale-110",
                        isCurrentDay && "bg-primary text-primary-foreground rounded-full",
                        !isCurrentDay && "hover:bg-primary/10 hover:rounded-full",
                      )}
                    >
                      {formatWithLocale(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
