<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-10" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <KeyIcon class="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                    {{ isEditing ? 'Edit Password' : 'Add New Password' }}
                  </DialogTitle>
                </div>
              </div>

              <form @submit.prevent="savePassword" class="mt-6 space-y-4">
                <div>
                  <GenericTextInput
                    type="text"
                    id="title"
                    v-model="form.title"
                    label="Title"
                    placeholder="e.g. Gmail, Netflix, Bank Account"
                    required
                  />
                </div>

                <div>
                  <label for="category" class="label">
                    <span class="label-text">Category</span>
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    class="select select-bordered w-full"
                  >
                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                  </select>
                </div>

                <div>
                  <GenericTextInput
                    type="text"
                    id="username"
                    v-model="form.username"
                    placeholder="username or email@example.com"
                    label="Username / Email"
                    required
                  />
                </div>

                <div>
                  <div class="join w-full">
                    <GenericTextInput
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      label="Password"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="btn join-item"
                    >
                      <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <GenericTextInput
                    type="text"
                    id="website"
                    v-model="form.website"
                    label="Website (optional)"
                    placeholder="https://example.com"
                  />
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    class="btn btn-primary w-full sm:col-start-2"
                  >
                    {{ isEditing ? 'Save Changes' : 'Add Password' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline w-full sm:col-start-1 sm:mt-0"
                    @click="$emit('close')"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import type { PasswordEntry } from '~/stores/passwordStore';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  passwordData?: Partial<PasswordEntry>;
}>();

const emit = defineEmits(['close', 'save']);

const categories = [
  'Social Media',
  'Email',
  'Banking',
  'Shopping',
  'Work',
  'Entertainment',
  'Other'
];

const showPassword = ref(false);
const form = ref<Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>>({  
  title: '',
  username: '',
  password: '',
  website: '',
  category: 'Other'
});

// Watch for changes in passwordData to update the form
watch(() => props.passwordData, (newData) => {
  if (newData) {
    form.value = {
      title: newData.title || '',
      username: newData.username || '',
      password: newData.password || '',
      website: newData.website || '',
      category: newData.category || 'Other'
    };
  }
}, { immediate: true });

function savePassword() {
  emit('save', form.value);
}
</script>