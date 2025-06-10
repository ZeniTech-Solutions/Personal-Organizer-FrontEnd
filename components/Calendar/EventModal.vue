<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">{{ event.id ? 'Edit Event' : 'Add / Edit Event' }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      <p class="text-gray-600 mb-4">Plan your next big moment, schedule or edit an event to stay on track.</p>
      
      <form @submit.prevent="saveEvent">
        <div class="mb-4">
          <GenericTextInput
            ref="userTitleRef"
            v-model="event.title"
            label="Event Title"
            placeholder="Project submission #2"
            type="text"
            :required="true"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Event Color</label>
          <div class="flex gap-3">
            <label 
              v-for="color in eventColors" 
              :key="color.value"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input 
                type="radio" 
                v-model="event.value"
                class="hidden"
              />
              <span 
                class="w-5 h-5 rounded-full inline-block border-2" 
                :class="{
                  [`bg-${color.value}-500 border-${color.value}-500`]: event.color === color.value,
                  [`bg-${color.value}-200 border-gray-300`]: event.color !== color.value
                }"
              ></span>
              <span class="text-sm">{{ color.label }}</span>
            </label>
          </div>
        </div>
        
        <div class="mb-4">
          <GenericTextInput
            ref="dateRef"
            v-model="eventDate"
            label="Event Date"  
            type="date"
            :required="true"
          />
        </div>

        <div class="mb-4">
          <GenericTextInput
            ref="startRef"
            v-model="startTime"
            label="Start Time"  
            type="time"
            :required="true"
          />
        </div>
        
        <div class="mb-6">
          <GenericTextInput
            ref="endRef"
            v-model="endTime"
            label="End Time"  
            type="time"
            :required="true"
          />
        </div>
        
        <div class="flex justify-between gap-2">
          <button 
            v-if="event.id" 
            type="button"
            class="px-4 py-2 bg-red-600 text-white rounded-md"
            @click="deleteEvent"
          >
            Delete
          </button>
          <div class="flex gap-2 ml-auto">
            <button 
              type="button"
              class="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              @click="closeModal"
            >
              Close
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {{ event.id ? 'Update changes' : 'Save Event' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { format, parseISO } from 'date-fns'
import type { ChildInputRef } from "~/types";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  editingEvent: {
    type: Object,
    required: true
  }
})

interface EventColor {
  value: string;
  label: string;
  color: string;
}

const eventColors: EventColor[] = [
  { color: 'red', value: 'red', label: 'Danger' },
  { color: 'green', value: 'green', label: 'Success' },
  { color: 'blue', value: 'blue', label: 'Primary' },
  { color: 'yellow', value: 'yellow', label: 'Warning' }
]

const emit = defineEmits(['close', 'save', 'delete'])
const userTitleRef = ref<ChildInputRef | null>(null)
const dateRef = ref<ChildInputRef | null>(null)
const startRef = ref<ChildInputRef | null>(null)
const endRef = ref<ChildInputRef | null>(null)

// Local copy of the event being edited
const event = ref({ ...props.editingEvent })

// Separate date and time inputs
const eventDate = ref('')
const startTime = ref('')
const endTime = ref('')

// Extract date and times from event when editing
watch(() => props.editingEvent, (newVal) => {
  event.value = { ...newVal }
  
  if (newVal.start) {
    const startDate = parseISO(newVal.start)
    eventDate.value = format(startDate, 'yyyy-MM-dd')
    startTime.value = format(startDate, 'HH:mm')
  }
  
  if (newVal.end) {
    const endDate = parseISO(newVal.end)
    endTime.value = format(endDate, 'HH:mm')
  }
}, { deep: true })

// Watch for changes in the show prop
watch(() => props.show, (newVal) => {
  if (newVal) {
    event.value = { ...props.editingEvent }
    
    if (props.editingEvent.start) {
      const startDate = parseISO(props.editingEvent.start)
      eventDate.value = format(startDate, 'yyyy-MM-dd')
      startTime.value = format(startDate, 'HH:mm')
    }
    
    if (props.editingEvent.end) {
      const endDate = parseISO(props.editingEvent.end)
      endTime.value = format(endDate, 'HH:mm')
    }
  }
})

function closeModal() {
  emit('close')
}

function saveEvent() {
  // Combine date and time inputs
  const [year, month, day] = eventDate.value.split('-')
  
  // Create ISO strings with the date and respective times
  const startDateTime = `${year}-${month}-${day}T${startTime.value}`
  const endDateTime = `${year}-${month}-${day}T${endTime.value}`
  
  // Update the event object with the new date-time values
  const updatedEvent = {
    ...event.value,
    start: startDateTime,
    end: endDateTime
  }
  
  emit('save', updatedEvent)
}

function deleteEvent() {
  emit('delete', event.value.id)
}
</script>