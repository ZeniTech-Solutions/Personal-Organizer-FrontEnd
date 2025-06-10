<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="fixed inset-0 flex z-40 md:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0" leave-to="-translate-x-full">
          <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-dark">
            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
              enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button type="button"
                  class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  @click="sidebarOpen = false">
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <div class="flex-shrink-0 flex items-center px-4">
              Cordially
            </div>
            <div class="mt-5 flex-1 h-0 overflow-y-auto">
              <nav class="px-2 space-y-1">
                <NuxtLink v-for="item in navigation" :key="item.name" :to="item.href"
                  :class="[item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']">
                  {{ item.name }}
                </NuxtLink>
              </nav>
            </div>
          </div>
        </TransitionChild>
        <div class="flex-shrink-0 w-14" aria-hidden="true">
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div :class="['hidden md:flex md:flex-col md:fixed md:inset-y-0', isCollapsed ? 'md:w-32' : 'md:w-64 xl:w-80']" 
         class="transition-all duration-300 ease-in-out">
      <div class="flex flex-col flex-grow pt-5 bg-primary-dark overflow-y-auto relative">
        <!-- Collapse toggle button -->
        <div :class="[isCollapsed && 'px-4', 'flex justify-center items-center']">
          <NuxtLink to="/dashboard" :class="['text-white mt-3 font-medium flex items-center flex-shrink-0 px-1', isCollapsed ? 'text-xl justify-center' : 'text-3xl']">
            <span v-if="!isCollapsed">Personal Organizer</span>
            <span v-else>PO</span>
          </NuxtLink>
  
        </div>
        <div class="mt-5 flex-1 flex flex-col justify-between">
          <nav class="flex-1 px-2 pb-4 mt-7 space-y-3">
            <template v-for="item in navigation" :key="item.name">
              <div @click="switchNavigation(item.href || '', 'topNavigation')">
                <NuxtLink :to="item.href"
                  :class="[item.current ? 'bg-white' : 'text-indigo-100 hover:text-black hover:bg-white', 
                          'group flex items-center py-3 font-medium rounded-md transition-all duration-300',
                          isCollapsed ? 'flex-col px-1 space-y-1' : 'px-2']">
                  <div v-if="item.icon">
                    <component v-if="item.iconType === 'heroicons'" :is="item.icon" 
                      :class="['flex-shrink-0 text-indigo-300', isCollapsed ? 'h-8 w-8' : 'h-6 w-6 mr-3']" 
                      aria-hidden="true" />
                    <FontAwesomeIcon v-else :icon="item.icon" 
                      :class="['flex-shrink-0 text-indigo-300', isCollapsed ? 'h-8 w-8' : 'h-6 w-6 mr-3']" />
                  </div>
                  <span v-if="!isCollapsed">{{ item.name }}</span>
                  <span v-else class="text-xs text-center">{{ item.name }}</span>
                </NuxtLink>
              </div>
            </template>
          </nav>
        </div>
      </div>
    </div>

    <!-- TopBar -->
    <div :class="['flex flex-col flex-1', isCollapsed ? 'md:pl-32' : 'md:pl-64 xl:pl-80']" class="transition-all duration-300 ease-in-out">
      <div class="sticky top-0 z-10 flex-shrink-0 flex h-[7vh] bg-gray-50 shadow-md">
        <button type="button"
          class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex justify-center items-center w-full max-w-md">  
            <button 
            @click="toggleSidebar" 
            class="p-1 rounded-full mr-3 focus:outline-none"
          >
            <Bars3Icon :class="['h-8 w-8 transition-transform duration-300']" />
          </button>
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input type="search" class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search..." v-model="searchQuery" @input="handleSearch">
            </div>
          </div>
          <div class="ml-4 flex items-center space-x-3 md:ml-6">
            <!-- Theme toggle slider -->
            <div class="relative inline-flex items-center">
              <button @click="toggleTheme" class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'">
                <span class="sr-only">Toggle theme</span>
                <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="isDarkMode ? 'translate-x-6' : 'translate-x-0'"></span>
                <SunIcon class="absolute left-0.5 top-0.5 h-4 w-4 text-yellow-500" :class="isDarkMode ? 'opacity-0' : 'opacity-100'" />
                <MoonIcon class="absolute right-0.5 top-0.5 h-4 w-4 text-indigo-200" :class="isDarkMode ? 'opacity-100' : 'opacity-0'" />
              </button>
            </div>

            <ArrowsPointingOutIcon @click="toggleFullScreen" class="w-6 h-6 cursor-pointer hover:text-indigo-600 transition-colors" />

            <BellIcon class="w-6- h-6" />
            
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="max-w-xs bg-white flex px-4 py-1.5 items-center text-sm rounded-full hover:bg-gray-100 focus:outline-none">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="" />
                  <span class="pl-3 text-base">User Name</span>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <button @click="() => handleLogout(item.href)"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 w-full text-start py-2 text-sm text-gray-700']">{{ item.name }}</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Cog6ToothIcon,
  CalendarDaysIcon,
  RectangleStackIcon,
  FolderIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  XMarkIcon,
  BellIcon,
  Bars3Icon,
  MoonIcon,
  SunIcon,
  KeyIcon,
  ArrowsPointingOutIcon
} from '@heroicons/vue/24/outline'
import { faContactBook } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Dialog, DialogOverlay, Menu, MenuButton, MenuItems, MenuItem, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { faBullseye, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import useUserStore from '~/stores/userStore';
import type { JWT } from '~/types';

const sidebarOpen = ref(false)
const isCollapsed = ref(false)
const isDarkMode = ref(false)
const searchQuery = ref('')
const userStore = useUserStore();
const { userAuthToken, userDetails } = storeToRefs(userStore)
const emit = defineEmits(['sidebarCollapsed']);
const route = useRoute();

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  // You can add logic here to apply dark mode styles to the application
  // For example, adding/removing a class to the document body
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
}

function handleSearch() {
  // Implement search functionality here
  console.log('Searching for:', searchQuery.value);
  // You can add logic to filter content based on the search query
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  } else {
    // Exit fullscreen mode
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

interface Navigation {
  name: string;
  current: boolean;
  icon: any;
  iconType?: string;
  href: string
}

// Define navigation items
const navigation = ref<Navigation[]>([
  { name: 'Dashboard', current: false, icon: HomeIcon, iconType: 'heroicons', href: `/dashboard` },
  { name: 'Calendar', current: false, icon: CalendarDaysIcon, iconType: 'heroicons', href: `/calendar` },
  { name: 'Tasklist', current: false, icon: RectangleStackIcon, iconType: 'heroicons', href: `/task` },
  { name: 'Journal', current: false, icon: faBookOpen, iconType: 'fontawesome', href: `/journal` },
  { name: 'Notes', current: false, icon: PencilSquareIcon, iconType: 'heroicons', href: `/notes` },
  { name: 'Documents Drive', current: false, icon: FolderIcon, iconType: 'heroicons', href: `/documents` },
  { name: 'Milestones', current: false, icon: faBullseye, iconType: 'fontawesome', href: `/milestones` },
  { name: 'Contacts', current: false, icon: faContactBook, iconType: 'fontawesome', href: `/contacts` },
  { name: 'Chat', current: false, icon: ChatBubbleLeftRightIcon, iconType: 'heroicons', href: `/chat` },
  { name: 'Password Manager', current: false, icon: KeyIcon, iconType: 'heroicons', href: `/password-manager` },
]);

const userNavigation = [
  { name: 'Sign out', href: '/login' },
]

function handleLogout(path: string) {
  // Use secure cookie clearing instead of localStorage
  clearAuthCookies();
  navigateTo(path);
}

function switchNavigation(targetName: string, targetListName: string) {
  function resetCurrent(items: any) {
    if (!items) return;
    
    for (const item of items) {
      item.current = false;
    }
  }

  function findAndToggle(items: any) {
    for (const item of items) {
      if (item.href === targetName) {
        // Reset all refs before setting new current
        resetCurrent(navigation.value);
        
        item.current = true;
        return true;
      }
    }
    return false;
  }
}

// Function to set current navigation based on route path
function setCurrentNavigationByRoute() {
  const currentPath = route.path;

  function resetCurrent(items: any) {
    if (!items) return;
    
    for (const item of items) {
      item.current = false;
    }
  }
  
  // Reset all navigation items first - do this once before checking routes
  resetCurrent(navigation.value);
  
  // Helper function to update navigation items
  function findAndToggle(items: any) {
    for (const item of items) {
      if (item.href === currentPath) {
        // Reset all refs before setting new current
        resetCurrent(navigation.value);
        
        item.current = true;
        return true;
      }
    }
    return false;
  }
  
  // Update both navigation lists
  findAndToggle(navigation.value);
}

onMounted(async () => {
  await userStore.fetchTokenFromCookie();
  // Set current navigation based on route after token is fetched
  setCurrentNavigationByRoute();
})

watch(isCollapsed, () => {
  emit('sidebarCollapsed', isCollapsed.value);
}, { immediate: true })

// Watch for route changes to update navigation
watch(() => route.path, () => {
  console.log('Route changed:', route.path);
  setCurrentNavigationByRoute();
}, { deep: true, immediate: true })
</script>