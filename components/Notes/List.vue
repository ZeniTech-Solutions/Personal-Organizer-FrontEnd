<template>
  <div>
    <div class="flex space-x-4 mb-4">
      <button v-for="period in ['All', 'Today', 'This Week', 'This Month']" :key="period"
        class="text-gray-600 hover:text-gray-900 pb-2 border-b-2 hover:border-gray-900 transition-colors"
        :class="[period === selectedPeriod ? 'border-gray-900 text-gray-900 border-b-2' : 'border-transparent']"
        @click="setSelectedPeriod(period as 'All' | 'Today' | 'This Week' | 'This Month')">
        {{ period }}
      </button>
    </div>

    <!-- Notes Grid -->
    <div v-if="filteredNotes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="note in filteredNotes" :key="note.id"
        :class="[`bg-${note.color}-100`, 'p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group']">
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-medium">{{ note.title }}</h3>
          <div class="flex space-x-2">
            <button @click="editNote(note)"
              class="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="deleteNoteConfirm(note.id)"
              class="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p class="text-gray-600 mt-2 line-clamp-3">{{ note.content }}</p>
        <div class="flex flex-wrap gap-1 mt-2">
          <span v-for="tag in note.tags" :key="tag" class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
            {{ tag }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mt-4">{{ formatDate(note.updatedAt) }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <PencilSquareIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No notes found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ 'Get started by adding your first note.' }}
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
            Add Notes
          </button>
        </div>
      </div>
    </div>

    <NotesCreateModal v-if="showCreateModal" @close-modal="showCreateModal = false" />

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">Edit Note</h3>
        <GenericTextInput
          ref="noteTitleRef"
          v-model="noteForm.title"
          placeholder="Note Title"
          label="Note Title"
          type="text"
          :required="true"
        />
        <textarea v-model="noteForm.content" placeholder="Note Content" rows="4"
          class="w-full p-2 border rounded-lg my-4 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <!-- Tags Section -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-2 mb-2">
            <span v-for="tag in noteForm.tags" :key="tag"
              class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
              {{ tag }}
              <button @click="noteForm.tags = noteForm.tags.filter(t => t !== tag)"
                class="ml-1 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input v-model="newTag" type="text" placeholder="Add a tag"
              class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="addTag" />
            <button @click="addTag"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Add
            </button>
          </div>
          <div v-if="availableTags.length > 0" class="mt-2">
            <p class="text-sm text-gray-600 mb-1">Available tags:</p>
            <div class="flex flex-wrap gap-1">
              <button v-for="tag in availableTags" :key="tag" @click="addExistingTag(tag)"
                class="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex space-x-2 mb-4">
          <button v-for="color in ['gray', 'red', 'yellow', 'green', 'blue', 'purple']" :key="color"
            @click="noteForm.color = color" :class="[
              `bg-${color}-100 hover:bg-${color}-200`,
              'w-8 h-8 rounded-full transition-colors',
              noteForm.color === color ? `ring-2 ring-${color}-500` : ''
            ]"></button>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="closeModal" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button @click="saveNote"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            {{ showEditModal ? 'Save Changes' : 'Create Note' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Delete Note</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
        <div class="flex justify-end space-x-2">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useNotesStore } from '@/stores/notes'
import { API_Notes } from '~/api/notes'
import type { APIResponse, ChildInputRef } from '~/types'

interface Note {
  id: string
  title: string
  content: string
  color: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const store = useNotesStore()
const { notes } = storeToRefs(store);
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const noteToDeleteId = ref('')
const showCreateModal = ref(false)
const noteTitleRef = ref<ChildInputRef | null>(null)

const noteForm = ref({
  id: '',
  title: '',
  content: '',
  color: 'gray',
  tags: [] as string[]
})

const newTag = ref('')
const availableTags = computed(() => store.availableTags)

const filteredNotes = ref<Note[]>([])
const selectedPeriod = computed(() => store.selectedPeriod)

const setSelectedPeriod = (period:  'All' | 'Today' | 'This Week' | 'This Month') => {
  store.setSelectedPeriod(period)
  filteredNotes.value = store.filteredNotes
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

const closeModal = () => {
  showEditModal.value = false
  noteForm.value = {
    id: '',
    title: '',
    content: '',
    color: 'gray',
    tags: []
  }
  newTag.value = ''
}

const saveNote = async () => {
  if (!noteForm.value.title || !noteForm.value.content) return

  // Find the original note to compare with current form values
  const originalNote = filteredNotes.value.find(note => note.id === noteForm.value.id)
  if (!originalNote) return

  // Create an update object with only changed fields
  const updates: {
    title?: string
    content?: string
    color?: string
    tags?: string[]
  } = {}

  // Only include fields that have changed
  if (noteForm.value.title !== originalNote.title) {
    updates.title = noteForm.value.title
  }

  if (noteForm.value.content !== originalNote.content) {
    updates.content = noteForm.value.content
  }

  if (noteForm.value.color !== originalNote.color) {
    updates.color = noteForm.value.color
  }

  // Compare tags arrays
  const tagsChanged = noteForm.value.tags.length !== originalNote.tags.length ||
    noteForm.value.tags.some(tag => !originalNote.tags.includes(tag))

  if (tagsChanged) {
    updates.tags = noteForm.value.tags
  }

  // Only update if there are changes
  if (Object.keys(updates).length > 0) {
    try {
      const { url, method } = API_Notes.Put.notes;
      const { success } = await useFetchWithTokenID(`${url}/${noteForm.value.id}`, method, updates) as APIResponse;
      if (!success) return
      store.updateNote(noteForm.value.id, updates)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  closeModal()
}

const editNote = (note: any) => {
  noteForm.value = {
    id: note.id,
    title: note.title,
    content: note.content,
    color: note.color,
    tags: [...note.tags]
  }
  showEditModal.value = true
}

const deleteNoteConfirm = (id: string) => {
  noteToDeleteId.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    const { url, method } = API_Notes.Delete.notes
    const { success } = await useFetchWithTokenID(`${url}/${noteToDeleteId.value}`, method) as APIResponse
    if (!success) return
    store.deleteNote(noteToDeleteId.value)
    showDeleteModal.value = false
    noteToDeleteId.value = ''
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}

const addTag = () => {
  if (!newTag.value || noteForm.value.tags.includes(newTag.value)) return
  noteForm.value.tags.push(newTag.value)
  store.addTag(newTag.value)
  newTag.value = ''
}

const addExistingTag = (tag: string) => {
  if (!noteForm.value.tags.includes(tag)) {
    noteForm.value.tags.push(tag)
  }
}

async function fetchNotes() {
  try {
    const { url, method } = API_Notes.Get.notes
    const { data } = await useFetchWithTokenID(url, method) as APIResponse;

    // Clear existing notes before adding new ones
    store.notes = []

    // Add each note to the store
    const filtered = data.map((note: any) => {
      // Ensure dates are properly converted to Date objects
      const createdAt = new Date(note.createdAt)
      const updatedAt = new Date(note.updatedAt)

      delete note._id
      delete note.userId
      delete note.__v

      // Add note to store
      return {
        ...note,
        createdAt,
        updatedAt
      }
    })
    // Add tags to the store
    store.storeNotes(filtered)
  } catch (error) {
    console.error('Error fetching notes:', error)
  }
}

watch(notes, () => {
  filteredNotes.value = store.filteredNotes
})

onMounted(async () => {
  await fetchNotes()
})
</script>