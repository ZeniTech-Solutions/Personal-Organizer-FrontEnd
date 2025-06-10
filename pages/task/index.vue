<template>
    <div class="min-h-[93vh] bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-1">
        <!-- Main Content -->
        <div class="flex-1 overflow-auto">
            <div>
                <!-- Header -->
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-4xl pb-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">My Todo</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- View Toggle -->
                        <div class="flex bg-gray-200 rounded-lg p-1">
                            <button @click="currentView = 'kanban'" 
                                :class="[currentView === 'kanban' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700', 
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors']">
                                <span class="flex items-center">
                                    <RectangleGroupIcon class="h-5 w-5 mr-1" />
                                    Kanban
                                </span>
                            </button>
                            <button @click="currentView = 'list'" 
                                :class="[currentView === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700', 
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors']">
                                <span class="flex items-center">
                                    <ListBulletIcon class="h-5 w-5 mr-1" />
                                    List
                                </span>
                            </button>
                        </div>
                        <NuxtLink to="/task/create"
                            class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors">
                            <PlusIcon class="h-5 w-5 mr-2 text-white" />
                            New Task
                        </NuxtLink>
                    </div>
                </div>

                <!-- Kanban View -->
                <div v-if="currentView === 'kanban'" class="grid grid-cols-3 gap-6">
                    <div v-for="(column, columnIndex) in columns" :key="column.id" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <!-- Column Header -->
                        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <div class="flex items-center">
                                <h3 class="font-medium text-gray-700">{{ column.title }}</h3>
                                <div class="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">{{ getTasksByStatus(column.id).length }}</div>
                            </div>
                        </div>

                        <!-- Tasks Container -->
                        <div class="min-h-[500px]" @dragover.prevent @drop="handleDrop($event, column.id)">
                            <!-- Tasks -->
                            <div v-for="task in getTasksByStatus(column.id)" :key="task.id"
                                class="bg-white rounded-md p-3 m-5 mb-3 shadow-md border-2 border-gray-100 cursor-pointer"
                                draggable="true" @dragstart="handleDragStart($event, task)"
                                @click="openTaskModal(task)">
                                <h4 class="font-medium mb-1">{{ task.title }}</h4>
                                <p class="text-sm text-gray-500 mb-3">{{ task.description }}</p>
                                <div class="flex justify-between items-center mt-2">
                                    <div class="text-sm text-gray-400 uppercase tracking-wider">{{ task.id }}</div>
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 text-xs rounded-full" :class="{
                        'bg-red-100 text-red-800': task.priority === 'high',
                        'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                        'bg-green-100 text-green-800': task.priority === 'low'
                    }">
                                            {{ task.priority || 'medium' }}
                                        </span>
                                        <span v-if="task.dueDate" class="text-xs text-gray-500">
                                            {{ formatDate(task.dueDate) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- List View -->
                <div v-else-if="currentView === 'list'" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <!-- Table Header -->
                    <div class="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                        <div class="col-span-4">Task</div>
                        <div class="col-span-2">Status</div>
                        <div class="col-span-2">Priority</div>
                        <div class="col-span-2">Due Date</div>
                        <div class="col-span-2">Actions</div>
                    </div>
                    
                    <!-- Table Body -->
                    <div class="divide-y divide-gray-200">
                        <div v-for="task in tasks" :key="task.id" 
                            class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div class="col-span-4">
                                <div class="font-medium text-gray-900">{{ task.title }}</div>
                                <div class="text-sm text-gray-500 truncate">{{ task.description }}</div>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 text-xs rounded-full" :class="{
                                    'bg-blue-100 text-blue-800': task.status === 'todo',
                                    'bg-purple-100 text-purple-800': task.status === 'in-progress',
                                    'bg-green-100 text-green-800': task.status === 'completed'
                                }">
                                    {{ getStatusLabel(task.status) }}
                                </span>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 text-xs rounded-full" :class="{
                                    'bg-red-100 text-red-800': task.priority === 'high',
                                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                                    'bg-green-100 text-green-800': task.priority === 'low'
                                }">
                                    {{ task.priority || 'medium' }}
                                </span>
                            </div>
                            <div class="col-span-2">
                                <span v-if="task.dueDate" class="text-sm text-gray-500">
                                    {{ formatDate(task.dueDate) }}
                                </span>
                                <span v-else class="text-sm text-gray-400">-</span>
                            </div>
                            <div class="col-span-2 flex space-x-2">
                                <button @click="openTaskModal(task)" 
                                    class="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                                    <PencilIcon class="h-5 w-5" />
                                </button>
                                <button @click="confirmDeleteTask(task)" 
                                    class="p-1 text-red-600 hover:text-red-800 transition-colors">
                                    <TrashIcon class="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DialogRoot :open="showDeleteConfirmation">
        <DialogPortal>
            <DialogOverlay class="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
            <DialogContent
                class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]">
                <DialogTitle class="text-gray-800 m-0 text-xl font-semibold">
                    Confirm Deletion
                </DialogTitle>
                <DialogDescription class="text-gray-600 mt-[10px] mb-5 text-sm leading-normal">
                    Are you sure you want to delete this task? This action cannot be undone.
                </DialogDescription>
                
                <div class="mt-[25px] flex justify-end gap-3">
                    <button @click="showDeleteConfirmation = false"
                        class="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
                        Cancel
                    </button>
                    <button @click="confirmDelete"
                        class="bg-red-600 text-white text-sm hover:bg-red-700 inline-flex h-[35px] items-center justify-center rounded-lg px-[15px] font-medium leading-none focus:outline-none">
                        Delete Task
                    </button>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>

</template>

<script setup lang="ts">
import {
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
} from 'reka-ui'
import {
    PlusIcon, 
    XMarkIcon, 
    RectangleGroupIcon, 
    ListBulletIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'
import { API_Task } from "@/api/task"
import type { APIResponse } from "@/types/index"
import useUserStore from "@/stores/userStore"
import type { Task } from '~/types/products'

interface Column {
    id: 'todo' | 'in-progress' | 'completed';
    title: string;
}

// Define columns
const columns = ref<Column[]>([
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
]);

// View state
const currentView = ref<'kanban' | 'list'>('kanban');

// Sample tasks data
const tasks = ref<Task[]>([]);
const userStore = useUserStore();

// Currently dragged task
const draggedTask = ref<Task | null>(null);

// Filter tasks by status
const getTasksByStatus = (status: string) => {
    return tasks.value.filter(task => task.status === status);
};

// Get status label for display
const getStatusLabel = (status: string) => {
    switch(status) {
        case 'todo': return 'To Do';
        case 'in-progress': return 'In Progress';
        case 'completed': return 'Completed';
        default: return status;
    }
};

// Handle drag start
const handleDragStart = (event: DragEvent, task: Task) => {
    draggedTask.value = task;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', task.id);
    }
};

// Handle drop
const handleDrop = async (event: DragEvent, columnId: string) => {
    event.preventDefault();

    if (draggedTask.value && draggedTask.value.status !== columnId) {
        // Find the task in the array and update its status
        const taskIndex = tasks.value.findIndex(t => t.id === draggedTask.value?.id);
        if (taskIndex !== -1) {
            const task = tasks.value[taskIndex];
            editingTask.value = { ...task };
            currentTask.value = { 
                ...task,
                status: columnId as 'todo' | 'in-progress' | 'completed'
            };
            await saveTask();
        }
    }

    draggedTask.value = null;
};

// Task modal state
const showTaskModal = ref(false);
const editingTask = ref<Task | null>(null);
const currentTask = ref<Task>({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
});

// Delete confirmation modal
const showDeleteConfirmation = ref(false);
const taskToDelete = ref<Task | null>(null);

// Format date for display
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

// Open task modal for creating or editing
const openTaskModal = (task?: Task) => {
    if (task) {
        // Edit existing task
        editingTask.value = task;
        currentTask.value = { ...task };
    } else {
        // Create new task
        editingTask.value = null;
        currentTask.value = {
            id: `TASK-${String(tasks.value.length + 1).padStart(3, '0')}`,
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            status: 'todo'
        };
    }
    showTaskModal.value = true;
};

// Close task modal
const closeTaskModal = () => {
    showTaskModal.value = false;
};

// Confirm delete task
const confirmDeleteTask = (task: Task) => {
    taskToDelete.value = task;
    showDeleteConfirmation.value = true;
};

// Confirm delete action
const confirmDelete = () => {
    if (taskToDelete.value) {
        deleteTask(taskToDelete.value);
        showDeleteConfirmation.value = false;
        taskToDelete.value = null;
    }
};

// Save task (create or update)
const saveTask = async () => {
    if (editingTask.value) {
        // Update existing task
        const taskIndex = tasks.value.findIndex(t => t.id === editingTask.value?.id);
        if (taskIndex !== -1) {
            const updatedFields = Object.keys(currentTask.value).reduce((acc, key) => {
                if (editingTask.value && currentTask.value[key as keyof Task] !== editingTask.value[key as keyof Task]) {
                    (acc as Record<keyof Task, Task[keyof Task]>)[key as keyof Task] = currentTask.value[key as keyof Task];
                }
                return acc;
            }, {} as Partial<Task>);

            tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updatedFields };
            const { url, method } = API_Task.Put.task;
            const taskResponse = await useFetchWithTokenID(`${url}/${currentTask.value.id}`, method, updatedFields);
        }
    } else {
        // Add new task
        const { url, method } = API_Task.Post.task;
        const { data, success } = await useFetchWithTokenID(url, method, currentTask.value) as APIResponse;
        if (success) {
            tasks.value.push({ ...data });
        }
    }
    closeTaskModal();
};

const fetchTasks = async () => {
    try {
        const { url, method } = API_Task.Get.task
        const { data } = await useFetchWithTokenID(url, method) as APIResponse;
        tasks.value = (data as Task[]).sort((a, b) => 
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        ).map((task) => {
            return {
                ...task,
                dueDate: new Date(task.dueDate).toISOString(), // Convert to ISO string for display
            } as Task;
        });
    } catch (error) {
        console.error('Error fetching tasks:', error); 
    }
}

onMounted(() => {
    fetchTasks();
});

// Delete task
const deleteTask = (task?: Task) => {
    const taskToRemove = task || editingTask.value;
    if (!taskToRemove) return;
    
    const taskIndex = tasks.value.findIndex(t => t.id === taskToRemove.id);
    if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1);
        const { url, method } = API_Task.Delete.task;
        const taskResponse = useFetchWithTokenID(`${url}/${taskToRemove.id}`, method);
    }
    closeTaskModal();
};
</script>