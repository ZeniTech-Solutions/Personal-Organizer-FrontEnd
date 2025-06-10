import { defineStore } from 'pinia';
import { API_Documents } from "@/api/documents";
import type { APIResponse } from "@/types/index";
import type { JWT } from "@/types/index";
import useUserStore from "./userStore";

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}

interface File {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  folderStructure: string;
  uploadDate: Date;
  size: number;
  folderId?: string | null; // Added to associate with folders
}

interface DocumentsState {
  folders: Folder[];
  files: File[];
  currentFolder: string | null;
  isGridView: boolean;
  showCreateModal: boolean;
  showAddFileModal: boolean;
  editingFolder: { id: string; name: string } | null;
  editingFile: { id: string; name: string } | null;
  folderName: string;
  fileName: string;
  uploadedFile: File | null;
}

export const useDocumentsStore = defineStore('documents', {
  state: (): DocumentsState => ({
    folders: [],
    files: [],
    currentFolder: null,
    isGridView: true,
    showCreateModal: false,
    showAddFileModal: false,
    editingFolder: null,
    editingFile: null,
    folderName: '',
    fileName: '',
    uploadedFile: null
  }),

  getters: {
    currentFolderContents: (state) => {
      return state.folders.filter(folder => folder.parentId === state.currentFolder);
    },
    currentFolderFiles: (state) => {
      return state.files.filter(file => file.folderId === state.currentFolder);
    },
    breadcrumbs: (state) => {
      const path: Folder[] = [];
      let currentId = state.currentFolder;

      while (currentId) {
        const folder = state.folders.find(f => f.id === currentId);
        if (folder) {
          path.unshift(folder);
          currentId = folder.parentId;
        } else {
          break;
        }
      }

      return path;
    }
  },

  actions: {
    async fetchFiles() {
      try {
        const userStore = useUserStore();
        const { url, method } = API_Documents.Get.documents;
        const response = await useFetchWithTokenID(`${url}/${(userStore.userDetails as JWT).user_id}`, method) as APIResponse;

        if (response && response.data) {
          const filesData = response.data;

          // Clear existing data
          this.folders = [];
          this.files = [];

          // Process files and create folder structure
          for (const fileData of filesData) {
            // Create folder structure based on folderStructure
            const folderId = this.createFolderStructure(fileData.folderStructure);

            // Create file with associated folder
            const newFile: File = {
              id: fileData.id,
              title: fileData.title,
              fileUrl: fileData.fileUrl,
              fileType: fileData.fileType,
              folderStructure: fileData.folderStructure,
              uploadDate: new Date(fileData.uploadDate),
              size: Number(fileData.size),
              folderId: folderId,
            };

            this.files.push(newFile);
          }
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },

    createFolder(name: string) {
      const newFolder: Folder = {
        id: crypto.randomUUID(),
        name,
        parentId: this.currentFolder,
        createdAt: new Date(),
      };

      this.folders.push(newFolder);
    },

    deleteFolder(id: string) {
      const index = this.folders.findIndex(f => f.id === id);
      if (index !== -1) {
        this.folders.splice(index, 1);
        // Also delete all subfolders
        const subfolders = this.folders.filter(f => f.parentId === id);
        subfolders.forEach(folder => this.deleteFolder(folder.id));
      }
    },

    async updateFolder(id: string, name: string) {
      const folder = this.folders.find(f => f.id === id);
      if (folder) {
        const oldName = folder.name;
        
        // Update folderStructure for all files in this folder and its subfolders
        const affectedFiles = this.files.filter(file => {
          // Check if file is in this folder
          if (file.folderId === id) return true;
          
          // Check if file is in a subfolder of this folder
          const isInSubfolder = this.isFileInSubfolder(file.folderId, id);
          return isInSubfolder;
        });
        
        // Collect update promises instead of awaiting each one
        const updatePromises = [];
        
        // Update the folderStructure path for each affected file
        for (const file of affectedFiles) {
          // Replace the old folder name with the new one in the path
          const updatedPath = this.updatePathWithNewFolderName(file.folderStructure, oldName, name, folder);
          
          if (updatedPath !== file.folderStructure) {
            file.folderStructure = updatedPath;
            // Add the update promise to our collection instead of awaiting it
            updatePromises.push(this.updateFile(file.id, { folderStructure: updatedPath }));
          }
        }
        
        // Wait for all update operations to complete at once
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
        }
        
        folder.name = name;
      }
    },

    isFileInSubfolder(fileFolderId: string | null | undefined, ancestorFolderId: string): boolean {
      if (!fileFolderId) return false;
      
      let currentFolder = this.folders.find(f => f.id === fileFolderId);
      while (currentFolder) {
        if (currentFolder.parentId === ancestorFolderId) {
          return true;
        }
        // Move up to parent folder
        currentFolder = this.folders.find(f => f.id === currentFolder?.parentId);
      }
      return false;
    },

    updatePathWithNewFolderName(
      path: string, 
      oldName: string, 
      newName: string, 
      folder: Folder
    ): string {
      // Get the full path to the folder
      const folderPath = this.getFolderPath(folder);
      const oldPath = folderPath.join('/');
      
      // Create the new path by replacing the folder name
      const newFolderPath = [...folderPath];
      const folderIndex = newFolderPath.findIndex(name => name === oldName);
      if (folderIndex !== -1) {
        newFolderPath[folderIndex] = newName;
      }
      const newPath = newFolderPath.join('/');
      
      // Replace the old path segment with the new one
      return path.replace(oldPath, newPath);
    },

    getFolderPath(folder: Folder): string[] {
      const path: string[] = [folder.name];
      let parentId = folder.parentId;
      
      while (parentId) {
        const parentFolder = this.folders.find(f => f.id === parentId);
        if (parentFolder) {
          path.unshift(parentFolder.name);
          parentId = parentFolder.parentId;
        } else {
          break;
        }
      }
      
      return path;
    },

    createFile(fileData: any) {
      const newFile: File = {
        id: fileData.id || crypto.randomUUID(),
        title: fileData.title,
        fileUrl: fileData.fileUrl,
        fileType: fileData.fileType,
        folderStructure: fileData.folderStructure,
        uploadDate: new Date(fileData.uploadDate),
        size: Number(fileData.size),
        folderId: this.currentFolder,
      };

      this.files.push(newFile);
    },

    async updateFile(fileId: string, payload: Partial<File>) {
      try {
        const { url, method } = API_Documents.Put.documents;
        const response = await useFetchWithTokenID(`${url}/${fileId}`, method, payload) as APIResponse;
        return response;
      } catch (error) {
        console.error('Error updating file:', error);
        throw error;
      }
    },

    async deleteFile(id: string) {
      try {
        const index = this.files.findIndex(f => f.id === id);
        // Call API to delete file
        if (index !== -1) {
          const { url, method } = API_Documents.Delete.documents;
          const response = await useFetchWithTokenID(`${url}/${id}`, method) as APIResponse;

          // Remove file from local state if deletion was successful
          this.files.splice(index, 1);
          return response;
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
      }
    },

    navigateToFolder(id: string | null) {
      this.currentFolder = id;
    },

    navigateUp() {
      const parent = this.breadcrumbs[this.breadcrumbs.length - 2];
      this.navigateToFolder(parent?.id || null);
    },

    editFolder(folder: { id: string; name: string }) {
      this.editingFolder = folder;
      this.folderName = folder.name;
      this.showCreateModal = true;
    },

    saveFolder() {
      if (this.folderName.trim()) {
        if (this.editingFolder) {
          this.updateFolder(this.editingFolder.id, this.folderName);
        } else {
          this.createFolder(this.folderName);
        }
        this.cancelModal();
      }
    },

    editFile(fileId: string) {
      const file = this.files.find(f => f.id === fileId);
      if (file) {
        this.editingFile = { id: file.id, name: file.title };
        this.fileName = file.title;
        this.showAddFileModal = true;
      }
    },

    async saveFile() {
      // If we're editing an existing file
      if (this.editingFile && this.fileName.trim()) {
        try {
          const fileId = this.editingFile.id;
          const file = this.files.find(f => f.id === fileId);
          
          if (file) {
            // Update file title
            const payload = { title: this.fileName };
            await this.updateFile(fileId, payload);
            
            // Update local state
            file.title = this.fileName;
          }
          this.cancelFileModal();
        } catch (error) {
          console.error('Error updating file:', error);
        }
      } 
      // If we're adding a new file
      else if (this.fileName.trim() && this.uploadedFile) {
        try {
          const filePath = this.breadcrumbs.map(folder => folder.name).join('/');
          // Prepare document payload
          const documentPayload = {
            title: this.fileName,
            fileUrl: '', // Will be populated by the server
            fileType: this.uploadedFile instanceof File ? this.uploadedFile.type : '',
            folderStructure: filePath || '/',
            size: this.uploadedFile.size,
          };

          // Create form data for file upload
          const formData = new FormData();
          formData.append('file', this.uploadedFile as unknown as Blob);
          formData.append('file_type', "organiser");

          // Call API to upload file
          const { url, method } = API_Documents.Post.createFile;
          const response = await useFetchWithTokenID(url, method, formData) as APIResponse;

          if (response.success) {
            const { url: fileUrl, method: fileMethod } = API_Documents.Post.documents;
            documentPayload.fileUrl = response.data;
            const { data } = await useFetchWithTokenID(fileUrl, fileMethod, documentPayload) as APIResponse;
            // Create local file record
            this.createFile(data);
          }
          this.cancelFileModal();
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    },

    createFolderStructure(path: string): string | null {
      if (!path || path === '/') return null;

      const folderNames = path.split('/');
      let parentId: string | null = null;

      for (const folderName of folderNames) {
        if (!folderName.trim()) continue;

        // Check if folder already exists
        let folder = this.folders.find(f => f.name === folderName && f.parentId === parentId);

        if (!folder) {
          // Create new folder
          folder = {
            id: crypto.randomUUID(),
            name: folderName,
            parentId,
            createdAt: new Date()
          };
          this.folders.push(folder);
        }

        parentId = folder.id;
      }

      return parentId;
    },

    cancelModal() {
      this.showCreateModal = false;
      this.editingFolder = null;
      this.folderName = '';
    },

    cancelFileModal() {
      this.showAddFileModal = false;
      this.fileName = '';
      this.uploadedFile = null;
      this.editingFile = null;
    },

    toggleViewMode() {
      this.isGridView = !this.isGridView;
    },

    handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.uploadedFile = input.files[0] as unknown as File;
      }
    },

    formatDate(date: Date): string {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(date).toLocaleString('en-GB', options);
    },

    getFolderSize(folderId: string): number {
      const folderFiles = this.files.filter(file => file.folderId === folderId);
      return folderFiles.reduce((total, file) => total + file.size, 0) / 1024; // size in KB
    },

    getFileSize(fileId: string): number {
      const file = this.files.find(file => file.id === fileId);
      return file ? file.size / 1024 : 0; // size in KB
    }
  }
});