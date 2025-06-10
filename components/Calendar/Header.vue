<template>
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center gap-2">
      <button @click="prev" class="btn btn-sm btn-ghost">
        <ChevronLeftIcon class="w-5 h-5" />
      </button>
      <h2 class="text-xl font-semibold">{{ formatCalendarTitle }}</h2>
      <button @click="next" class="btn btn-sm btn-ghost">
        <ChevronRightIcon class="w-5 h-5" />
      </button>
    </div>
    <div class="flex gap-2">
      <button 
        @click="setView('month')" 
        class="btn btn-sm" 
        :class="{'btn-primary': currentView === 'month', 'btn-ghost': currentView !== 'month'}"
      >
        Month
      </button>
      <button 
        @click="setView('week')" 
        class="btn btn-sm" 
        :class="{'btn-primary': currentView === 'week', 'btn-ghost': currentView !== 'week'}"
      >
        Week
      </button>
      <button 
        @click="setView('day')" 
        class="btn btn-sm" 
        :class="{'btn-primary': currentView === 'day', 'btn-ghost': currentView !== 'day'}"
      >
        Day
      </button>
    </div>
  </div>
</template>

<script setup>
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true
  },
  currentView: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['prev', 'next', 'setView'])

// Computed properties
const formatCalendarTitle = computed(() => {
  if (props.currentView === 'month') {
    return format(props.currentDate, 'MMMM yyyy')
  } else if (props.currentView === 'week') {
    const start = startOfWeek(props.currentDate)
    const end = endOfWeek(props.currentDate)
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  } else {
    return format(props.currentDate, 'MMMM d, yyyy')
  }
})

// Methods
function prev() {
  emit('prev')
}

function next() {
  emit('next')
}

function setView(view) {
  emit('setView', view)
}
</script>