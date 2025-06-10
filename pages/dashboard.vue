<template>
  <div class="min-h-[93vh] bg-gray-50 p-8">
    <!-- Main content -->
    <div class="">
      <!-- Header section -->
      <div class="mb-5">
        <h1 class="text-4xl pb-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
          Welcome {{ (userDetails as JWT).name }}!</h1>
      </div>

      <!-- Top Cards -->
      <div class="mb-6">
        <div class="grid grid-cols-4 gap-4">
          <div 
            v-for="(card, index) in statCards" 
            :key="index"
            class="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between"
          >
            <div>
              <h2 class="text-3xl font-bold text-gray-800">{{ card.value }}</h2>
              <p class="text-sm text-gray-500">{{ card.label }}</p>
            </div>
            <div :class="`bg-${card.color}-100 p-3 rounded-lg`">
              <component :is="card.icon" class="h-8 w-8" :class="`text-${card.color}-600`" />
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard card -->
      <div class="gap-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- Achievement Target Section -->
          <div class="bg-white rounded-lg rounded-tl-[2.2rem] border border-gray-200 shadow-lg overflow-hidden mb-4">
            <div class="px-6 py-4">
              <div class="flex items-center mb-4">
                <div class="mr-2">
                  <CheckBadgeIcon class="text-indigo-600 mr-2 h-6 w-6" />
                </div>
                <h3 class="text-sm font-medium text-indigo-600">ACHIEVEMENT TARGET</h3>
              </div>
              
              <!-- Progress bars -->
              <div class="space-y-4">
                <!-- Task progress -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Finish 100 task</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-pink-500 rounded-full" style="width: 20%"></div>
                  </div>
                </div>
                
                <!-- Attending progress -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Get 10 attending</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" style="width: 80%"></div>
                  </div>
                </div>
                
                <!-- Complaint progress -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Get less than 10 complaint</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500 rounded-full" style="width: 70%"></div>
                  </div>
                </div>
                
                <!-- Videos/Articles progress -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Upload 5 videos or articles</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 rounded-full" style="width: 60%"></div>
                  </div>
                </div>
                
                <!-- Profile completion -->
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Completing profile</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-cyan-500 rounded-full" style="width: 85%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <!-- Storage Section -->
            <div
              class="bg-white rounded-lg rounded-tr-[2.2rem] px-6 py-4 border border-gray-200 shadow-lg overflow-hidden mb-4">
              <div class="flex items-center mb-4">
                <div class="flex items-center">
                  <CheckBadgeIcon class="text-indigo-600 mr-2 h-6 w-6" />
                  <h3 class="font-medium">Your Storage</h3>
                </div>
              </div>

              <!-- Storage visualization -->
              <div class="flex flex-col items-center justify-center py-6">
                <div class="relative w-40 h-40 mb-4">
                  <!-- Background circle -->
                  <div class="absolute inset-0 rounded-full bg-gray-100"></div>
                  
                  <!-- Progress circle -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="transparent"
                        stroke="#4f46e5" 
                        stroke-width="10"
                        stroke-dasharray="282.7" 
                        stroke-dashoffset="113.1" 
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  
                  <!-- Center content -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Almost Full
                    </div>
                  </div>
                </div>
                
                <!-- Storage details -->
                <div class="flex justify-between w-full mb-1">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-indigo-600">120 GB</div>
                    <div class="text-xs text-gray-500">60% used</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-700">200 GB</div>
                    <div class="text-xs text-gray-500">total storage</div>
                  </div>
                </div>
                
                <!-- Upgrade button -->
                <div class="mt-6 w-full">
                  <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                    UPGRADE SPACE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle grid section -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <!-- Task Section -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-lg p-6">
            <div class="mb-4 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-medium text-indigo-600 mb-2">My Task</h3>
                <h4 class="font-medium mb-2">All Your to do list. Just check it whenever You done.</h4>
              </div>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/task`" class="text-indigo-600 text-sm hover:text-indigo-800">
                View all
              </NuxtLink>
            </div>
            <div v-if="tasksLoading" class="flex justify-center items-center h-40">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <div v-else-if="tasks.length === 0" class="rounded-lg p-4 flex flex-col items-center justify-center h-40">
              <div class="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-gray-500 text-center">No tasks created yet</p>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/task`" class="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Create your first task
              </NuxtLink>
            </div>
            <div v-else class="bg-indigo-600 rounded-lg overflow-hidden">
              <div class="bg-white p-4">
                <div class="space-y-2">
                  <div v-for="(task, index) in tasks.slice(0, 7)" :key="task.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`task-${task.id}`" 
                        :checked="task.status === 'Completed'" 
                        class="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        @change="updateTaskStatus(task)"
                      >
                      <label :for="`task-${task.id}`" class="ml-3 block text-sm" :class="[task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700']">
                        <div>{{ task.title }}</div>
                        <div class="text-xs text-gray-500">{{ task.description }}</div>
                      </label>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contacts Section -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-lg p-6">
            <div class="mb-4 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-medium text-indigo-600 mb-2">Contacts</h3>
                <h4 class="font-medium mb-2">Your important contacts</h4>
              </div>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/contacts`" class="text-indigo-600 text-sm hover:text-indigo-800">
                View all
              </NuxtLink>
            </div>
            <div class="bg-white rounded-lg overflow-hidden border border-gray-100">
              
              <!-- Contact List -->
              <div v-if="contactsLoading" class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
              <div v-else-if="contacts.length === 0" class="rounded-lg p-4 flex flex-col items-center justify-center py-8">
                <div class="text-gray-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p class="text-gray-500 text-center">No contacts found</p>
                <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/contacts`" class="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Add your first contact
                </NuxtLink>
              </div>
              <div v-else class="divide-y divide-gray-100">
                <div v-for="contact in contacts.slice(0, 5)" :key="contact.id" class="flex items-center justify-between p-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden mr-3 flex items-center justify-center text-indigo-600 font-medium">
                      {{ contact.name.substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <h4 class="font-medium text-sm">{{ contact.name }}</h4>
                      <p class="text-xs text-gray-500">{{ contact.tags.length > 0 ? contact.tags[0] : 'Contact' }}</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-500 hover:text-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button class="text-pink-500 hover:text-pink-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button class="text-green-500 hover:text-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom grid section -->
        <div class="grid grid-cols-3 gap-4">
          <!-- Journal section -->
          <div class="border bg-white border-gray-200 rounded-lg rounded-bl-[2.2rem] shadow-lg p-6">
            <div class="mb-4 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-medium text-indigo-600 mb-2">Journal</h3>
                <h4 class="font-medium mb-2">Track your daily adventures</h4>
              </div>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/journal`" class="text-indigo-600 text-sm hover:text-indigo-800">
                View all
              </NuxtLink>
            </div>
            <div v-if="journalsLoading" class="flex justify-center items-center h-40">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <div v-else-if="journals.length === 0" class="rounded-lg p-4 flex flex-col items-center justify-center h-40">
              <div class="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p class="text-gray-500 text-center">No journal entries yet</p>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/journal`" class="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Create your first entry
              </NuxtLink>
            </div>
            <div v-else class="space-y-3">
              <div v-for="(journal, index) in journals.slice(0, 3)" :key="index" class="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                  <span class="font-medium text-gray-800">{{ formatDate(journal.date) }}</span>
                  <h5 class="font-medium text-gray-800 truncate">{{ journal.content }}</h5>
                </div>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2 truncate">{{ journal.content }}</p>
              </div>
            </div>
          </div>

          <!-- Milestones section -->
          <div class="border bg-white border-gray-200 rounded-lg shadow-lg p-6">
            <div class="mb-4 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-medium text-indigo-600 mb-2">Milestones</h3>
                <h4 class="font-medium mb-2">Track and achieve your goals</h4>
              </div>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/milestones`" class="text-indigo-600 text-sm hover:text-indigo-800">
                View all
              </NuxtLink>
            </div>
            <div v-if="milestonesLoading" class="flex justify-center items-center h-40">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <div v-else-if="milestones.length === 0" class="rounded-lg p-4 flex flex-col items-center justify-center h-40">
              <div class="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-gray-500 text-center">No milestones created yet</p>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/milestones`" class="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Create your first milestone
              </NuxtLink>
            </div>
            <div v-else class="space-y-3">
              <div v-for="milestone in milestones.slice(0, 3)" :key="milestone.id" class="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div class="flex justify-between items-start mb-2">
                  <h5 class="font-medium text-gray-800">{{ milestone.title }}</h5>
                  <span class="text-xs px-2 py-1 rounded-full capitalize" :class="{
                    'bg-green-100 text-green-800': milestone.status === 'achieved',
                    'bg-yellow-100 text-yellow-800': milestone.status === 'pending',
                  }">{{ milestone.status }}</span>
                </div>
                <div class="truncate">{{ milestone.description }}</div>
                <p class="text-xs text-gray-500 mt-2">Target: {{ formatDate(milestone.targetDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Calendar Section -->
          <div class="border bg-white border-gray-200 rounded-lg rounded-br-[2.2rem] shadow-lg p-6">
            <div class="mb-4 flex justify-between items-center">
              <div>
                <h3 class="text-sm font-medium text-indigo-600 mb-2">Calendar</h3>
                <h4 class="font-medium mb-2">Your upcoming events</h4>
              </div>
              <NuxtLink :to="`/${(userDetails as JWT)?.user_id}/personal-organizer/calendar`" class="text-indigo-600 text-sm hover:text-indigo-800">
                View all
              </NuxtLink>
            </div>
            <div class="border-b border-gray-200 mb-4">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center space-x-1">
                  <button class="p-1 text-gray-500 hover:text-indigo-600" @click="prevMonth">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span class="text-sm font-medium">{{ currentMonthName }}</span>
                  <button class="p-1 text-gray-500 hover:text-indigo-600" @click="nextMonth">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-7 gap-0 p-1 border border-gray-200 rounded">
                <div v-for="day in weekDays" :key="day" class="text-xs font-semibold py-1 text-center text-gray-500 border-b border-gray-200">{{ day }}</div>
                <div v-for="(day, index) in calendarDays" :key="index" 
                  class="text-xs flex flex-col items-center justify-center cursor-pointer border border-gray-200 p-1 hover:bg-gray-50"
                  @click="">
                  <div 
                  class="w-6 h-6 rounded-full text-xs flex items-center justify-center"
                  :class="{
                    'bg-gray-100': !day.isCurrentMonth,
                    'bg-indigo-100 text-indigo-800': day.isToday,
                    'hover:bg-gray-200': !day.isToday && day.isCurrentMonth
                  }">
                    {{ day.date.getDate() }}
                  </div>
                  <div class="flex gap-1 h-1 mt-1">
                    <div v-for="event in getEventsForDay(day.date).slice(0, 2)" :key="event.id" 
                      class="w-1 h-1 rounded-full" 
                      :class="`bg-${event.color || 'indigo'}-500`">
                    </div>
                    <div v-if="getEventsForDay(day.date).length > 2" class="w-1 h-1 rounded-full bg-gray-400"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="eventsLoading" class="flex justify-center items-center h-20">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
            <div v-else-if="events.length === 0" class="text-center py-4">
              <p class="text-gray-500 text-sm">No upcoming events</p>
            </div>
            <div v-else class="space-y-2">
              <h5 class="text-sm font-medium text-gray-700">Upcoming Events</h5>
              <div v-for="event in events.slice(0, 2)" :key="event.id" class="flex items-center p-2 border border-gray-100 rounded-md">
                <div :class="`bg-${event.color || 'indigo'}-100 text-${event.color || 'indigo'}-800 w-10 h-10 rounded-full flex items-center justify-center mr-3`">
                  {{ new Date(event.start).getDate() }}
                </div>
                <div>
                  <h6 class="font-medium text-sm">{{ event.title }}</h6>
                  <p class="text-xs text-gray-500">{{ formatDate(event.start) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { API_Journal } from '~/api/journal';
import { API_Milestone } from '~/api/milestone';
import { API_Task } from '~/api/task';
import { API_Calendar } from '~/api/calendar';
import { API_Contacts } from '~/api/contacts';
import { useFetchWithTokenID } from '~/composables/useCustomFetch';
import type { APIResponse, JWT } from '~/types';
import useUserStore from '~/stores/userStore';
import { UserGroupIcon, UserIcon, PencilSquareIcon, DocumentIcon } from '@heroicons/vue/24/outline';
import { CheckBadgeIcon } from '@heroicons/vue/20/solid';
import useShowSnackbar from '~/composables/useSnackbar';
import type { Contact, JournalEntry, Milestone, Task, CalendarEvent } from '~/types/products';

// Stat cards data
const statCards = [
  { label: 'Subscribers', value: 207, color: 'indigo', icon: UserGroupIcon },
  { label: 'Followers', value: 300, color: 'blue', icon: UserIcon },
  { label: 'Total Posts', value: 67, color: 'green', icon: PencilSquareIcon },
  { label: 'Total Articles', value: 70, color: 'purple', icon: DocumentIcon }
];

// User details
const userStore = useUserStore();
const userDetails = computed(() => userStore.userDetails);
const journals = ref<JournalEntry[]>([]);
const journalsLoading = ref(true);
const milestones = ref<Milestone[]>([]);
const milestonesLoading = ref(true);
const tasks = ref<Task[]>([]);
const tasksLoading = ref(true);
const contacts = ref<Contact[]>([]);
const contactsLoading = ref(true);

// Calendar functionality
const currentDate = ref(new Date());
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const events = ref<CalendarEvent[]>([]);
const eventsLoading = ref(true);

const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM yyyy');
});

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date)
  }));
});

// Fetch journal entries
const fetchJournals = async () => {
  try {
    journalsLoading.value = true;
    const { url, method } = API_Journal.Get.entries;
    const response = await useFetchWithTokenID(url, method) as APIResponse;
    
    if (response && response.data) {
      journals.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching journals:', error);
  } finally {
    journalsLoading.value = false;
  }
};

// Fetch milestones
const fetchMilestones = async () => {
  try {
    milestonesLoading.value = true;
    const { url, method } = API_Milestone.Get.milestone;
    const response = await useFetchWithTokenID(url, method) as APIResponse;
    
    if (response && response.data) {
      milestones.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching milestones:', error);
  } finally {
    milestonesLoading.value = false;
  }
};

// Fetch tasks
const fetchTasks = async () => {
  try {
    tasksLoading.value = true;
    const { url, method } = API_Task.Get.task;
    const response = await useFetchWithTokenID(url, method) as APIResponse;
    
    if (response && response.data) {
      tasks.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    tasksLoading.value = false;
  }
};

// Fetch contacts
const fetchContacts = async () => {
  try {
    contactsLoading.value = true;
    const { url, method } = API_Contacts.Get.contacts;
    const response = await useFetchWithTokenID(url, method) as APIResponse;
    
    if (response && response.data) {
      contacts.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
  } finally {
    contactsLoading.value = false;
  }
};

// Update task status
const updateTaskStatus = async (task: Task) => {
  try {
    const updatedTask = { ...task };
    updatedTask.status = task.status !== 'Completed' ? 'todo' : 'Completed';
    
    const { url, method } = API_Task.Put.task;
    const response = await useFetchWithTokenID(url, method, {
      ...updatedTask
    }) as APIResponse;
    
    // Update the task in the local array
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    if (response && response.data) {
      useShowSnackbar().onSuccess('Task status updated successfully');
    }
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1);
  fetchEvents();
};

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
  fetchEvents();
};

const goToDate = (date: Date) => {
  // Navigate to the calendar page with the selected date
  navigateTo(`/${(userDetails.value as JWT)?.user_id}/personal-organizer/calendar?date=${format(date, 'yyyy-MM-dd')}`);
};

const getEventsForDay = (date: Date) => {
  return events.value.filter(event => {
    const eventStart = new Date(event.start);
    return isSameDay(eventStart, date);
  });
};

// Fetch calendar events
const fetchEvents = async () => {
  try {
    eventsLoading.value = true;
    const { url, method } = API_Calendar.Get.calendar;
    const response = await useFetchWithTokenID(url, method) as APIResponse;
    
    if (response && response.data) {
      events.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    eventsLoading.value = false;
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchJournals();
  fetchMilestones();
  fetchTasks();
  fetchEvents();
  fetchContacts();
});
</script>
