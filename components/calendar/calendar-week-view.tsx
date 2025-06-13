"use client"
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import type { EventType } from "@/types/calendar"
import { positionEvents } from "@/lib/calendar-utils"
import { formatWithLocale } from "@/lib/date-fns"

interface WeekViewProps {
  currentDate: Date
  events: EventType[]
  onEventClick?: (event: EventType) => void
  onCellClick?: (date: Date) => void
}

export function CalendarWeekView({ currentDate, events, onEventClick, onCellClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.start)
      return isSameDay(eventStart, day)
    })
  }

  const getEventPosition = (event: EventType, column: number, columnCount: number) => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)

    const startHour = eventStart.getHours() + eventStart.getMinutes() / 60
    const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60
    const duration = endHour - startHour

    // Calculate width and left position based on column information
    const width = columnCount > 0 ? `calc(${100 / columnCount}% - 4px)` : "calc(100% - 4px)"
    const left = columnCount > 0 ? `calc(${(column * 100) / columnCount}% + 2px)` : "2px"

    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
      width,
      left,
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-8 border-b">
        <div className="w-16 border-r" />
        {days.map((day, i) => (
          <div key={i} className="py-2 text-center border-r">
            <div className="text-sm font-medium">{formatWithLocale(day, "EEE")}</div>
            <div className="text-xl">{formatWithLocale(day, "d")}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="w-16 flex-shrink-0">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-r relative">
              <span className="absolute -top-3 right-2 text-xs text-muted-foreground">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {days.map((day, dayIndex) => {
            // Get events for this day and position them
            const eventsForDay = getEventsForDay(day)
            const positionedEvents = positionEvents(eventsForDay)

            return (
              <div key={dayIndex} className="relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-r cursor-pointer hover:bg-accent/30 transition-colors duration-200"
                    onClick={() => {
                      if (onCellClick) {
                        const date = new Date(day)
                        date.setHours(hour)
                        onCellClick(date)
                      }
                    }}
                  />
                ))}

                {positionedEvents.map(({ event, column, columnCount }, eventIndex) => {
                  const { top, height, width, left } = getEventPosition(event, column, columnCount)

                  return (
                    <div
                      key={eventIndex}
                      className={cn(
                        "absolute rounded-sm px-1 py-1 text-xs text-white overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:z-20",
                        event.color
                          ? `bg-${event.color}-600 hover:bg-${event.color}-700`
                          : "bg-green-600 hover:bg-green-700",
                      )}
                      style={{ top, height, width, left }}
                      onClick={() => onEventClick && onEventClick(event)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90 truncate">
                        {formatWithLocale(parseISO(event.start), "h:mm a")}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
