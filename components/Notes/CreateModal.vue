<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">Create Note</h3>
        <GenericTextInput 
          ref="noteTitleRef"
          type="text"
          placeholder="Note Title"
          label="Note Title"
          v-model="noteForm.title"
          required
        />
        <textarea
          v-model="noteForm.content"
          placeholder="Note Content"
          rows="4"
          class="w-full p-2 border-2 rounded-lg my-4 focus:outline-none"
        ></textarea>
        <!-- Tags Section -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in noteForm.tags"
              :key="tag"
              class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
            >
              {{ tag }}
              <button
                @click="noteForm.tags = noteForm.tags.filter(t => t !== tag)"
                class="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="Add a tag"
              class="flex-1 p-2 border rounded-lg focus:outline-none"
              @keyup.enter="addTag"
            />
            <button
              @click="addTag"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          <div v-if="availableTags.length > 0" class="mt-2">
            <p class="text-sm text-gray-600 mb-1">Available tags:</p>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="addExistingTag(tag)"
                class="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex space-x-2 mb-4">
          <button
            v-for="color in ['gray', 'red', 'yellow', 'green', 'blue', 'purple']"
            :key="color"
            @click="noteForm.color = color"
            :class="[
              `bg-${color}-200 hover:bg-${color}-400`,
              'w-8 h-8 rounded-full transition-colors',
              noteForm.color === color ? `ring-2 ring-${color}-500` : ''
            ]"
          ></button>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveNote"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Note
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
    import { useNotesStore } from '@/stores/notes'
    import { API_Notes } from '~/api/notes'
    import type { APIResponse, ChildInputRef } from '~/types'

    const notesStore = useNotesStore()
    const noteForm = ref({
        id: '',
        title: '',
        content: '',
        color: 'gray',
        tags: [] as string[]
    })

    const emit = defineEmits(['closeModal'])

    const newTag = ref('')
    const noteTitleRef = ref<ChildInputRef | null>(null)
    const availableTags = computed(() => notesStore.availableTags)

    const addTag = () => {
        if (!newTag.value || noteForm.value.tags.includes(newTag.value)) return
        noteForm.value.tags.push(newTag.value)
        notesStore.addTag(newTag.value)
        newTag.value = ''
    }

    const addExistingTag = (tag: string) => {
        if (!noteForm.value.tags.includes(tag)) {
            noteForm.value.tags.push(tag)
        }
    }

    const closeModal = () => {
        emit('closeModal')
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
    try {     
        if (!noteForm.value.title || !noteForm.value.content) return
        const { url, method } = API_Notes.Post.notes
        const { data, success } = await useFetchWithTokenID(url, method, noteForm.value) as APIResponse
        if (!success) return

        notesStore.createNote(
        data.id,
        noteForm.value.title,
        noteForm.value.content,
        noteForm.value.color,
        noteForm.value.tags
        )
    
        closeModal()
    } catch (error) {
        console.error('Error creating note:', error)
    }
    }

</script>