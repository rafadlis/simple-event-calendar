"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isSameMonth } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventCalendar } from "@/components/calendar/calendar"
import { CalendarWeekView } from "@/components/calendar/calendar-week-view"
import { CalendarDayView } from "@/components/calendar/calendar-day-view"
import { CalendarScheduleView } from "@/components/calendar/calendar-schedule-view"
import { EventForm } from "@/components/calendar/event-form"
import { CalendarToolbar, type CalendarViewType } from "@/components/calendar/calendar-toolbar"
import type { EventType } from "@/types/calendar"
import { Plus } from "lucide-react"
import { formatWithLocale } from "@/lib/date-fns"

// Sample events data
const sampleEvents: EventType[] = [
  {
    id: "1",
    title: "Hari Buruh Internasional / Pekerja",
    start: new Date(2025, 4, 1, 0, 0).toISOString(),
    end: new Date(2025, 4, 1, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "2",
    title: "International Labor Day",
    start: new Date(2025, 4, 1, 0, 0).toISOString(),
    end: new Date(2025, 4, 1, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "3",
    title: "Hari Raya Waisak",
    start: new Date(2025, 4, 12, 0, 0).toISOString(),
    end: new Date(2025, 4, 12, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "4",
    title: "Waisak Day (Buddha's Anniversary)",
    start: new Date(2025, 4, 12, 0, 0).toISOString(),
    end: new Date(2025, 4, 12, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "5",
    title: "Cuti Bersama Waisak",
    start: new Date(2025, 4, 13, 0, 0).toISOString(),
    end: new Date(2025, 4, 13, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "6",
    title: "Joint Holiday for Waisak Day",
    start: new Date(2025, 4, 13, 0, 0).toISOString(),
    end: new Date(2025, 4, 13, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "7",
    title: "Kenaikan Isa Al Masih",
    start: new Date(2025, 4, 29, 0, 0).toISOString(),
    end: new Date(2025, 4, 29, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "8",
    title: "Ascension Day of Jesus Christ",
    start: new Date(2025, 4, 29, 0, 0).toISOString(),
    end: new Date(2025, 4, 29, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "9",
    title: "Cuti Bersama Kenaikan Isa Al Masih",
    start: new Date(2025, 4, 30, 0, 0).toISOString(),
    end: new Date(2025, 4, 30, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "10",
    title: "Joint Holiday after Ascension Day",
    start: new Date(2025, 4, 30, 0, 0).toISOString(),
    end: new Date(2025, 4, 30, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "11",
    title: "Hari Lahir Pancasila",
    start: new Date(2025, 5, 1, 0, 0).toISOString(),
    end: new Date(2025, 5, 1, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "12",
    title: "Pancasila Day",
    start: new Date(2025, 5, 1, 0, 0).toISOString(),
    end: new Date(2025, 5, 1, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "13",
    title: "Idul Adha (Lebaran Haji)",
    start: new Date(2025, 5, 6, 0, 0).toISOString(),
    end: new Date(2025, 5, 6, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "14",
    title: "Idul Adha",
    start: new Date(2025, 5, 6, 0, 0).toISOString(),
    end: new Date(2025, 5, 6, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "15",
    title: "Eid al-Adha",
    start: new Date(2025, 5, 6, 0, 0).toISOString(),
    end: new Date(2025, 5, 6, 23, 59).toISOString(),
    color: "green",
    allDay: true,
  },
  {
    id: "16",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: new Date(2025, 5, 13, 10, 0).toISOString(),
    end: new Date(2025, 5, 13, 11, 0).toISOString(),
    color: "blue",
  },
  {
    id: "17",
    title: "Project Review",
    description: "Review Q2 progress",
    start: new Date(2025, 5, 13, 14, 0).toISOString(),
    end: new Date(2025, 5, 13, 15, 30).toISOString(),
    color: "purple",
  },
  {
    id: "18",
    title: "Design Review",
    description: "Review new UI designs",
    start: new Date(2025, 5, 13, 10, 30).toISOString(),
    end: new Date(2025, 5, 13, 11, 30).toISOString(),
    color: "red",
  },
  {
    id: "19",
    title: "Client Call",
    description: "Discuss project timeline",
    start: new Date(2025, 5, 13, 10, 45).toISOString(),
    end: new Date(2025, 5, 13, 11, 15).toISOString(),
    color: "yellow",
  },
  {
    id: "20",
    title: "Quick Standup",
    description: "Daily team check-in",
    start: new Date(2025, 5, 13, 10, 0).toISOString(),
    end: new Date(2025, 5, 13, 10, 15).toISOString(),
    color: "purple",
  },
]

export default function CalendarPage() {
  const [events, setEvents] = React.useState<EventType[]>(sampleEvents)
  const [view, setView] = React.useState<CalendarViewType>("month")
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date()) // Use today's date
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<EventType | undefined>()
  const [isCreating, setIsCreating] = React.useState(false)

  // Handle navigation based on current view
  const handlePrevious = () => {
    switch (view) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1))
        break
      case "week":
        setCurrentDate(subWeeks(currentDate, 1))
        break
      case "day":
        setCurrentDate(subDays(currentDate, 1))
        break
      case "schedule":
        setCurrentDate(subMonths(currentDate, 1))
        break
    }
  }

  const handleNext = () => {
    switch (view) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1))
        break
      case "week":
        setCurrentDate(addWeeks(currentDate, 1))
        break
      case "day":
        setCurrentDate(addDays(currentDate, 1))
        break
      case "schedule":
        setCurrentDate(addMonths(currentDate, 1))
        break
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleViewChange = (newView: CalendarViewType) => {
    setView(newView)
  }

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    setSelectedDate(date)
  }

  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
    setIsCreating(false)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(undefined)
    setIsDialogOpen(true)
    setIsCreating(true)
  }

  const handleAddEvent = (eventData: Omit<EventType, "id">) => {
    if (isCreating) {
      const newEvent: EventType = {
        ...eventData,
        id: uuidv4(),
      }
      setEvents([...events, newEvent])
    } else if (selectedEvent) {
      setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...event, ...eventData } : event)))
    }
    setIsDialogOpen(false)
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id))
      setIsDialogOpen(false)
    }
  }

  // Generate date range text for schedule view
  const getDateRangeText = () => {
    if (view === "schedule") {
      const endDate = addMonths(currentDate, 12)
      return `${formatWithLocale(currentDate, "MMM yyyy")} – ${formatWithLocale(endDate, "MMM yyyy")}`
    } else if (view === "week") {
      const endDate = addDays(currentDate, 6)
      if (isSameMonth(currentDate, endDate)) {
        return `${formatWithLocale(currentDate, "MMMM yyyy")}`
      }
      return `${formatWithLocale(currentDate, "MMM")} – ${formatWithLocale(endDate, "MMM yyyy")}`
    } else if (view === "day") {
      return formatWithLocale(currentDate, "MMMM d, yyyy")
    }
    return formatWithLocale(currentDate, "MMMM yyyy")
  }

  return (
    <div className="flex flex-col h-screen">
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        onViewChange={handleViewChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onDateSelect={handleDateSelect}
        dateRangeText={getDateRangeText()}
      />

      <div className="flex-1 overflow-hidden">
        {view === "month" && (
          <EventCalendar
            events={events}
            currentDate={currentDate}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            className="h-full"
          />
        )}

        {view === "week" && (
          <CalendarWeekView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onCellClick={handleDateClick}
          />
        )}

        {view === "day" && (
          <CalendarDayView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onCellClick={handleDateClick}
          />
        )}

        {view === "schedule" && (
          <div className="h-full overflow-y-auto p-4">
            <CalendarScheduleView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              rangeInMonths={12}
            />
          </div>
        )}
      </div>

      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        onClick={() => {
          setSelectedEvent(undefined)
          setIsDialogOpen(true)
          setIsCreating(true)
        }}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create Event" : "Edit Event"}</DialogTitle>
          </DialogHeader>
          <EventForm
            event={selectedEvent}
            selectedDate={selectedDate}
            onSubmit={handleAddEvent}
            onCancel={() => setIsDialogOpen(false)}
            onDelete={!isCreating && selectedEvent ? handleDeleteEvent : undefined}
            isCreating={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
