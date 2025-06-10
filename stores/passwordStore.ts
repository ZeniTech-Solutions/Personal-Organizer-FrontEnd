import { defineStore } from 'pinia';
import { API_PasswordManager } from '~/api/passwordManager';
import { useFetchWithTokenID } from '~/composables/useCustomFetch';
import type { APIResponse } from '~/types';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export const usePasswordStore = defineStore('password', () => {
  const passwords = ref<PasswordEntry[]>([]);
  
  // Fetch all passwords
  async function fetchPasswords() {
    try {
      const response = await useFetchWithTokenID(
        API_PasswordManager.Get.password.url,
        API_PasswordManager.Get.password.method
      ) as APIResponse;
      
      if (response && response.success && response.data) {
        // Convert string dates back to Date objects
        passwords.value = response.data.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
      } else {
        passwords.value = [];
      }
    } catch (error) {
      console.error('Error fetching passwords:', error);
      passwords.value = [];
    }
  }
  
  // Add a new password
  async function addPassword(passwordData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newPassword: PasswordEntry = {
        id: generateId(),
        ...passwordData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const {data, success} = await useFetchWithTokenID(
        API_PasswordManager.Post.password.url,
        API_PasswordManager.Post.password.method,
        JSON.stringify(newPassword)
      ) as APIResponse;
      
      if (success) {
        passwords.value.push(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding password:', error);
      return false;
    }
  }
  
  // Update an existing password
  async function updatePassword(passwordData: PasswordEntry) {
    try {
      const updatedPassword = {
        ...passwordData,
        updatedAt: new Date()
      };
      
      const response = await useFetchWithTokenID(
        `${API_PasswordManager.Put.password.url}/${passwordData.id}`,
        API_PasswordManager.Put.password.method,
        JSON.stringify(updatedPassword)
      ) as APIResponse;
      
      if (response && response.success) {
        const index = passwords.value.findIndex(p => p.id === passwordData.id);
        if (index !== -1) {
          passwords.value[index] = updatedPassword;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }
  
  // Delete a password
  async function deletePassword(id: string) {
    try {
      const response = await useFetchWithTokenID(
        `${API_PasswordManager.Delete.password.url}/${id}`,
        API_PasswordManager.Delete.password.method
      ) as APIResponse;
      
      if (response && response.success) {
        passwords.value = passwords.value.filter(p => p.id !== id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting password:', error);
      return false;
    }
  }
  
  // Helper function to generate a unique ID
  function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  return {
    passwords,
    fetchPasswords,
    addPassword,
    updatePassword,
    deletePassword
  };
});