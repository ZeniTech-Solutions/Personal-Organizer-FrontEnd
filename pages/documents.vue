<template>
  <div class="min-h-[93vh] bg-gray-50">
    <main class="px-4 py-6">
      <div class="p-4">
        <DocumentsHeader />
        
        <!-- Grid View -->
        <DocumentsFolderGrid v-if="isGridView" />
    
        <!-- List View -->
        <DocumentsFileList v-else />
    
        <!-- Modals -->
        <DocumentsModals />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useDocumentsStore } from '@/stores/documentsStore';

const documentsStore = useDocumentsStore();
const { isGridView } = storeToRefs(documentsStore);

onMounted(() => {
  documentsStore.fetchFiles();
});
</script>