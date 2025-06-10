<template>
  <div>
    <div>
      <h1 class="text-2xl font-semibold">My Documents</h1>
    </div>
    <div class="mb-6 mt-5 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button v-if="breadcrumbs.length" @click="navigateUp" class="rounded-md cursor-pointer"
          :disabled="!currentFolder">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center">
          <span v-for="(folder, index) in breadcrumbs" :key="folder.id" class="flex items-center">
            <span v-if="index !== 0" class="text-gray-600">/</span>
            <button @click="navigateToFolder(folder.id)" class="px-2 py-1 text-blue-600 hover:underline">
              {{ folder.name }}
            </button>
          </span>
        </div>
      </div>
      <div class="flex space-x-2">
        <button @click="showCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          New Folder
        </button>
        <button @click="showAddFileModal" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Add File
        </button>
        <div class="flex items-center border-2">
          <span :class="[isGridView && 'bg-gray-300', 'p-2 border-r-2 cursor-pointer']" @click="toggleViewMode">
            <Squares2X2Icon :class="['w-5 h-5']" />
          </span>
          <span :class="[!isGridView && 'bg-gray-300', 'p-2 cursor-pointer']" @click="toggleViewMode">
            <ListBulletIcon class="w-5 h-5" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/vue/24/outline';
import { useDocumentsStore } from '@/stores/documentsStore';
import { storeToRefs } from 'pinia';

const documentsStore = useDocumentsStore();
const { breadcrumbs, isGridView, currentFolder } = storeToRefs(documentsStore);

const navigateToFolder = (id: string | null) => {
  documentsStore.navigateToFolder(id);
};

const navigateUp = () => {
  documentsStore.navigateUp();
};

const toggleViewMode = () => {
  documentsStore.toggleViewMode();
};

const showCreateModal = () => {
  documentsStore.showCreateModal = true;
};

const showAddFileModal = () => {
  documentsStore.showAddFileModal = true;
};
</script>