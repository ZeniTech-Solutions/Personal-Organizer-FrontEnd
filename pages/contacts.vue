<template>
  <div class="p-6 min-h-[93vh]">
    <!-- Header with search and add contact button -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <GenericTextInput
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts..."
          />
        </div>
      </div>
      <button
        @click="openContactModal()"
        class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Contacts
      </button>
    </div>

    <!-- Tag filters -->
    <div class="flex gap-3 mb-6">
      <button
        v-for="tag in ['All', 'Work', 'Friends', 'Family']"
        :key="tag"
        @click="selectedTag = tag"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium',
          selectedTag === tag
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Contacts grid -->
    <div v-if="filteredContacts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="contact in filteredContacts"
        :key="contact.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-semibold">
              {{ getInitials(contact.name) }}
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ contact.name }}</h3>
              <p class="text-sm text-gray-500">{{ contact.contactNo }}</p>  <!-- Changed from email to phone -->
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editContact(contact)"
              class="text-gray-400 hover:text-gray-600"
              title="Edit contact"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              @click="confirmDeleteContact(contact)"
              class="text-gray-400 hover:text-red-600"
              title="Delete contact"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in contact.tags"
            :key="tag"
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="{
              'bg-blue-100 text-blue-700': tag === 'Work',
              'bg-green-100 text-green-700': tag === 'Friends',
              'bg-purple-100 text-purple-700': tag === 'Family'
            }"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <PencilSquareIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No contacts found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ 'Get started by adding your first contact.' }}
        </p>
        <div class="mt-6">
          <button
            @click="$emit('add')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
            Add Contacts
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Contact' : 'Add New Contact' }}</h2>
        <form @submit.prevent="saveContact">
          <div class="space-y-4">
            <div>
              <GenericTextInput
                v-model="currentContact.name"
                type="text"
                label="Name"
                required
              />
            </div>
            <div>
              <GenericTextInput
                v-model="currentContact.contactNo"
                type="tel"
                pattern="[0-9]{10}"
                label="Phone Number"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tags</label>
              <div class="mt-2 space-x-2">
                <label
                  v-for="tag in ['Work', 'Friends', 'Family']"
                  :key="tag"
                  class="inline-flex items-center"
                >
                  <input
                    type="checkbox"
                    v-model="currentContact.tags"
                    :value="tag"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ tag }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {{ isEditing ? 'Save Changes' : 'Add Contact' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">Delete Contact</h2>
        <p class="text-gray-700 mb-6">Are you sure you want to delete <span class="font-semibold">{{ contactToDelete?.name }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="deleteContact"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { API_Contacts } from '@/api/contacts'
import type { APIResponse } from '~/types'
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { Contact } from '~/types/products'

const contacts = ref<Contact[]>([])
const searchQuery = ref('')
const selectedTag = ref('All')
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const currentContact = ref<Contact>({
  id: '',
  name: '',
  contactNo: '',  // Changed from email to phone
  tags: []
})
const contactToDelete = ref<Contact | null>(null)

const filteredContacts = computed(() => {
  let filtered = contacts.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.contactNo.includes(query)  // Changed from email to phone
    )
  }

  // Apply tag filter
  if (selectedTag.value !== 'All') {
    filtered = filtered.filter(contact =>
      contact.tags.includes(selectedTag.value)
    )
  }


  // Sort alphabetically by name
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

function openContactModal(contact: Contact | null = null): void {
  if (contact) {
    currentContact.value = { ...contact }
    isEditing.value = true
  } else {
    currentContact.value = {
      id: '',
      name: '',
      contactNo: '',
      tags: []
    }
    isEditing.value = false
  }
  showModal.value = true
}

function editContact(contact: Contact): void {
  openContactModal(contact)
}

function confirmDeleteContact(contact: Contact): void {
  contactToDelete.value = contact
  showDeleteModal.value = true
}

async function deleteContact(): Promise<void> {
  if (contactToDelete.value) {
    // Remove from local state
    const index = contacts.value.findIndex(c => c.id === contactToDelete.value?.id)
    if (index !== -1) {
      contacts.value.splice(index, 1)
      
      // Call API to delete
      const { url, method } = API_Contacts.Delete.contacts
      const { success } = await useFetchWithTokenID(`${url}/${contactToDelete.value.id}`, method) as APIResponse
      
      // Close modal
      showDeleteModal.value = false
      contactToDelete.value = null
    }
  }
}

async function saveContact(): Promise<void> {
  if (isEditing.value) {
    const index = contacts.value.findIndex(c => c.id === currentContact.value.id)
    if (index !== -1) {
      // Find the original contact
      const originalContact = contacts.value[index]
      
      // Create an object with only the changed fields
      const changedFields: Partial<Contact> = {}
      if (originalContact.name !== currentContact.value.name) changedFields.name = currentContact.value.name
      if (originalContact.contactNo !== currentContact.value.contactNo) changedFields.contactNo = currentContact.value.contactNo
      
      // Compare tags arrays
      if (JSON.stringify(originalContact.tags) !== JSON.stringify(currentContact.value.tags)) {
        changedFields.tags = [...currentContact.value.tags]
      }
      
      // Only update if there are changes
      if (Object.keys(changedFields).length > 0) {
        // Update local state with only changed fields
        contacts.value[index] = { ...originalContact, ...changedFields }
        
        // Call API with only changed fields (if needed)
        const { url, method } = API_Contacts.Put.contacts
        const { success } = await useFetchWithTokenID(`${url}/${originalContact.id}`, method, changedFields) as APIResponse
      }
    }
  } else {
    const { url, method } = API_Contacts.Post.contacts
    const { data } = await useFetchWithTokenID(url, method, currentContact.value) as APIResponse
    contacts.value.push({
      ...currentContact.value,
      id: data.id
    })
  }
  showModal.value = false
}

async function fetchContacts(): Promise<void> {
  const { url, method } = API_Contacts.Get.contacts
  const { data, success } = await useFetchWithTokenID(url, method) as APIResponse;
  if (success) {
    contacts.value = data as Contact[]
  }
}

onMounted(() => {
  fetchContacts()
})

</script>