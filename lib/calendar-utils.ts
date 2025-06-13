import { parseISO } from "date-fns"
import type { EventType } from "@/types/calendar"

// Interface for positioned events
export interface PositionedEvent {
  event: EventType
  column: number
  columnCount: number
}

/**
 * Positions events to handle overlaps by placing them side-by-side
 * @param events List of events to position
 * @returns Events with position information
 */
export function positionEvents(events: EventType[]): PositionedEvent[] {
  if (events.length === 0) return []

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => {
    return parseISO(a.start).getTime() - parseISO(b.start).getTime()
  })

  // Track event columns and groups
  const positionedEvents: PositionedEvent[] = []
  const eventGroups: EventType[][] = []

  // Group overlapping events
  sortedEvents.forEach((event) => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)

    // Try to find an existing group this event overlaps with
    let foundGroup = false

    for (const group of eventGroups) {
      // Check if this event overlaps with any event in the group
      const overlapsWithGroup = group.some((groupEvent) => {
        const groupEventStart = parseISO(groupEvent.start)
        const groupEventEnd = parseISO(groupEvent.end)

        return (
          (eventStart < groupEventEnd && eventEnd > groupEventStart) ||
          (groupEventStart < eventEnd && groupEventEnd > eventStart)
        )
      })

      if (overlapsWithGroup) {
        group.push(event)
        foundGroup = true
        break
      }
    }

    // If no overlapping group found, create a new group
    if (!foundGroup) {
      eventGroups.push([event])
    }
  })

  // Assign columns within each group
  eventGroups.forEach((group) => {
    // Sort group by start time
    group.sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime())

    // Track occupied columns
    const occupiedColumns: { [key: number]: number } = {}

    group.forEach((event) => {
      const eventStart = parseISO(event.start).getTime()
      const eventEnd = parseISO(event.end).getTime()

      // Find the first available column
      let column = 0
      while (occupiedColumns[column] !== undefined && occupiedColumns[column] > eventStart) {
        column++
      }

      // Assign this event to the column
      occupiedColumns[column] = eventEnd

      // Add to positioned events
      positionedEvents.push({
        event,
        column,
        columnCount: 0, // Will be updated after processing all events
      })
    })

    // Update column count for all events in this group
    const maxColumn = Math.max(...Object.keys(occupiedColumns).map(Number))
    const eventsInGroup = positionedEvents.filter((pe) => group.some((e) => e.id === pe.event.id))

    eventsInGroup.forEach((pe) => {
      pe.columnCount = maxColumn + 1
    })
  })

  return positionedEvents
}
