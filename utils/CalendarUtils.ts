// Calendar utility functions
import { format, addMonths, subMonths, addDays, startOfWeek, isSameDay, parseISO, addHours } from 'date-fns'
import type { CalendarEvent } from '~/types/products'

export type CalendarView = 'month' | 'week' | 'day';

// Format functions
export function formatHour(hour: number): string {
  return `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`
}

export function formatWeekDayDate(currentDate: Date, dayIndex: number): string {
  const weekStart = startOfWeek(currentDate)
  const day = addDays(weekStart, dayIndex)
  return format(day, 'd/M')
}

// Event positioning and filtering
export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = parseISO(event.start)
    return isSameDay(eventStart, date)
  })
}

export function getEventsForWeekDay(events: CalendarEvent[], currentDate: Date, dayIndex: number): CalendarEvent[] {
  const weekStart = startOfWeek(currentDate)
  const day = addDays(weekStart, dayIndex)
  return getEventsForDay(events, day)
}

export interface EventPositionStyles {
  top: string;
  height: string;
  left: string;
  right?: string;
  width?: string;
}

export function getEventPositionStyles(event: CalendarEvent, dayIndex: number, events: CalendarEvent[], currentDate: Date): EventPositionStyles {
  const eventStart = parseISO(event.start)
  const eventEnd = parseISO(event.end)
  
  // Calculate position based on time
  const dayStartHour = 6 // 6am
  const startHour = eventStart.getHours() + eventStart.getMinutes() / 60
  const endHour = eventEnd.getHours() + eventStart.getMinutes() / 60 + Math.max(0.5, (eventEnd.getTime() - eventStart.getTime()) / 3600000)
  
  const top = (startHour - dayStartHour) * 48 + 48 // 48px per hour + 48px for header
  const height = (endHour - startHour) * 48
  
  // Calculate horizontal position for overlapping events
  const dayEvents = getEventsForWeekDay(events, currentDate, dayIndex)
  const overlappingEvents = dayEvents.filter(otherEvent => {
    if (otherEvent.id === event.id) return false
    
    const otherStart = parseISO(otherEvent.start)
    const otherEnd = parseISO(otherEvent.end)
    
    return (
      (eventStart < otherEnd && eventEnd > otherStart) || // Events overlap
      (otherStart < eventEnd && otherEnd > eventStart)     // Other way around
    )
  })
  
  // If there are overlapping events, adjust the width
  let left = '4px'
  let right = '4px'
  
  if (overlappingEvents.length > 0) {
    // Find position in the overlapping group
    const position = overlappingEvents.findIndex(e => e.id > event.id) + 1
    const totalOverlapping = overlappingEvents.length + 1
    
    // Calculate width percentage based on position
    const width = 100 / totalOverlapping
    const leftPos = (position - 1) * width
    
    left = `${leftPos}%`
    right = `${100 - leftPos - width}%`
  }
  
  return {
    top: `${top}px`,
    height: `${height}px`,
    left,
    right
  }
}

export function getEventPositionStylesForDay(event: CalendarEvent, events: CalendarEvent[], currentDate: Date): EventPositionStyles {
  const eventStart = parseISO(event.start)
  const eventEnd = parseISO(event.end)
  
  // Calculate position based on time
  const dayStartHour = 6 // 6am
  const startHour = eventStart.getHours() + eventStart.getMinutes() / 60
  const endHour = eventEnd.getHours() + eventStart.getMinutes() / 60 + Math.max(0.5, (eventEnd.getTime() - eventStart.getTime()) / 3600000)
  
  const top = (startHour - dayStartHour) * 48 // 48px per hour
  const height = (endHour - startHour) * 48
  
  // Calculate horizontal position for overlapping events
  const dayEvents = getEventsForDay(events, currentDate)
  const overlappingEvents = dayEvents.filter(otherEvent => {
    if (otherEvent.id === event.id) return false
    
    const otherStart = parseISO(otherEvent.start)
    const otherEnd = parseISO(otherEvent.end)
    
    return (
      (eventStart < otherEnd && eventEnd > otherStart) || // Events overlap
      (otherStart < eventEnd && otherEnd > eventStart)     // Other way around
    )
  })
  
  // If there are overlapping events, adjust the width
  let left = '0'
  let width = '100%'
  
  if (overlappingEvents.length > 0) {
    // Find position in the overlapping group
    const position = overlappingEvents.findIndex(e => e.id > event.id) + 1
    const totalOverlapping = overlappingEvents.length + 1
    
    // Calculate width percentage based on position
    const widthPercent = 100 / totalOverlapping
    const leftPos = (position - 1) * widthPercent
    
    left = `${leftPos}%`
    width = `${widthPercent}%`
  }
  
  return {
    top: `${top}px`,
    height: `${height}px`,
    left,
    width
  }
}

// Navigation functions
export function navigatePrev(currentDate: Date, currentView: CalendarView): Date {
  if (currentView === 'month') {
    return subMonths(currentDate, 1)
  } else if (currentView === 'week') {
    return addDays(currentDate, -7)
  } else {
    return addDays(currentDate, -1)
  }
}

export function navigateNext(currentDate: Date, currentView: CalendarView): Date {
  if (currentView === 'month') {
    return addMonths(currentDate, 1)
  } else if (currentView === 'week') {
    return addDays(currentDate, 7)
  } else {
    return addDays(currentDate, 1)
  }
}

// Event creation helpers
export function createNewEvent(date: Date | string, hour: null | number = null): CalendarEvent {
  // Create a new event at the specified date and hour
  const eventDate = new Date(date)
  
  if (hour !== null) {
    eventDate.setHours(hour, 0, 0, 0)
  } else {
    // If no hour specified, round to the current hour
    eventDate.setMinutes(0, 0, 0)
  }
  
  // Format only the date part for display in the modal
  const dateStr = format(eventDate, "yyyy-MM-dd")
  const startTimeStr = format(eventDate, "HH:mm")
  const endTimeStr = format(addHours(eventDate, 1), "HH:mm")
  
  return {
    id: '',
    title: '',
    start: format(eventDate, "yyyy-MM-dd'T'HH:mm"),
    end: format(addHours(eventDate, 1), "yyyy-MM-dd'T'HH:mm"),
    color: 'blue'
  }
}