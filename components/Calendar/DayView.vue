<template>
  <div class="calendar-container">
    <div class="text-center font-medium py-2 border-b">
      {{ formatDayViewHeader }}
    </div>
    <div class="grid grid-cols-1 h-[calc(100vh-300px)] overflow-y-auto">
      <div class="flex">
        <!-- Time labels column -->
        <div class="w-20 flex-shrink-0 border-r">
          <div v-for="hour in allHours" :key="hour" class="h-12 text-xs text-gray-500 text-right pr-2">
            {{ formatHour(hour) }}
          </div>
        </div>
        
        <!-- Events column -->
        <div class="flex-grow relative">
          <!-- Hour grid lines -->
          <div v-for="hour in allHours" :key="hour" class="h-12 border-b cursor-pointer" @click="handleDayHourClick(hour, $event)"></div>
          
          <!-- Continuous events positioned absolutely -->
          <div v-for="event in getEventsForDay(currentDate)" :key="event.id" 
            class="absolute rounded p-1 text-xs overflow-hidden cursor-pointer mx-1"
            :class="`bg-${event.color}-100 text-${event.color}-800`"
            :style="getEventPositionStyles(event)"
            @click.stop="openEventModal(event)">
            {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format, isSameDay, parseISO } from 'date-fns'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true
  },
  events: {
    type: Array,
    required: true
  },
  hours: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['openEventModal', 'handleDayHourClick'])

// Computed properties
const formatDayViewHeader = computed(() => {
  return format(props.currentDate, 'EEEE').toUpperCase()
})

const allHours = computed(() => {
  // Display all 24 hours instead of just a subset
  return Array.from({ length: 24 }, (_, i) => i)
})

// Methods
function formatHour(hour) {
  return `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`
}

function getEventsForDay(date) {
  return props.events.filter(event => {
    const eventStart = parseISO(event.start)
    // Event must be on this specific day
    return isSameDay(eventStart, date)
  })
}

function getEventsForHour(date, hour) {
  // Returns events that overlap with this hour slot on the given day
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0)
  const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour + 1, 0, 0, 0)
  return getEventsForDay(date).filter(event => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)
    return eventStart < dayEnd && eventEnd > dayStart
  })
}

function getEventPositionStyles(event) {
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

function handleDayHourClick(hour, event) {
  // Prevent opening modal if clicking on an existing event
  if (event.target.closest('.rounded')) return
  emit('handleDayHourClick', hour, event)
}
</script>