<template>
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
      <h1 class="text-4xl pb-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">My Notes</h1>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center bg-gray-100 rounded-lg">
        <input v-model="searchQuery" type="text" placeholder="Search notes..."
          class="pl-10 pr-4 py-2 rounded-lg focus:outline-none bg-gray-100"
          @input="handleSearch" />
        <MagnifyingGlassIcon class="h-5 w-5 mr-3 text-gray-400" />
      </div>
        <!-- Create Note Button -->
      <button @click="showCreateModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
        <PlusIcon class="w-5 h-5 text-white" />
        <span>Add Notes</span>
      </button>

      <NotesCreateModal v-if="showCreateModal" @close-modal="showCreateModal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline"

const notesStore = useNotesStore()
const searchQuery = ref('')

const handleSearch = () => {
  notesStore.setSearchQuery(searchQuery.value)
}

const showCreateModal = ref(false)

defineEmits(['toggle-view'])
</script>