<template>
  <div>
    <!-- Password Cards Grid -->
    <div v-if="filteredPasswords.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PasswordManagerPasswordCard
        v-for="password in filteredPasswords"
        :key="password.id"
        :password="password"
        @edit="$emit('edit', password)"
        @delete="$emit('delete', password.id)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <KeyIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No passwords found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery ? 'No passwords match your search criteria.' : 'Get started by adding your first password.' }}
        </p>
        <div class="mt-6">
          <button
            @click="$emit('add')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyIcon, PlusIcon } from '@heroicons/vue/24/outline';
import type { PasswordEntry } from '~/stores/passwordStore';

const props = defineProps<{
  passwords: PasswordEntry[];
  searchQuery: string;
}>();

defineEmits(['edit', 'delete', 'add']);

const filteredPasswords = computed(() => {
  if (!props.searchQuery) return props.passwords;
  
  const query = props.searchQuery.toLowerCase();
  return props.passwords.filter(password => 
    password.title.toLowerCase().includes(query) ||
    password.username.toLowerCase().includes(query) ||
    password.category.toLowerCase().includes(query) ||
    (password.website && password.website.toLowerCase().includes(query))
  );
});
</script>