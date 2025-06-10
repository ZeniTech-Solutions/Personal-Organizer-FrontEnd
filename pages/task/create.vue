<template>
    <div class="min-h-[93vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-1">
        <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 class="text-2xl font-bold text-gray-800">Create New Task</h1>
                <NuxtLink to="/task" class="text-blue-600 hover:text-blue-800 flex items-center">
                    <ArrowLeftIcon class="h-5 w-5 mr-1" />
                    Back to Tasks
                </NuxtLink>
            </div>

            <!-- Task Form -->
            <form @submit.prevent="saveTask" class="space-y-6">
                <!-- Title -->
                <div class="space-y-2">
                    <label for="title" class="block text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                    <input 
                        id="title" 
                        v-model="task.title" 
                        type="text" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter task title"
                    />
                </div>

                <!-- Description -->
                <div class="space-y-2">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        id="description" 
                        v-model="task.description" 
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Enter task description"
                    ></textarea>
                </div>

                <!-- Due Date -->
                <div class="space-y-2">
                    <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
                    <input 
                        id="dueDate" 
                        v-model="task.dueDate" 
                        type="datetime-local" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <!-- Priority -->
                <div class="space-y-2">
                    <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                    <div class="flex space-x-4">
                        <div 
                            v-for="option in priorityOptions" 
                            :key="option.value"
                            @click="task.priority = option.value"
                            class="flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors"
                            :class="{
                                'border-green-500 bg-green-50': option.value === 'low' && task.priority === 'low',
                                'border-yellow-500 bg-yellow-50': option.value === 'medium' && task.priority === 'medium',
                                'border-red-500 bg-red-50': option.value === 'high' && task.priority === 'high',
                                'border-gray-300': task.priority !== option.value
                            }"
                        >
                            <div 
                                class="w-4 h-4 rounded-full" 
                                :class="{
                                    'bg-green-500': option.value === 'low',
                                    'bg-yellow-500': option.value === 'medium',
                                    'bg-red-500': option.value === 'high'
                                }"
                            ></div>
                            <span>{{ option.label }}</span>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="space-y-2">
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select 
                        id="status" 
                        v-model="task.status"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <NuxtLink 
                        to="/task"
                        class="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </NuxtLink>
                    <button 
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { API_Task } from "@/api/task"
import type { APIResponse } from "@/types/index"
import type { Task } from '~/types/products'

// Task data
const task = ref<Task>({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
});

// Priority options
const priorityOptions: { value: 'low' | 'medium' | 'high', label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

// Router
const router = useRouter();

// Save task
const saveTask = async () => {
    try {
        // Generate task ID
        task.value.id = `TASK-${Date.now().toString().slice(-6)}`;
        
        // API call to create task
        const { url, method } = API_Task.Post.task;
        const { data, success } = await useFetchWithTokenID(url, method, task.value) as APIResponse;
        
        if (success) {
            // Navigate back to tasks page
            router.push('/task');
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
};
</script>