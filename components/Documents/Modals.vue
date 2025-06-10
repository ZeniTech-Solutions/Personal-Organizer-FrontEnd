<template>
  <!-- Create/Edit Folder Modal -->
  <div v-if="showCreateModal || editingFolder"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-semibold mb-4">
        {{ editingFolder ? 'Edit Folder' : 'Create New Folder' }}
      </h3>
      <GenericTextInput
        v-model="folderName"
        label="Folder name"
        placeholder="Folder name"
        class="mb-4"
      />
      <div class="flex justify-end space-x-2">
        <button @click="cancelModal" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button @click="saveFolder" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {{ editingFolder ? 'Save' : 'Create' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Add/Edit File Modal -->
  <div v-if="showAddFileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-semibold mb-4">
        {{ editingFile ? 'Edit File' : 'Add New File' }}
      </h3>
      <GenericTextInput
        v-model="fileName"
        label="File name"
        placeholder="File name"
        class="mb-4"
      />
      <input v-if="!editingFile" type="file" @change="handleFileUpload" class="file-input file-input-bordered w-full mb-4">
      <div class="flex justify-end space-x-2">
        <button @click="cancelFileModal" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button @click="saveFile" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          {{ editingFile ? 'Save' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentsStore } from '@/stores/documentsStore';
import { storeToRefs } from 'pinia';

const documentsStore = useDocumentsStore();
const { 
  showCreateModal, 
  showAddFileModal, 
  editingFolder, 
  editingFile, 
  folderName, 
  fileName 
} = storeToRefs(documentsStore);

const saveFolder = () => {
  documentsStore.saveFolder();
};

const cancelModal = () => {
  documentsStore.cancelModal();
};

const saveFile = () => {
  documentsStore.saveFile();
};

const cancelFileModal = () => {
  documentsStore.cancelFileModal();
};

const handleFileUpload = (event: Event) => {
  documentsStore.handleFileUpload(event);
};
</script>