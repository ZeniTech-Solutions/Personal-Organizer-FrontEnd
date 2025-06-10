<template>
  <div class="min-h-[93vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-1">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Calendar</h1>
      <div class="flex items-center gap-4">
        <button 
          class="btn btn-primary flex items-center gap-2" 
          @click="openEventModal()"
        >
          <PlusIcon class="w-5 h-5" />
          Add Event
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <!-- Calendar Header Component -->
      <CalendarHeader 
        :current-date="currentDate" 
        :current-view="currentView" 
        @prev="prev" 
        @next="next" 
        @set-view="setView"
      />

      <!-- Month View Component -->
      <CalendarMonthView 
        v-if="currentView === 'month'" 
        :current-date="currentDate" 
        :events="events" 
        :week-days="weekDays" 
        @open-event-modal="openEventModal" 
        @handle-day-click="handleDayClick" 
        @view-more-events="viewMoreEvents"
      />

      <!-- Week View Component -->
      <CalendarWeekView 
        v-if="currentView === 'week'" 
        :current-date="currentDate" 
        :events="events" 
        :week-days="weekDays" 
        :hours="hours" 
        @open-event-modal="openEventModal" 
        @handle-week-hour-click="handleWeekHourClick"
      />

      <!-- Day View Component -->
      <CalendarDayView 
        v-if="currentView === 'day'" 
        :current-date="currentDate" 
        :events="events" 
        :hours="hours" 
        @open-event-modal="openEventModal" 
        @handle-day-hour-click="handleDayHourClick"
      />
    </div>

    <!-- Event Modal Component -->
    <CalendarEventModal 
      :show="showEventModal" 
      :editing-event="editingEvent" 
      @close="closeEventModal" 
      @save="saveEvent" 
      @delete="deleteEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { format, addHours } from 'date-fns'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { API_Calendar } from '~/api/calendar'
import type { APIResponse } from '~/types'
import { navigatePrev, navigateNext, createNewEvent } from '~/utils/CalendarUtils'
import useShowSnackbar from '~/composables/useSnackbar'
import type { CalendarEvent } from '~/types/products';

type CalendarView = 'month' | 'week' | 'day';

// State
const currentDate = ref<Date>(new Date())
const currentView = ref<CalendarView>('month')
const events = ref<CalendarEvent[]>([])
const showEventModal = ref<boolean>(false)
const editingEvent = ref<CalendarEvent>({
  id: '',
  title: '',
  start: '',
  end: '',
  color: 'blue'
})

const weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const hours: number[] = Array.from({ length: 12 }, (_, i) => i + 6) // 6am to 6pm

// Methods
function prev() {
  currentDate.value = navigatePrev(currentDate.value, currentView.value)
}

function next() {
  currentDate.value = navigateNext(currentDate.value, currentView.value)
}

function setView(view: CalendarView): void {
  currentView.value = view
}

function openEventModal(event: CalendarEvent | null = null): void {
  if (event) {
    editingEvent.value = { ...event }
  } else {
    // Create a new event starting at the current hour, lasting 1 hour
    const now = new Date()
    const roundedHour = new Date(now.setMinutes(0, 0, 0))
    
    editingEvent.value = {
      id: '',
      title: '',
      start: format(roundedHour, "yyyy-MM-dd'T'HH:mm"),
      end: format(addHours(roundedHour, 1), "yyyy-MM-dd'T'HH:mm"),
      color: 'blue'
    }
  }
  
  showEventModal.value = true
}

function closeEventModal() {
  showEventModal.value = false
  editingEvent.value = {
    id: '',
    title: '',
    start: '',
    end: '',
    color: 'blue'
  }
}

async function saveEvent(updatedEvent: CalendarEvent): Promise<void> {
  if (updatedEvent.id) {
    // Update existing event
    const index = events.value.findIndex(e => e.id === updatedEvent.id)
    const originalEvent = events.value[index]
    
    // Filter out only the changed fields
    const changedFields: Partial<CalendarEvent> = {
      id: updatedEvent.id // Always include the ID
    }
    
    // Compare each field and only include those that changed
    if (updatedEvent.title !== originalEvent.title) changedFields.title = updatedEvent.title
    if (updatedEvent.start !== originalEvent.start) changedFields.start = updatedEvent.start
    if (updatedEvent.end !== originalEvent.end) changedFields.end = updatedEvent.end
    if (updatedEvent.color !== originalEvent.color) changedFields.color = updatedEvent.color
    
    const { url, method } = API_Calendar.Put.calendar;
    const { success } = await useFetchWithTokenID(`${url}/${updatedEvent.id}`, method, changedFields) as APIResponse
    if (success) {
      events.value[index] = { ...updatedEvent }
    }
  } else {
    // Add new event
    const { url, method } = API_Calendar.Post.calendar;
    const { data, success } = await useFetchWithTokenID(url, method, updatedEvent) as APIResponse
    if (success) {
      events.value.push(data)
    }
  }
  
  closeEventModal()
}

async function deleteEvent(eventId: string): Promise<void> {
  try {    
    const { url, method } = API_Calendar.Delete.calendar;
    const { success } = await useFetchWithTokenID(`${url}/${eventId}`, method) as APIResponse
    if (success) {
      const index = events.value.findIndex(e => e.id === eventId)
      events.value.splice(index, 1)
    }
  } catch (error) {
    console.error(error)
  } finally {
    closeEventModal()
  }
}

function handleDayClick(date: Date): void {
  // Create a new event at the clicked date
  editingEvent.value = createNewEvent(date)
  showEventModal.value = true
}

function handleWeekHourClick(dayIndex: number, hour: number): void {
  // Create a new event at the clicked hour in the week
  const weekStart = new Date(currentDate.value)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + dayIndex)
  
  editingEvent.value = createNewEvent(weekStart, hour)
  showEventModal.value = true
}

function handleDayHourClick(hour: number): void {
  // Create a new event at the clicked hour on the current date
  editingEvent.value = createNewEvent(currentDate.value, hour)
  showEventModal.value = true
}

function viewMoreEvents(date: string | Date): void {
  // Switch to day view and set the date
  currentDate.value = new Date(date)
  currentView.value = 'day'
}

async function fetchEvents() {
 try {
  const { url, method } = API_Calendar.Get.calendar;
  const { data, success } = await useFetchWithTokenID(url, method) as APIResponse
  if (success) {
    events.value = data
  }
} catch (error) {
   useShowSnackbar().onFailure('Failed to fetch calendar events')
  console.error(error)
 } 
}

onMounted(() => {
  fetchEvents()
})

</script>
