import { defineStore } from 'pinia';
import { API_Chat } from '~/api/chat';
import { API_Users } from '~/api/users';
import { useFetchWithTokenID } from '~/composables/useCustomFetch';
import type { APIResponse, JWT } from '~/types';
import useUserStore from './userStore';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
}

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  isBlocked: boolean;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([]);
  const users = ref<ChatUser[]>([]);
  const selectedUser = ref<ChatUser | null>(null);
  const userStore = useUserStore();
  const { userDetails } = storeToRefs(userStore);

  // Fetch chat messages
  async function fetchMessages() {
    try {
      const { url, method } = API_Chat.Get.messages;
      const response = await useFetchWithTokenID(
        `${url}/${selectedUser.value?.id || users.value[0].id}`,
        method
      ) as APIResponse;
      
      if (response && response.success && response.data) {
        messages.value = response.data.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      messages.value = [];
    }
  }

  // Fetch online users
  async function fetchUsers() {
    if (users.value.length) return;
    try {
      const { url, method } = API_Users.Get.users;
      const { data } = await useFetchWithTokenID(
        url,
        method
      ) as APIResponse;
      
      users.value = data
      selectedUser.value = users.value[0]
    } catch (error) {
      console.error('Error fetching users:', error);
      users.value = [];
    }
  }

  // Send a new message
  async function sendMessage(content: string) {
    if (!selectedUser.value) return false;

    try {
      const newMessage = {
        receiverId: selectedUser.value.id,
        content
      };

      const response = await useFetchWithTokenID(
        API_Chat.Post.message.url,
        API_Chat.Post.message.method,
        newMessage
      ) as APIResponse;

      if (response && response.success) {
        await fetchMessages();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  // Select a user to chat with
  async function selectUser(user: ChatUser) {
    selectedUser.value = user;
    await fetchMessages()
  }

  // Block a user
  async function blockUser(userId: string) {
    try {
      const { url, method } = API_Users.Put.users;
      const { success } = await useFetchWithTokenID(`${url}/${(userDetails.value as JWT).id}`, method, { blockedUsers: [...(userDetails.value as JWT).blockedUsers, userId]}) as APIResponse;
      if (success) {
        const userIndex = users.value.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          users.value[userIndex].isBlocked = true;
          // If the blocked user is the selected user, update the UI
          if (selectedUser.value?.id === userId) {
            selectedUser.value.isBlocked = true;
          }
        }
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  }

  // Unblock a user
  async function unblockUser(userId: string) {
    try {
      const { url, method } = API_Users.Put.users;
      const { success } = await useFetchWithTokenID(`${url}/${(userDetails.value as JWT).id}`, method, { blockedUsers: (userDetails.value as JWT).blockedUsers.filter(id => id !== userId)}) as APIResponse;
      if (success) {
        const userIndex = users.value.findIndex(user => user.id === userId);
        if (userIndex!== -1) {
          users.value[userIndex].isBlocked = false;
          // If the blocked user is the selected user, update the UI
          if (selectedUser.value?.id === userId) {
            selectedUser.value.isBlocked = false; 
          }  
        } 
      } 
    } catch (error) {
      console.error('Error unblocking user:', error);
    } 
  }

  // Delete chat history with a user
  async function deleteChat(userId: string) {
    try {
      const { url, method } = API_Chat.Delete.message
      const { success } = await useFetchWithTokenID(`${url}/${selectedUser.value?.id}`, method) as APIResponse;
      if (success) {
        if (selectedUser.value?.id === userId) {
          messages.value = [];
        }
      }
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  }

  return {
    messages,
    users,
    selectedUser,
    fetchMessages,
    fetchUsers,
    sendMessage,
    selectUser,
    blockUser,
    deleteChat,
    unblockUser
  };
});