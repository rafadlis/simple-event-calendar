"use client"

import * as React from "react"
import { CalendarIcon, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import type { EventType } from "@/types/calendar"
import { TimePicker } from "./time-picker"
import { formatWithLocale } from "@/lib/date-fns"
import { addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns"

interface EventFormProps {
  event?: EventType
  selectedDate?: Date
  onSubmit: (event: Omit<EventType, "id">) => void
  onCancel: () => void
  onDelete?: () => void
  isCreating?: boolean
}

export function EventForm({
  event,
  selectedDate = new Date(),
  onSubmit,
  onCancel,
  onDelete,
  isCreating = false,
}: EventFormProps) {
  const [title, setTitle] = React.useState(event?.title || "")
  const [description, setDescription] = React.useState(event?.description || "")
  const [date, setDate] = React.useState<Date | undefined>(
    event?.start ? new Date(event.start) : selectedDate
  )
  const [startTime, setStartTime] = React.useState(
    event?.start ? formatWithLocale(new Date(event.start), "HH:mm") : "09:00"
  )
  const [endTime, setEndTime] = React.useState(
    event?.end ? formatWithLocale(new Date(event.end), "HH:mm") : "10:00"
  )
  const [color, setColor] = React.useState(event?.color || "green")
  const [allDay, setAllDay] = React.useState(event?.allDay || false)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !title) return

    let startDate: Date
    let endDate: Date

    if (allDay) {
      startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
    } else {
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      startDate = new Date(date)
      startDate.setHours(startHour, startMinute)

      endDate = new Date(date)
      endDate.setHours(endHour, endMinute)
    }

    onSubmit({
      title,
      description,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      color,
      allDay,
    })
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setIsCalendarOpen(false)
    }
  }

  const getDateDisplayText = () => {
    if (!date) return "Pick a date"

    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    if (isYesterday(date)) return "Yesterday"

    return formatWithLocale(date, "PPP")
  }

  const handleQuickDateSelect = (days: number) => {
    const newDate = addDays(new Date(), days)
    setDate(newDate)
  }

  const colorOptions = [
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
    { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div className="space-y-2 md:grid md:grid-cols-4 md:items-center md:gap-4 md:space-y-0">
          <Label htmlFor="title" className="text-sm font-medium md:text-right">
            Event Title
          </Label>
          <div className="md:col-span-3">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
            />
          </div>
        </div>

        {/* Date and Time Section */}
        <div className="space-y-2 md:grid md:grid-cols-4 md:items-start md:gap-4 md:space-y-0">
          <Label className="text-sm font-medium md:text-right md:mt-2">
            Date & Time
          </Label>
          <div className="flex flex-col gap-3 md:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              {/* Enhanced Date Selection */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:flex-1 justify-start text-left font-normal transition-all duration-200 hover:bg-accent/50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateDisplayText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 flex flex-row"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="rounded-md"
                    captionLayout="dropdown"
                  />

                  {/* Quick Date Selection */}
                  <div className="flex flex-col gap-1 p-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Quick navigation
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleQuickDateSelect(-1)}
                    >
                      Yesterday
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleQuickDateSelect(0)}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleQuickDateSelect(1)}
                    >
                      Tomorrow
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-2 mt-2 md:mt-0 shrink-0">
                <Switch
                  id="all-day"
                  checked={allDay}
                  onCheckedChange={setAllDay}
                />
                <Label htmlFor="all-day" className="text-sm">
                  All day
                </Label>
              </div>
            </div>

            {/* Time Selection */}
            {!allDay && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Start - End time
                </Label>
                <div className="flex items-center gap-2">
                  <TimePicker value={startTime} onChange={setStartTime} />
                  <span className="text-sm text-muted-foreground">-</span>
                  <TimePicker value={endTime} onChange={setEndTime} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3 md:grid md:grid-cols-4 md:items-center md:gap-4 md:space-y-0">
          <Label className="text-sm font-medium md:text-right">
            Event Color
          </Label>
          <div className="md:col-span-3">
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((colorOption) => (
                  <SelectItem key={colorOption.value} value={colorOption.value}>
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          colorOption.class
                        )}
                      />
                      <span>{colorOption.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 md:grid md:grid-cols-4 md:items-start md:gap-4 md:space-y-0">
          <Label
            htmlFor="description"
            className="text-sm font-medium md:text-right md:mt-2"
          >
            Description
          </Label>
          <div className="md:col-span-3">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event description (optional)"
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
            />
          </div>
        </div>
      </form>

      <Separator />

      {/* Action Button Group */}
      <div className="flex items-center justify-between">
        {/* Secondary Actions */}
        <div className="flex items-center space-x-2">
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        {/* Primary Actions */}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-muted/80 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="hover:scale-105 transition-transform duration-200"
          >
            {isCreating ? "Create Event" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
