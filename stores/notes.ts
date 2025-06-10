import { defineStore } from 'pinia'

interface Note {
  id: string
  title: string
  content: string
  color: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface NoteUpdate {
  title?: string
  content?: string
  color?: string
  tags?: string[]
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    availableTags: [] as string[],
    selectedPeriod: 'All' as 'All' | 'Today' | 'This Week' | 'This Month',
    searchQuery: ''
  }),

  getters: {
    filteredNotes: (state) => {
      let filtered = state.notes

      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // Filter by period
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      // Get start of current week (Sunday)
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      
      // Get start of current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      switch (state.selectedPeriod) {
        case 'All':
         break;
        case 'Today':
          filtered = filtered.filter(note => new Date(note.updatedAt) >= today)
          break
        case 'This Week':
          filtered = filtered.filter(note => new Date(note.updatedAt) >= startOfWeek)
          break
        case 'This Month':
          filtered = filtered.filter(note => new Date(note.updatedAt) >= startOfMonth)
          break
      }

      return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    }
  },

  actions: {
    createNote(id: string, title: string, content: string, color: string = 'gray', tags: string[] = []) {
      const newNote: Note = {
        id,
        title,
        content,
        color,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.notes.push(newNote)
      
      // Add any new tags to availableTags
      const newTags = tags.filter(tag => !this.availableTags.includes(tag))
      this.availableTags.push(...newTags)
    },

    storeNotes(notes: Note[]) {
      this.notes = notes

      // Update availableTags based on existing notes
      const allTags = notes.flatMap(note => note.tags)
      this.availableTags = [...new Set(allTags)]
    },

    updateNote(id: string, updates: NoteUpdate) {
      const noteIndex = this.notes.findIndex(note => note.id === id)
      if (noteIndex !== -1) {
        if (updates.tags) {
          // Add any new tags to availableTags
          const newTags = updates.tags.filter(tag => !this.availableTags.includes(tag))
          this.availableTags.push(...newTags)
        }
        
        this.notes[noteIndex] = {
          ...this.notes[noteIndex],
          ...updates,
          updatedAt: new Date()
        }
      }
    },

    addTag(tag: string) {
      if (!this.availableTags.includes(tag)) {
        this.availableTags.push(tag)
      }
    },

    removeTag(tag: string) {
      const index = this.availableTags.indexOf(tag)
      if (index !== -1) {
        this.availableTags.splice(index, 1)
      }
    },

    deleteNote(id: string) {
      const noteIndex = this.notes.findIndex(note => note.id === id)
      if (noteIndex !== -1) {
        this.notes.splice(noteIndex, 1)
      }
    },

    setSelectedPeriod(period: 'All' | 'Today' | 'This Week' | 'This Month') {
      this.selectedPeriod = period
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    }
  }
})