"use client"
import { format, parseISO, isSameDay } from "date-fns"

import { cn } from "@/lib/utils"
import type { EventType } from "@/types/calendar"

interface DayViewProps {
  currentDate: Date
  events: EventType[]
  onEventClick?: (event: EventType) => void
  onCellClick?: (date: Date) => void
}

export function CalendarDayView({ currentDate, events, onEventClick, onCellClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDay = () => {
    return events.filter((event) => {
      const eventStart = parseISO(event.start)
      return isSameDay(eventStart, currentDate)
    })
  }

  const getEventPosition = (event: EventType) => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)

    const startHour = eventStart.getHours() + eventStart.getMinutes() / 60
    const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60
    const duration = endHour - startHour

    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 border-b">
        <div className="w-16 border-r" />
        <div className="py-2 text-center border-r">
          <div className="text-sm font-medium">{format(currentDate, "EEEE")}</div>
          <div className="text-xl">{format(currentDate, "d MMMM yyyy")}</div>
        </div>
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

        <div className="flex-1 relative">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[60px] border-b border-r"
              onClick={() => {
                if (onCellClick) {
                  const date = new Date(currentDate)
                  date.setHours(hour)
                  onCellClick(date)
                }
              }}
            />
          ))}

          {getEventsForDay().map((event, eventIndex) => {
            const { top, height } = getEventPosition(event)

            return (
              <div
                key={eventIndex}
                className={cn(
                  "absolute left-4 right-4 rounded-sm px-3 py-2 text-white overflow-hidden",
                  event.color ? `bg-${event.color}-600` : "bg-green-600",
                )}
                style={{ top, height }}
                onClick={() => onEventClick && onEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs opacity-90">
                  {format(parseISO(event.start), "h:mm a")} - {format(parseISO(event.end), "h:mm a")}
                </div>
                {event.description && <div className="text-xs mt-1 opacity-90 line-clamp-2">{event.description}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
