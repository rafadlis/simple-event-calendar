export interface EventType {
  id: string
  title: string
  description?: string
  start: string // ISO string
  end: string // ISO string
  color?: string
  allDay?: boolean
}
