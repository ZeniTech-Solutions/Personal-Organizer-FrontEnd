<template>
  <div class="min-h-[93vh] bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-1">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Personal Journal</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search entries"
            class="input input-bordered w-72 pl-10"
            @input="searchEntries"
          />
          <MagnifyingGlassIcon class="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-5 h-5" />
        </div>
        <button 
          class="btn btn-primary flex items-center gap-2" 
          @click="openNewEntryDialog"
        >
          <PlusIcon class="w-5 h-5" />
          New Entry
        </button>
      </div>
    </div>

    <div class="flex gap-6 h-[calc(100vh-150px)]">
      <div class="w-80 flex-shrink-0">
        <div class="mb-6">
          <!-- Date picker replacement - using native date input with styling -->
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="font-medium mb-3 text-xl text-gray-700">Select Date</h3>
              <input 
                type="date" 
                v-model="selectedDate" 
                @change="dateSelected" 
                class="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4">
            <h3 class="font-medium mb-3 text-xl text-gray-700">Tags</h3>
            <div v-if="uniqueTags.length" class="flex flex-wrap gap-2">
              <div
                v-for="tag in uniqueTags"
                :key="tag"
                @click="filterByTag(tag)"
                class="badge cursor-pointer"
                :class="activeTag === tag ? 'badge-primary' : 'badge-outline'"
                >
                {{ tag }}
            </div>
        </div>
        <div v-else class="text-gray-400">
                No Tags Available
            </div>
          </div>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto pr-4">
        <div v-if="filteredEntries.length === 0" class="flex flex-col items-center justify-center h-[300px] text-gray-400 opacity-70 text-center">
          <BookOpenIcon class="w-10 h-10 text-gray-400 mb-2" />
          <p class="text-xl">No journal entries found. Start writing today!</p>
        </div>
        
        <div
          v-for="(entry, index) in filteredEntries"
          :key="index"
          class="card bg-base-100 shadow-sm mb-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          :class="{ 'border-l-4 border-l-primary': entry.date === formatDate(selectedDate) }"
        >
          <div class="card-body p-4">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-medium mr-3">{{ formatDisplayDate(entry.date) }}</span>
                <div class="inline-flex items-center gap-1 text-sm opacity-80">
                  <span class="mood-icon mood-icon-animated" :style="{ '--mood-color': getMoodColorHex(entry.mood) }">
                    <svg v-if="entry.mood === 'Excited'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="getMoodColorOpacity(entry.mood)" viewBox="0 0 24 24" :stroke="getMoodColorHex(entry.mood)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="entry.mood === 'Happy' || entry.mood === 'Grateful'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="getMoodColorOpacity(entry.mood)" viewBox="0 0 24 24" :stroke="getMoodColorHex(entry.mood)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="entry.mood === 'Relaxed' || entry.mood === 'Neutral' || entry.mood === 'Tired'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="getMoodColorOpacity(entry.mood)" viewBox="0 0 24 24" :stroke="getMoodColorHex(entry.mood)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="entry.mood === 'Anxious' || entry.mood === 'Sad'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="getMoodColorOpacity(entry.mood)" viewBox="0 0 24 24" :stroke="getMoodColorHex(entry.mood)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="getMoodColorOpacity(entry.mood)" viewBox="0 0 24 24" :stroke="getMoodColorHex(entry.mood)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span>{{ entry.mood }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm" @click="editEntry(entry)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button class="btn btn-ghost btn-sm" @click="confirmDeleteEntry(entry)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="my-3 whitespace-pre-line" v-html="entry.content"></div>
            <div class="mt-2 flex flex-wrap gap-1">
              <div
                v-for="tag in entry.tags"
                :key="tag"
                class="badge badge-outline"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Entry Dialog -->
    <div class="modal" :class="{ 'modal-open': entryDialog }">
      <div class="modal-box max-w-3xl">
        <h3 class="font-medium text-lg border-b border-gray-200 pb-3">
          {{ isEditing ? 'Edit Journal Entry' : 'New Journal Entry' }}
        </h3>
        
        <div class="py-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="label">
                <span class="label-text">Date</span>
              </label>
              <input 
                type="date" 
                v-model="currentEntry.date" 
                class="input input-bordered w-full"
              />
            </div>
            <div>
              <div class="mb-4">
                <label class="label">
                  <span class="label-text">How are you feeling today?</span>
                </label>
                <select 
                  v-model="currentEntry.mood" 
                  class="select select-bordered w-full"
                >
                  <option v-for="mood in moodOptions" :key="mood" :value="mood">{{ mood }}</option>
                </select>
              </div>
              
              <div>
                <label class="label">
                  <span class="label-text">Tags</span>
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <div 
                    v-for="tag in currentEntry.tags" 
                    :key="tag" 
                    class="badge badge-outline gap-1"
                  >
                    {{ tag }}
                    <button @click="() => currentEntry.tags = currentEntry.tags.filter((t: string) => t !== tag)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="join w-full">
                  <input 
                    type="text" 
                    placeholder="Add a tag..." 
                    class="input input-bordered join-item w-full" 
                    v-model="newTag"
                    @keyup.enter="addTag"
                  />
                  <button class="btn join-item" @click="addTag">Add</button>
                </div>
                <div class="mt-2">
                  <span class="text-sm text-gray-500">Available tags:</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <div 
                      v-for="tag in availableTags.filter((t: string) => !currentEntry.tags.includes(t))" 
                      :key="tag"
                      @click="currentEntry.tags.push(tag)"
                      class="badge badge-sm badge-outline cursor-pointer"
                    >
                      {{ tag }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="label">
              <span class="label-text">Write your thoughts...</span>
            </label>
            <textarea
              v-model="currentEntry.content"
              class="textarea textarea-bordered w-full h-40"
              placeholder="What's on your mind today?"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-action">
          <button class="btn btn-ghost" @click="entryDialog = false">Cancel</button>
          <button class="btn btn-primary" @click="saveEntry">Save</button>
        </div>
      </div>
      <div class="fixed inset-0 bg-black bg-opacity-50 -z-10" @click="entryDialog = false"></div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div class="modal" :class="{ 'modal-open': deleteDialog }">
      <div class="modal-box">
        <h3 class="font-medium text-lg border-b border-gray-200 pb-3">Delete Journal Entry</h3>
        <p class="py-4">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="deleteDialog = false">Cancel</button>
          <button class="btn btn-error" @click="deleteEntry">Delete</button>
        </div>
      </div>
      <div class="fixed inset-0 bg-black bg-opacity-50 -z-10" @click="deleteDialog = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { MagnifyingGlassIcon, PlusIcon, BookOpenIcon,  } from '@heroicons/vue/24/outline';
import { API_Journal } from '~/api/journal'
import type { APIResponse } from '~/types';

// Define types
interface JournalEntry {
  id: string | null;
  date: string;
  content: string;
  mood: string;
  tags: string[];
}

type MoodType = 'Excited' | 'Happy' | 'Grateful' | 'Relaxed' | 'Neutral' | 
                'Tired' | 'Anxious' | 'Sad' | 'Frustrated' | 'Angry';

interface MoodColors {
  [key: string]: string;
}

// State
const entries = ref<JournalEntry[]>([])
const entryDialog = ref<boolean>(false)
const deleteDialog = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const entryToDelete = ref<JournalEntry | null>(null)
const searchQuery = ref<string>('')
const selectedDate = ref<string>(new Date().toISOString().substr(0, 10))
const activeTag = ref<string | null>(null)
const newTag = ref<string>('')

const currentEntry = ref<JournalEntry>({
  id: null,
  date: new Date().toISOString().substr(0, 10),
  content: '',
  mood: 'Neutral',
  tags: []
})
// Store the original entry for comparison when updating
let originalEntry = <JournalEntry | null>(null)

const moodOptions: MoodType[] = [
  'Excited', 'Happy', 'Grateful', 'Relaxed', 'Neutral', 
  'Tired', 'Anxious', 'Sad', 'Frustrated', 'Angry'
]

// Computed properties
const availableTags = computed<string[]>(() => {
  const tags = new Set<string>()
    if (!Array.isArray(entries.value)) return []
  entries.value.forEach(entry => {
    entry.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

const uniqueTags = computed<string[]>(() => {
  // Check if entries.value is an array before using flatMap
  if (!Array.isArray(entries.value)) return []
  return [...new Set(entries.value.flatMap(entry => entry.tags))]
})

const filteredEntries = computed<JournalEntry[]>(() => {
    if (!Array.isArray(entries.value)) return []
  let filtered = [...entries.value]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(entry => 
      entry.content.toLowerCase().includes(query) || 
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Filter by tag
  if (activeTag.value) {
    filtered = filtered.filter(entry => 
      entry.tags.includes(activeTag.value as string)
    )
  }
  
  // Sort by date (newest first)
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Methods
function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return dateString.substr(0, 10)
}

function formatDisplayDate(dateString: string): string {
  return format(parseISO(dateString), 'MMMM d, yyyy')
}

function getMoodColor(mood: string): string {
  const moodColors: MoodColors = {
    'Excited': 'purple-500',
    'Happy': 'green-500',
    'Grateful': 'teal-500',
    'Relaxed': 'blue-500',
    'Neutral': 'gray-500',
    'Tired': 'gray-600',
    'Anxious': 'amber-500',
    'Sad': 'blue-gray-500',
    'Frustrated': 'orange-500',
    'Angry': 'red-500'
  }
  return moodColors[mood] || 'gray-500'
}

function getMoodColorHex(mood: string): string {
  // Convert Tailwind color classes to hex colors
  const colorMap: {[key: string]: string} = {
    'purple-500': '#8b5cf6',
    'green-500': '#10b981',
    'teal-500': '#14b8a6',
    'blue-500': '#3b82f6',
    'gray-500': '#6b7280',
    'gray-600': '#4b5563',
    'amber-500': '#f59e0b',
    'blue-gray-500': '#64748b',
    'orange-500': '#f97316',
    'red-500': '#ef4444'
  }
  const tailwindClass = getMoodColor(mood)
  return colorMap[tailwindClass] || colorMap['gray-500']
}

function getMoodColorOpacity(mood: string): string {
  // Return the color with opacity for fill
  return getMoodColorHex(mood) + '33' // 20% opacity
}

function addTag(): void {
  if (newTag.value.trim() && !currentEntry.value.tags.includes(newTag.value.trim())) {
    currentEntry.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function openNewEntryDialog(): void {
  isEditing.value = false
  currentEntry.value = {
    id: null,
    date: selectedDate.value,
    content: '',
    mood: 'Neutral',
    tags: []
  }
  newTag.value = ''
  entryDialog.value = true
}

function editEntry(entry: JournalEntry): void {
  isEditing.value = true
  // Store the original entry for comparison when updating
  originalEntry = originalEntry = { ...entry, tags: [...entry.tags] }
  currentEntry.value = { ...entry }
  newTag.value = ''
  entryDialog.value = true
}

async function saveEntry(): Promise<void> {
  if (!currentEntry.value.content.trim()) {
    // Don't save empty entries
    entryDialog.value = false
    return
  }

  if (isEditing.value) {
    // Update existing entry
    const index = entries.value.findIndex(e => e.id === currentEntry.value.id)
    if (index !== -1) {
      entries.value[index] = { ...currentEntry.value }
      await updateEntryToAPI(currentEntry.value)
    }
  } else {
    await createEntryToAPI(currentEntry.value)
  }
  
  entryDialog.value = false
}

function confirmDeleteEntry(entry: JournalEntry): void {
  entryToDelete.value = entry
  deleteDialog.value = true
}

async function deleteEntry(): Promise<void> {
  if (entryToDelete.value) {
    entries.value = entries.value.filter(e => e.id !== entryToDelete.value?.id)
    await deleteEntryFromAPI(entryToDelete.value.id || "")
    deleteDialog.value = false
    entryToDelete.value = null
  }
}

async function deleteEntryFromAPI(entryId: string): Promise<void> {
  try {
    const { url, method } = API_Journal.Delete.entries;
    await useFetchWithTokenID(`${url}/${entryId}`, method)
  } catch (error) {
    console.error('Failed to delete entry from API:', error)
  }
}

function dateSelected(): void {
  // Clear tag filter when date is selected
  activeTag.value = null
}

function filterByTag(tag: string): void {
  activeTag.value = activeTag.value === tag ? null : tag
}

function searchEntries(): void {
  // This function is triggered by the search input
  // The actual filtering is done in the computed property
}

async function createEntryToAPI(entry: JournalEntry): Promise<void> {
  try {
    const { url, method } = API_Journal.Post.entries;
    const {data, success} = await useFetchWithTokenID(url, method, {
      ...entry
    }) as APIResponse
    if (success) entries.value.push(data)
  } catch (error) {
    console.error('Failed to create entry in API:', error)
  }
}

async function updateEntryToAPI(entry: JournalEntry): Promise<void> {
  try {
    const { url, method } = API_Journal.Put.entries;
    
    // Only send fields that have changed
    if (originalEntry) {
      const changedFields: Partial<JournalEntry> = {}
      
      // Compare each field and only include changed ones
      if (originalEntry.date !== entry.date) changedFields.date = entry.date
      if (originalEntry.content !== entry.content) changedFields.content = entry.content
      if (originalEntry.mood !== entry.mood) changedFields.mood = entry.mood

      // For arrays like tags, we need to check if they've changed
      const tagsChanged = originalEntry.tags.length !== entry.tags.length || 
                          !originalEntry.tags.every(tag => entry.tags.includes(tag))
      if (tagsChanged) changedFields.tags = [...entry.tags]

      // Only send the request if there are changes
      if (Object.keys(changedFields).length > 0) {
        await useFetchWithTokenID(`${url}/${entry.id}`, method, changedFields)
      }
    } else {
      // Fallback to sending the full entry if original is not available
      await useFetchWithTokenID(`${url}/${entry.id}`, method, entry)
    }
  } catch (error) {
    console.error('Failed to update entry in API:', error)
  }
}

async function saveEntriesToAPI(type: string): Promise<void> {
  try {
    await useFetchWithTokenID(API_Journal.Put.entries.url, API_Journal.Put.entries.method, {
      entries: entries.value
    })
  } catch (error) {
    console.error('Failed to save entries to API:', error)
  }
}

async function loadEntriesFromAPI(): Promise<void> {
  try {
    const { url, method } = API_Journal.Get.entries;
    const {data} = await useFetchWithTokenID(url, method) as APIResponse;
    if (data) {
      entries.value = data as JournalEntry[]
    }
  } catch (error) {
    console.error('Failed to load entries from API:', error)
    entries.value = []
  }
}

// Lifecycle hooks
onMounted(async () => {
  await loadEntriesFromAPI()
})
</script>

<style scoped>
.mood-icon-animated {
  display: inline-flex;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.mood-icon-animated:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 0 3px var(--mood-color));
}

.mood-icon-animated svg {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>