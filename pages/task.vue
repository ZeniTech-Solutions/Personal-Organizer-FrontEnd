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
                    <button @click="openTaskModal()"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors">
                        <PlusIcon class="h-5 w-5 mr-2 text-white" />
                        New Task
                    </button>
                </div>

                <!-- Task Board -->
                <div class="grid grid-cols-3 gap-6">
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

                            <!-- Add New Button (only in todo column) -->
                            <div v-if="column.id === 'todo'"
                                class="bg-white rounded-md p-3 m-5 hover:bg-gray-300 hover:text-black border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 cursor-pointer"
                                @click="openTaskModal()">
                                <PlusIcon class="w-5 h-5 mr-2" />
                                Add New
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <DialogRoot :open="showTaskModal">
        <DialogPortal>
            <DialogOverlay class="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
            <DialogContent
                class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]">
                <DialogTitle class="text-gray-800 m-0 text-xl font-semibold">
                    {{ editingTask ? 'Edit Task' : 'Create New Task' }}
                </DialogTitle>
                <DialogDescription class="text-gray-600 mt-[10px] mb-5 text-sm leading-normal">
                    {{ editingTask ? 'Update task details below.' : 'Fill in the details to create a new task.' }}
                </DialogDescription>
                
                <!-- Task ID (read-only) -->
                <fieldset v-if="editingTask" class="mb-[15px] flex items-center gap-5">
                    <GenericTextInput 
                        label="Task ID"
                        disabled
                        :model-value="currentTask.id"
                        type="text"
                    />
                </fieldset>
                
                <!-- Title -->
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <GenericTextInput 
                        label="Title"
                        :model-value="currentTask.title"
                        type="text"
                        required
                    />
                </fieldset>
                
                <!-- Description -->
                <fieldset class="mb-[15px] flex items-start gap-5">
                    <label class="text-gray-700 w-[120px] text-right text-sm pt-2" for="task-description">Description</label>
                    <textarea id="task-description" v-model="currentTask.description" rows="3"
                        class="text-gray-800 bg-stone-50 shadow-gray-300 focus:shadow-blue-400 inline-flex w-full flex-1 items-center justify-center rounded-lg px-[10px] py-2 text-sm leading-normal shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] resize-none"></textarea>
                </fieldset>
                
                <!-- Due Date -->
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <GenericTextInput
                        label="Due Date"
                        :model-value="currentTask.dueDate"
                        type="datetime-local"

                    />
                </fieldset>
                
                <!-- Priority -->
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-gray-700 w-[120px] text-right text-sm" for="task-priority">Priority</label>
                    <select id="task-priority" v-model="currentTask.priority"
                        class="text-gray-800 bg-stone-50 shadow-gray-300 focus:shadow-blue-400 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-lg px-[10px] text-sm leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </fieldset>
                
                <!-- Status (only for editing) -->
                <fieldset v-if="editingTask" class="mb-[15px] flex items-center gap-5">
                    <label class="text-gray-700 w-[120px] text-right text-sm" for="task-status">Status</label>
                    <select id="task-status" v-model="currentTask.status"
                        class="text-gray-800 bg-stone-50 shadow-gray-300 focus:shadow-blue-400 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-lg px-[10px] text-sm leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                        <option value="todo">To Start</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </fieldset>
                
                <!-- Recurring Options section removed as it's not used in the payload -->
                
                <!-- Action Buttons -->
                <div class="mt-[25px] flex justify-end gap-3">
                    <button @click="closeTaskModal"
                    class="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
                    Cancel
                </button>
                <button v-if="editingTask" @click="deleteTask"
                    class="bg-red-600 text-white text-sm hover:bg-red-700 inline-flex h-[35px] items-center justify-center rounded-lg px-[15px] font-medium leading-none focus:outline-none">
                    Delete Task
                </button>
                    <button @click="saveTask"
                        class="bg-blue-600 text-white text-sm hover:bg-blue-700 inline-flex h-[35px] items-center justify-center rounded-lg px-[15px] font-medium leading-none focus:outline-none">
                        {{ editingTask ? 'Update Task' : 'Create Task' }}
                    </button>
                </div>
                
                <button @click="closeTaskModal"
                    class="text-gray-500 hover:bg-gray-100 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
                    aria-label="Close">
                     <XMarkIcon class="w-5 h-5" />
                </button>
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
import {PlusIcon, XMarkIcon} from '@heroicons/vue/24/outline'
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

// Sample tasks data
const tasks = ref<Task[]>([]);
const userStore = useUserStore();

// Currently dragged task
const draggedTask = ref<Task | null>(null);

// Filter tasks by status
const getTasksByStatus = (status: string) => {
    return tasks.value.filter(task => task.status === status);
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
        // tasks.value.push({ ...currentTask.value });
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
const deleteTask = () => {
    const taskIndex = tasks.value.findIndex(t => t.id === editingTask.value?.id);
    if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1);
        const { url, method } = API_Task.Delete.task;
        const taskResponse = useFetchWithTokenID(`${url}/${currentTask.value.id}`, method);
    }
    closeTaskModal();
};
</script>