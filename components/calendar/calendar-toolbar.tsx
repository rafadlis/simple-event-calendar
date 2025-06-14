"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Search, Settings, CalendarIcon, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LocaleSelector } from "@/components/locale-selector"
import { formatWithLocale } from "@/lib/date-fns"

export type CalendarViewType = "month" | "week" | "day" | "schedule"

interface CalendarToolbarProps {
  currentDate: Date
  view: CalendarViewType
  onViewChange: (view: CalendarViewType) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onDateSelect?: (date: Date) => void
  dateRangeText?: string
}

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onDateSelect,
  dateRangeText,
}: CalendarToolbarProps) {
  const [date, setDate] = React.useState<Date | undefined>(currentDate)

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      if (onDateSelect) {
        onDateSelect(newDate)
      }
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onToday} className="hover:scale-105 transition-transform duration-200">
          Today
        </Button>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="hover:scale-110 transition-transform duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="hover:scale-110 transition-transform duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold min-w-[200px]">
          {dateRangeText || formatWithLocale(currentDate, "MMMM yyyy")}
        </h2>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="hover:scale-110 transition-transform duration-200">
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <LocaleSelector />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="hover:scale-110 transition-transform duration-200">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center space-x-1">
          <Select value={view} onValueChange={(value) => onViewChange(value as CalendarViewType)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="hover:scale-110 transition-transform duration-200">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" className="hover:scale-110 transition-transform duration-200">
            <CheckSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
