<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <div class="p-5 flex-grow">
      <div class="flex items-start justify-between">
        <div class="flex items-center">
          <div :class="`p-2 rounded-lg ${getCategoryColor(password.category)}`">
            <component :is="getCategoryIcon(password.category)" class="h-5 w-5 text-white" />
          </div>
          <h3 class="ml-3 text-lg font-medium text-gray-900 truncate max-w-[150px]" :title="password.title">{{ password.title }}</h3>
        </div>
        <div class="flex space-x-1">
          <button @click="$emit('edit', password)" class="text-gray-400 hover:text-indigo-600">
            <PencilIcon class="h-5 w-5" />
          </button>
          <button @click="$emit('delete', password.id)" class="text-gray-400 hover:text-red-600">
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="mt-4 space-y-3">
        <div class="flex items-center">
          <UserIcon class="h-4 w-4 text-gray-400 mr-2" />
          <p class="text-sm text-gray-600 truncate max-w-[200px]" :title="password.username">{{ password.username }}</p>
        </div>
        <div class="flex items-center">
          <LockClosedIcon class="h-4 w-4 text-gray-400 mr-2" />
          <div class="flex items-center">
            <p class="text-sm text-gray-600">{{ isPasswordVisible ? password.password : '••••••••' }}</p>
            <button 
              @click="togglePasswordVisibility" 
              class="ml-2 text-gray-400 hover:text-indigo-600"
            >
              <component :is="isPasswordVisible ? EyeSlashIcon : EyeIcon" class="h-4 w-4" />
            </button>
            <button 
              @click="copyToClipboard(password.password)" 
              class="ml-2 text-gray-400 hover:text-indigo-600"
              title="Copy to clipboard"
            >
              <ClipboardDocumentIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div v-if="password.website" class="flex items-center">
          <GlobeAltIcon class="h-4 w-4 text-gray-400 mr-2" />
          <a 
            :href="ensureHttpPrefix(password.website)" 
            target="_blank" 
            class="text-sm text-indigo-600 hover:text-indigo-800 truncate max-w-[200px]" 
            :title="password.website"
          >
            {{ formatUrl(password.website) }}
          </a>
        </div>
      </div>
    </div>
    <div class="px-5 py-3 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
      <span>{{ formatDate(password.createdAt) }}</span>
      <span class="px-2 py-1 rounded-full text-xs" :class="getCategoryBadgeColor(password.category)">
        {{ password.category }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon,
  KeyIcon,
  CreditCardIcon,
  IdentificationIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  FilmIcon
} from '@heroicons/vue/24/outline';
import type { PasswordEntry } from '~/stores/passwordStore';

const props = defineProps<{
  password: PasswordEntry;
}>();

defineEmits(['edit', 'delete']);

const isPasswordVisible = ref(false);

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  
  // Clear clipboard after 60 seconds for security
  setTimeout(() => {
    // Only clear if it still contains the password
    navigator.clipboard.readText().then(clipboardText => {
      if (clipboardText === text) {
        navigator.clipboard.writeText('');
      }
    }).catch(err => console.error('Failed to read clipboard:', err));
  }, 60000);
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

function ensureHttpPrefix(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Social Media':
      return UserIcon;
    case 'Email':
      return EnvelopeIcon;
    case 'Banking':
      return BuildingLibraryIcon;
    case 'Shopping':
      return CreditCardIcon;
    case 'Work':
      return IdentificationIcon;
    case 'Entertainment':
      return FilmIcon;
    default:
      return KeyIcon;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Social Media':
      return 'bg-blue-500';
    case 'Email':
      return 'bg-indigo-500';
    case 'Banking':
      return 'bg-emerald-500';
    case 'Shopping':
      return 'bg-pink-500';
    case 'Work':
      return 'bg-orange-500';
    case 'Entertainment':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
}

function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'Social Media':
      return 'bg-blue-100 text-blue-800';
    case 'Email':
      return 'bg-indigo-100 text-indigo-800';
    case 'Banking':
      return 'bg-emerald-100 text-emerald-800';
    case 'Shopping':
      return 'bg-pink-100 text-pink-800';
    case 'Work':
      return 'bg-orange-100 text-orange-800';
    case 'Entertainment':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>