<template>
  <div class="flex h-[93vh] bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Users sidebar -->
    <div class="w-80 border-r border-gray-200 bg-white">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Chats</h2>
        <div class="mt-4 relative">
          <input type="text" placeholder="Search..."
            class="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span class="absolute right-3 top-2.5 text-gray-400">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
      <div class="overflow-y-auto h-[calc(100vh-200px)]" ref="scrollContainer" @scroll="handleScroll">
        <div :style="{ height: totalHeight + 'px', position: 'relative' }">
          <div v-for="user in visibleUsers" :key="user.id" @click="selectUser(user)"
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 absolute w-full font-normal"
            :style="{ transform: `translateY(${user.index * itemHeight}px)` }"
            :class="{ 'bg-gray-50': selectedUser?.id === user.id }">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-medium">
                  {{ getInitials(user.firstName + user.lastName) }}
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ user.firstName + user.lastName }}</h3>
                <p class="text-sm text-gray-500">
                  <!-- Display Last message -->
                  <!-- {{ user.status === 'online' ? 'Online' : 'Offline' }} -->
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat area -->
    <div class="flex-1 flex flex-col">
      <!-- Chat header -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div class="flex items-center space-x-3" v-if="selectedUser">
          <div
            class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-semibold">
            {{ getInitials(selectedUser.firstName + selectedUser.lastName) }}
          </div>
          <div>
            <h2 class="font-medium text-gray-900">{{ selectedUser.firstName + selectedUser.lastName }}</h2>
          </div>
        </div>
        <div class="flex items-center space-x-4 text-gray-400">
          <div class="relative chat-menu-container">
            <button @click="toggleChatMenu" class="text-gray-600">
              <EllipsisVerticalIcon class="w-5 h-5" />
            </button>
            <!-- Dropdown menu -->
            <div v-if="showChatMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
              <button @click="confirmAction(selectedUser?.isBlocked ? 'unblock' : 'block')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {{ selectedUser?.isBlocked ? 'Unblock' : 'Block'}}
              </button>
              <button @click="confirmAction('delete')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Delete Chat
              </button>
            </div>
          </div>
          <button class="hover:text-gray-600">
            <i class="fas fa-video"></i>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <template v-if="isLoadingMessages">
          <div class="h-full flex flex-col items-center justify-center text-center p-6">
            <GenericLoader spinner-size="w-8 h-8" msg="Loading messages..." p-class="text-gray-600 mt-2" />
          </div>
        </template>
        <template v-else-if="groupedMessages.length > 0">
          <div v-for="group in groupedMessages" :key="group.date" class="space-y-4">
            <!-- Date header -->
            <div class="flex justify-center">
              <div class="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                {{ group.date }}
              </div>
            </div>
            
            <!-- Messages in this date group -->
            <div v-for="message in group.messages" :key="message.id" class="flex"
              :class="message.senderId === currentUserId ? 'justify-end' : 'justify-start'">
              <div class="max-w-[70%] rounded-lg p-3"
                :class="message.senderId === currentUserId ? 'bg-blue-500 text-white' : 'bg-white'">
                <p>{{ message.content }}</p>
                <span class="text-xs mt-1 block"
                  :class="message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-400'">
                  {{ formatTime(message.timestamp) }}
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="selectedUser?.isBlocked">
          <div class="h-full flex flex-col items-center justify-center text-center p-6">
            <div class="w-16 h-16 mb-4 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">User Blocked</h3>
            <p class="text-gray-500 mb-6">You have blocked this user. Unblock to resume conversation.</p>
          </div>
        </template>
        <template v-else>
          <div class="h-full flex flex-col items-center justify-center text-center p-6">
            <div class="w-16 h-16 mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">No messages yet</h3>
            <p class="text-gray-500 mb-6">Start a conversation by sending a message below</p>
          </div>
        </template>
      </div>

      <!-- Message input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <div class="flex items-center space-x-2">
          <button @click="fetchMessagesWithLoading" :disabled="selectedUser?.isBlocked || isLoadingMessages" 
            class="text-gray-600 disabled:cursor-not-allowed hover:text-gray-800"
            :class="{'animate-spin': isLoadingMessages}">
            <ArrowPathIcon class="w-5 h-5" />
          </button>
          <input :disabled="selectedUser?.isBlocked" v-model="newMessage" type="text" placeholder="Type a message..."
            class="flex-1 px-4 py-2 bg-gray-200/80 rounded-lg disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none"
            @keyup.enter="sendMessage" />
          <button @click="sendMessage"
            :disabled="selectedUser?.isBlocked"
            class="px-4 py-2 bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
            <PaperAirplaneIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ confirmActionType === 'block' ? 'Block User' : confirmActionType === 'unblock' ? 'Unblock User' : 'Delete Chat' }}
      </h2>
      <p class="text-gray-700 mb-6">
        Are you sure you want to {{ confirmActionType === 'block' ? 'block' : confirmActionType === 'unblock' ? 'unblock' : 'delete chat history with' }}
        <span class="font-semibold">{{ selectedUser ? selectedUser?.firstName + selectedUser?.lastName : '' }}</span>?
        {{ confirmActionType === 'delete' ? 'This action cannot be undone.' : '' }}
      </p>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="showConfirmModal = false"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="executeConfirmedAction"
          class="px-4 py-2 text-white rounded-md text-sm font-medium"
          :class="confirmActionType === 'block' || confirmActionType === 'unblock' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'"
        >
          {{ confirmActionType === 'block' ? 'Block' : confirmActionType === 'unblock' ? 'Unblock' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chatStore';
import { storeToRefs } from 'pinia';
import { EllipsisVerticalIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import useUserStore from '~/stores/userStore';
import type { JWT } from '~/types';

const chatStore = useChatStore();
const userStore = useUserStore();
const { messages, users, selectedUser } = storeToRefs(chatStore);
const { userDetails } = storeToRefs(userStore);
const { fetchMessages, fetchUsers, sendMessage: sendChatMessage, blockUser, deleteChat, unblockUser } = chatStore;

// Mock current user ID (replace with actual user ID from auth)
const currentUserId = computed(() => (userDetails.value as JWT).id);
const newMessage = ref('');
const showChatMenu = ref(false);
const isLoadingMessages = ref(false);

// Virtual scrolling setup
const scrollContainer = ref<HTMLElement | null>(null);
const itemHeight = 72; // Height of each user item in pixels
const bufferSize = 5; // Number of items to render above/below visible area

// Calculate total height based on number of items
const totalHeight = computed(() => (users.value?.length || 0) * itemHeight);

// Calculate visible range
const visibleRange = ref({ start: 0, end: 0 });

// Get visible users based on scroll position
const visibleUsers = computed(() => {
  if (!users.value) return [];
  
  const start = Math.max(0, visibleRange.value.start - bufferSize);
  const end = Math.min(users.value.length, visibleRange.value.end + bufferSize);
  
  return users.value
    .slice(start, end)
    .map((user, index) => ({ ...user, index: start + index }));
});

// Handle scroll events
const handleScroll = () => {
  if (!scrollContainer.value) return;
  
  const scrollTop = scrollContainer.value.scrollTop;
  const containerHeight = scrollContainer.value.clientHeight;
  
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.ceil((scrollTop + containerHeight) / itemHeight);
  
  visibleRange.value = { start, end };
};

// Toggle chat menu
const toggleChatMenu = () => {
  showChatMenu.value = !showChatMenu.value;
};

// Fetch initial data and setup event listeners
onMounted(async () => {
  // Fetch initial data
  await fetchUsers();
  await fetchMessagesWithLoading();
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.chat-menu-container')) {
      showChatMenu.value = false;
    }
  });
});

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', () => {});
});

// State for confirmation modal
const showConfirmModal = ref(false);
const confirmActionType = ref<'block' | 'unblock' | 'delete'>('block');

// Confirm action before executing
const confirmAction = (actionType: 'block' | 'unblock' | 'delete') => {
  if (!selectedUser.value) return;
  confirmActionType.value = actionType;
  showConfirmModal.value = true;
  showChatMenu.value = false;
};

// Execute the confirmed action
const executeConfirmedAction = () => {
  if (confirmActionType.value === 'block') {
    blockUser(selectedUser.value!.id);
  } else if (confirmActionType.value === 'unblock') {
    unblockUser(selectedUser.value!.id);
  } else {
    deleteChat(selectedUser.value!.id);
  }
  showConfirmModal.value = false;
};

// Format time for messages
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  isLoadingMessages.value = true;
  try {
    const success = await sendChatMessage(newMessage.value);
    if (success) {
      newMessage.value = '';
      // Don't call fetchMessagesWithLoading here as it would set isLoadingMessages to true again
      await fetchMessages();
    }
  } finally {
    isLoadingMessages.value = false;
  }
};

// Modify fetchMessages to handle loading state
const fetchMessagesWithLoading = async () => {
  if (isLoadingMessages.value) return; // Prevent multiple simultaneous requests
  
  isLoadingMessages.value = true;
  try {
    await fetchMessages();
  } finally {
    isLoadingMessages.value = false;
  }
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Group messages by date
const groupedMessages = computed(() => {
  if (!messages.value || messages.value.length === 0) return [];
  
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let currentDate = '';
  let currentGroup: ChatMessage[] = [];
  
  // Sort messages by timestamp
  const sortedMessages = [...messages.value].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  sortedMessages.forEach(message => {
    const messageDate = formatMessageDate(message.timestamp);
    
    if (messageDate !== currentDate) {
      if (currentGroup.length > 0) {
        groups.push({
          date: currentDate,
          messages: [...currentGroup]
        });
      }
      currentDate = messageDate;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });
  
  // Add the last group
  if (currentGroup.length > 0) {
    groups.push({
      date: currentDate,
      messages: currentGroup
    });
  }
  
  return groups;
});

// Format date for message groups
const formatMessageDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date);
  
  // Reset time part for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);
  
  if (messageDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
};
// Select a user to chat with
// Override selectUser to include loading state
const selectUser = async (user: ChatUser) => {
  chatStore.selectUser(user);
  await fetchMessagesWithLoading();
};
</script>