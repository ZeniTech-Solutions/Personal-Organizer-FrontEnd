<template>
    <div class="min-h-[93vh] bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-1">
        <!-- Page Header with Animation -->
        <div class="mb-12 space-y-2">
            <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Milestones</h1>
            <p class="text-base text-gray-600">Track your journey and celebrate your achievements</p>
        </div>

        <!-- Timeline View -->
        <div class="relative mb-12 overflow-hidden">
            <div
                class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-500 to-blue-500">
            </div>
            <div class="flex flex-col space-y-8">
                <div v-for="milestone in sortedMilestones" :key="milestone.id" class="flex items-center"
                    :class="milestone.status === 'achieved' ? 'opacity-75' : 'opacity-100'">
                    <div class="w-1/2 pr-8" :class="{ 'text-right': (Number(milestone.id) % 2) === 0 }">
                        <div
                            class="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-lg font-semibold text-gray-900">{{ milestone.title }}</h3>
                                <span :class="[
                                    'px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200',
                                    milestone.status === 'achieved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                ]">
                                    {{ milestone.status === 'achieved' ? 'Achieved' : 'In Progress' }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">{{ milestone.description }}</p>
                            <div class="flex items-center text-sm text-gray-500 mb-2">
                                <CalendarIcon class="h-4 w-4 mr-2" />
                                <span>Target: {{ formatDate(milestone.targetDate) }}</span>
                            </div>
                            <div v-if="milestone.achievedDate" class="flex items-center text-sm text-green-500">
                                <CheckCircleIcon class="h-4 w-4 mr-2" />
                                <span>Achieved: {{ formatDate(milestone.achievedDate) }}</span>
                            </div>
                            <div class="flex justify-end space-x-2 mt-4">
                                <button v-if="milestone.status === 'pending'" @click="markAsAchieved(milestone)"
                                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    Mark as Achieved
                                </button>
                                <button @click="handleDeleteClick(milestone)"
                                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-full bg-white border-4"
                            :class="milestone.status === 'achieved' ? 'border-green-500' : 'border-blue-500'"></div>
                    </div>
                    <div class="w-1/2 pl-8"></div>
                </div>
            </div>
        </div>

        <!-- Create Milestone Modal Trigger -->
        <div class="fixed bottom-8 right-8">
            <button @click="showCreateModal = true"
                class="flex items-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <PlusIcon class="h-5 w-5 mr-2" />
                New Milestone
            </button>
        </div>

        <!-- Create Milestone Modal -->
        <TransitionRoot appear :show="showCreateModal" as="template">
            <Dialog as="div" @close="showCreateModal = false" class="relative z-50">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black/30" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">Create New
                                    Milestone</DialogTitle>
                                <form @submit.prevent="createMilestone" class="space-y-4">
                                    <div class="form-control w-full">
                                        <GenericTextInput 
                                            type="text"
                                            :model-value="newMilestone.title"
                                            label="Title"
                                            required
                                        />
                                    </div>
                                    <div class="form-control w-full">
                                        <label class="label">
                                            <span class="label-text">Description</span>
                                        </label>
                                        <textarea id="description" v-model="newMilestone.description" rows="3"
                                            class="textarea textarea-bordered h-24 resize-none"></textarea>
                                    </div>
                                    <div class="form-control w-full">
                                        <GenericTextInput 
                                            type="date"
                                            :model-value="newMilestone.targetDate"
                                            label="Target Date"
                                            required
                                        />
                                    </div>
                                    <div class="modal-action">
                                        <button type="button" @click="showCreateModal = false"
                                            class="btn btn-ghost">
                                            Cancel
                                        </button>
                                        <button type="submit"
                                            class="btn btn-primary">
                                            Create Milestone
                                        </button>
                                    </div>
                                </form>
                    </DialogPanel>
                    </TransitionChild>
                </div>
                </div>
            </Dialog>
        </TransitionRoot>

    <!-- Milestones List -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="milestone in milestones" :key="milestone.id"
            class="bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-lg">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">{{ milestone.title }}</h3>
                    <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        milestone.status === 'achieved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                        {{ milestone.status === 'achieved' ? 'Achieved' : 'Pending' }}
                    </span>
                </div>
                <p class="text-sm text-gray-600 mb-4">{{ milestone.description }}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <CalendarIcon class="h-5 w-5 mr-2" />
                    <span>Target: {{ formatDate(milestone.targetDate) }}</span>
                </div>
                <div v-if="milestone.achievedDate" class="flex items-center text-sm text-gray-500 mb-4">
                    <CheckCircleIcon class="h-5 w-5 mr-2" />
                    <span>Achieved: {{ formatDate(milestone.achievedDate) }}</span>
                </div>
                <div class="flex justify-end space-x-2">
                    <button v-if="milestone.status === 'pending'" @click="markAsAchieved(milestone)"
                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Mark as Achieved
                    </button>
                    <button @click="handleDeleteClick(milestone)"
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="showDeleteModal" as="template">
        <Dialog as="div" @close="showDeleteModal = false" class="relative z-50">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/30" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">Delete Milestone</DialogTitle>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Are you sure you want to delete this milestone? This action cannot be undone.</p>
                            </div>
                            <div class="mt-4 flex justify-end space-x-3">
                                <button type="button" @click="showDeleteModal = false"
                                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cancel
                                </button>
                                <button type="button" @click="confirmDelete"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Delete
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
    </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { CalendarIcon, CheckCircleIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { API_Milestone } from '~/api/milestone'
import type { APIResponse } from '~/types'
import type { Milestone } from '~/types/products'

const showCreateModal = ref(false)
const newMilestone = ref({
    title: '',
    description: '',
    targetDate: ''
})

const milestones = ref<Milestone[]>([])
const showDeleteModal = ref(false)
const milestoneToDelete = ref<Milestone | null>(null)

// Sort milestones by target date for timeline view
const sortedMilestones = computed(() => {
    return [...milestones.value].sort((a, b) => {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    })
})

const createMilestone = async () => {
    try {        
        const milestone: Milestone = {
            id: Date.now().toString(),
            ...newMilestone.value,
            status: 'pending'
        }
        const { url, method } = API_Milestone.Post.milestone;
        const response = await useFetchWithTokenID(url, method, milestone) as APIResponse;
        if (response.success) {
            milestones.value.push(response.data)
        }
        newMilestone.value = {
            title: '',
            description: '',
            targetDate: ''
        }
        showCreateModal.value = false
    } catch (error) {
        console.error('Error creating milestone:', error)
    }
}

const markAsAchieved = async (milestone: Milestone) => {
    try {
        milestone.status = 'achieved'
        milestone.achievedDate = new Date().toISOString().split('T')[0]
        
        const { url, method } = API_Milestone.Put.milestone
        const { success } = await useFetchWithTokenID(`${url}/${milestone.id}`, method, milestone) as APIResponse
        
        if (!success) {
            console.error('Failed to update milestone status')
        }
    } catch (error) {
        console.error('Error marking milestone as achieved:', error)
    }
}

const deleteMilestone = async (milestone: Milestone) => {
    try {
        const { url, method } = API_Milestone.Delete.milestone
        const { success } = await useFetchWithTokenID(`${url}/${milestone.id}`, method) as APIResponse
        
        if (success) {
            milestones.value = milestones.value.filter(m => m.id !== milestone.id)
        } else {
            console.error('Failed to delete milestone')
        }
    } catch (error) {
        console.error('Error deleting milestone:', error)
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const fetchMilestones = async () => {
    try {
        const { url, method } = API_Milestone.Get.milestone;
        const response = await useFetchWithTokenID(url, method) as APIResponse;
        
        if (response && response.success && Array.isArray(response.data)) {
            milestones.value = response.data
        }
    } 
    catch (error) {
        console.error('Error fetching milestones:', error)
        milestones.value = []
    }
}

onMounted(() => {
    fetchMilestones()
})

const handleDeleteClick = (milestone: Milestone) => {
    milestoneToDelete.value = milestone
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (milestoneToDelete.value) {
        await deleteMilestone(milestoneToDelete.value)
        showDeleteModal.value = false
        milestoneToDelete.value = null
    }
}
</script>