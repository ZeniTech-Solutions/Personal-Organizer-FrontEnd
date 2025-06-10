<template>
  <div class="calendar-container">
    <div class="grid grid-cols-7 text-center font-medium py-2 border-b">
      <div v-for="day in weekDays" :key="day" class="text-gray-600">{{ day }}</div>
    </div>
    <div class="grid grid-cols-7 grid-rows-6 h-[calc(100vh-300px)]">
      <div 
        v-for="(day, index) in calendarDays" 
        :key="index"
        class="border p-1 relative min-h-[100px] cursor-pointer"
        :class="{
          'bg-gray-50': !day.isCurrentMonth,
          'bg-blue-50': day.isToday
        }"
        @click="handleDayClick(day.date, $event)"
      >
        <div class="flex justify-between items-start">
          <span 
            class="text-sm font-medium" 
            :class="{'text-blue-600': day.isToday}"
          >
            {{ day.date.getDate() }}
          </span>
        </div>
        <div class="mt-1 max-h-[80px] overflow-hidden">
          <div 
            v-for="(event, eventIndex) in getEventsForDay(day.date).slice(0, 3)" 
            :key="event.id"
            class="text-xs p-1 mb-1 rounded truncate cursor-pointer"
            :class="`bg-${event.color}-100 text-${event.color}-800`"
            @click.stop="openEventModal(event)"
          >
            {{ event.title }}
          </div>
          <div 
            v-if="getEventsForDay(day.date).length > 3" 
            class="text-xs text-center text-blue-600 font-medium cursor-pointer"
            @click.stop="viewMoreEvents(day.date)"
          >
            +{{ getEventsForDay(day.date).length - 3 }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay } from 'date-fns'

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
  }
})

const emit = defineEmits(['openEventModal', 'handleDayClick', 'viewMoreEvents'])

// Computed properties
const calendarDays = computed(() => {
  const monthStart = startOfMonth(props.currentDate)
  const monthEnd = endOfMonth(props.currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, props.currentDate),
    isToday: isToday(date)
  }))
})

// Methods
function getEventsForDay(date) {
  return props.events.filter(event => {
    const eventStart = new Date(event.start)
    return isSameDay(eventStart, date)
  })
}

function openEventModal(event) {
  emit('openEventModal', event)
}

function handleDayClick(date, event) {
  // Prevent opening modal if clicking on an existing event
  if (event.target.closest('.text-xs')) return
  emit('handleDayClick', date, event)
}

function viewMoreEvents(date) {
  emit('viewMoreEvents', date)
}
</script>