<template>
  <div class="min-h-[93vh] bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
    <main>
      <!-- Header Section -->
      <div class="mb-6 space-y-2 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 class="py-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Password Manager</h1>
          <p class="text-gray-600 mt-1">Securely store and manage your passwords</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search passwords..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
          </div>
          <button
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Password
          </button>
        </div>
      </div>

      <!-- Password List Component -->
      <PasswordManagerPasswordList 
        :passwords="passwordStore.passwords" 
        :searchQuery="searchQuery"
        @edit="editPassword"
        @delete="confirmDelete"
        @add="openAddModal"
      />

      <!-- Password Form Modal Component -->
      <PasswordManagerPasswordFormModal
        :isOpen="isModalOpen"
        :isEditing="isEditing"
        :passwordData="currentPassword"
        @close="closeModal"
        @save="savePassword"
      />

      <!-- Delete Confirmation Modal Component -->
      <PasswordManagerDeleteConfirmationModal
        :isOpen="isDeleteModalOpen"
        @close="isDeleteModalOpen = false"
        @confirm="deletePassword"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { usePasswordStore, type PasswordEntry } from '~/stores/passwordStore';

// Store
const passwordStore = usePasswordStore();

// State
const searchQuery = ref('');
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditing = ref(false);
const passwordIdToDelete = ref('');
const currentPassword = ref<Partial<PasswordEntry>>();

// Methods
function openAddModal() {
  isEditing.value = false;
  currentPassword.value = undefined;
  isModalOpen.value = true;
}

function editPassword(password: PasswordEntry) {
  isEditing.value = true;
  currentPassword.value = password;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function savePassword(formData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  if (isEditing.value && currentPassword.value?.id) {
    await passwordStore.updatePassword({
      id: currentPassword.value.id,
      ...formData,
      createdAt: currentPassword.value.createdAt || new Date(),
      updatedAt: new Date()
    });
  } else {
    await passwordStore.addPassword(formData);
  }
  
  closeModal();
}

function confirmDelete(id: string) {
  passwordIdToDelete.value = id;
  isDeleteModalOpen.value = true;
}

async function deletePassword() {
  await passwordStore.deletePassword(passwordIdToDelete.value);
  isDeleteModalOpen.value = false;
}

// Initialize the component
onMounted(async () => {
  await passwordStore.fetchPasswords();
});
</script>