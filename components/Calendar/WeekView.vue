<template>
  <div class="calendar-container">
    <div class="grid grid-cols-8 h-[calc(100vh-300px)] overflow-y-auto">
      <!-- Time labels column -->
      <div class="border-r">
        <div class="h-12 border-b"></div> <!-- Header spacer -->
        <div v-for="hour in allHours" :key="hour" class="h-12 text-xs text-gray-500 text-right pr-2">
          {{ formatHour(hour) }}
        </div>
      </div>
      
      <!-- Days columns -->
      <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="border-r">
        <!-- Day header -->
        <div class="h-12 border-b p-2 text-center">
          <div class="font-medium text-sm">{{ day }}</div>
          <div class="text-xs">{{ formatWeekDayDate(dayIndex) }}</div>
        </div>
        
        <!-- Hours grid -->
        <div class="relative">
          <div 
            v-for="hour in allHours" 
            :key="hour" 
            class="h-12 border-b cursor-pointer" 
            @click="handleWeekHourClick(dayIndex, hour, $event)"
          >
            <!-- Hour cell is empty, events are positioned absolutely -->
          </div>
          
          <!-- Continuous events positioned absolutely -->
          <div 
            v-for="event in getEventsForWeekDay(dayIndex)" 
            :key="event.id"
            class="absolute rounded p-1 text-xs overflow-hidden cursor-pointer mx-1"
            :class="`bg-${event.color}-100 text-${event.color}-800`"
            :style="getEventPositionStyles(event, dayIndex)"
            @click.stop="openEventModal(event)"
          >
            {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true
  },
  events: {
    type: Array,
    required: true
  },
  weekDays: {
    type: Array,
    required: true
  },
  hours: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['openEventModal', 'handleWeekHourClick'])

// Computed properties
const allHours = computed(() => {
  // Display all 24 hours instead of just a subset
  return Array.from({ length: 24 }, (_, i) => i)
})

// Methods
function formatHour(hour) {
  return `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`
}

function formatWeekDayDate(dayIndex) {
  const weekStart = startOfWeek(props.currentDate)
  const day = addDays(weekStart, dayIndex)
  return format(day, 'd/M')
}

function getEventsForDay(date) {
  return props.events.filter(event => {
    const eventStart = parseISO(event.start)
    return isSameDay(eventStart, date)
  })
}

function getEventsForWeekDay(dayIndex) {
  const weekStart = startOfWeek(props.currentDate)
  const day = addDays(weekStart, dayIndex)
  return getEventsForDay(day)
}

function getEventsForHour(dayIndex, hour) {
  // Get the date for this day of the week
  const weekStart = startOfWeek(props.currentDate)
  const day = addDays(weekStart, dayIndex)
  
  // Create date objects for the start and end of this hour
  const hourStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0, 0, 0)
  const hourEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, 0, 0, 0)
  
  // Filter events that overlap with this hour
  return props.events.filter(event => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)
    
    // Event must be on this day
    if (!isSameDay(eventStart, day)) return false
    
    // Event overlaps with this hour if it starts before the hour ends and ends after the hour starts
    return eventStart < hourEnd && eventEnd > hourStart
  })
}

function getEventPositionStyles(event, dayIndex) {
  const eventStart = parseISO(event.start)
  const eventEnd = parseISO(event.end)
  
  // Calculate position and height based on event times
  const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60)
  const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60)
  
  // Each hour is 48px (h-12 = 3rem = 48px)
  const top = `${startHour * 48}px`
  const height = `${(endHour - startHour) * 48}px`
  const width = 'calc(100% - 8px)' // Leaving small margin on sides
  
  return {
    top,
    height,
    width,
    left: '4px' // Small margin from left
  }
}

function openEventModal(event) {
  emit('openEventModal', event)
}

function handleWeekHourClick(dayIndex, hour, event) {
  // Prevent opening modal if clicking on an existing event
  if (event.target.closest('.rounded')) return
  emit('handleWeekHourClick', dayIndex, hour, event)
}
</script>