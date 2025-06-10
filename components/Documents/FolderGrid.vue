<template>
  <div v-if="currentFolderContents.length || currentFolderFiles.length" class="flex flex-wrap gap-8">
    <div v-for="folder in currentFolderContents" :key="folder.id"
      class="p-4 border rounded-lg cursor-pointer w-40 hover:bg-gray-50 group" @click="navigateToFolder(folder.id)">
      <div class="flex relative flex-col items-center justify-between">
        <button class="flex flex-col w-full items-center space-x-2 space-y-5">
          <span class="text-gray-600">
            <FolderIcon class="w-24 h-24 text-yellow-400" />
          </span>
          <span>{{ folder.name }}</span>
        </button>
        <div
          class="absolute opacity-0 bg-white -top-10 flex flex-col -right-8 p-2 space-y-5 group-hover:opacity-100 transition-opacity">
          <button @click.stop="editFolder(folder)" class="text-blue-600 hover:text-blue-800 mr-2">
            <PencilIcon class="w-5 h-5" />
          </button>
          <button @click.stop="deleteFolder(folder.id)" class="text-red-600 hover:text-red-800">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <div v-for="file in currentFolderFiles" :key="file.id"
      class="p-4 border rounded-lg cursor-pointer w-40 hover:bg-gray-50 group">
      <div class="flex flex-col relative items-center justify-between">
        <button class="flex flex-col w-full items-center space-x-2 space-y-5">
          <span class="text-gray-600">
            <DocumentIcon class="w-24 h-24 text-yellow-400" />
          </span>
          <span>{{ file.title }}</span>
        </button>
        <div
          class="absolute opacity-0 bg-white -top-10 flex flex-col -right-8 p-2 space-y-5 group-hover:opacity-100 transition-opacity">
          <button @click.stop="editFile(file.id)" class="text-blue-600 hover:text-blue-800 mr-2">
            <PencilIcon class="w-5 h-5" />
          </button>
          <button @click.stop="deleteFile(file.id)" class="text-red-600 hover:text-red-800">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Empty State -->
  <div v-else class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <PencilSquareIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ 'Get started by adding your first document.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { FolderIcon, DocumentIcon } from '@heroicons/vue/24/solid';
import { useDocumentsStore } from '@/stores/documentsStore';
import { storeToRefs } from 'pinia';

const documentsStore = useDocumentsStore();
const { currentFolderContents, currentFolderFiles } = storeToRefs(documentsStore);

const navigateToFolder = (id: string | null) => {
  documentsStore.navigateToFolder(id);
};

const editFolder = (folder: { id: string; name: string }) => {
  documentsStore.editFolder(folder);
};

const deleteFolder = (id: string) => {
  documentsStore.deleteFolder(id);
};

const editFile = (fileId: string) => {
  documentsStore.editFile(fileId);
};

const deleteFile = (id: string) => {
  documentsStore.deleteFile(id);
};
</script>