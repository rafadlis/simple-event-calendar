"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { EventType } from "@/types/calendar"
import { TimePicker } from "./time-picker"
import { formatWithLocale } from "@/lib/date-fns"

interface EventFormProps {
  event?: EventType
  selectedDate?: Date
  onSubmit: (event: Omit<EventType, "id">) => void
  onCancel: () => void
}

export function EventForm({ event, selectedDate = new Date(), onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = React.useState(event?.title || "")
  const [description, setDescription] = React.useState(event?.description || "")
  const [date, setDate] = React.useState<Date | undefined>(event?.start ? new Date(event.start) : selectedDate)
  const [startTime, setStartTime] = React.useState(
    event?.start ? formatWithLocale(new Date(event.start), "HH:mm") : "09:00",
  )
  const [endTime, setEndTime] = React.useState(event?.end ? formatWithLocale(new Date(event.end), "HH:mm") : "10:00")
  const [color, setColor] = React.useState(event?.color || "green")
  const [allDay, setAllDay] = React.useState(event?.allDay || false)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add title" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatWithLocale(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="all-day" checked={allDay} onCheckedChange={setAllDay} />
        <Label htmlFor="all-day">All day</Label>
      </div>

      {!allDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <TimePicker value={startTime} onChange={setStartTime} />
          </div>

          <div className="space-y-2">
            <Label>End Time</Label>
            <TimePicker value={endTime} onChange={setEndTime} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
