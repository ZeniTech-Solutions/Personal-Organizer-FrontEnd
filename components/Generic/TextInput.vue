<template>
    <div
      class="relative"
      :class="`${disabled ? 'text-gray-500' : ''} text-sm sm:text-lg w-full`"
    >
      <label class="flex justify-between mb-2 font-semibold">
        <span :class="[`${style}` || 'text-sm sm:text-lg mb-1  text-gray-600']">{{ label }}<span :class="[required && 'text-red-400']">{{
          label.length && required ? "*" : ""
        }}</span>
          <span
            v-if="needBracket"
            class="pl-5 text-sm sm:text-base"
          >{{ needBracket }}</span>
        </span>
        <span
          v-show="alertUser"
          class="text-sm sm:text-base flex items-end text-red-400 "
        >*Required</span>
      </label>
      <input
        ref="inputElement"
        :type="type"
        :placeholder="placeholder"
        :value="inputValue"
        :disabled="disabled"
        class="w-full py-2 pl-3 pr-4 text-sm sm:text-base border-2 border-gray-200 rounded-md focus:outline-none focus:ring-0 focus:border-primary-light"
        :class="[
          (alertUser || alert) && 'border-red-200',
          disabled && 'cursor-not-allowed',
        ]"
        @input="updateInputValue(($event.target as HTMLInputElement)?.value)"
      >
      <div class="absolute bottom-0 right-0 flex items-center top-8 mr-4 text-gray-500">
        <slot />
      </div>
      <p
        v-if="alert"
        class="text-sm sm:text-base text-red-400"
      >
        {{ alertMsg }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    /**
     * Tells whether the TextField is disabled or not
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Label to be displayed on input
     */
    label: {
      type: String,
      default: "",
    },
    /**
     * Placeholder to be shown in the input field
     */
    placeholder: {
      type: String,
      default: "Enter a value",
    },
    /**
     * The input value
     */
    modelValue: {
      type: String,
      default: "",
    },
    /**
     * Input field type
     */
    type: {
      type: String,
      default: "text",
    },
    /**
     * Tells whether the TextField is required or not
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Minimum limit of number when input type number
     */
    minLimit: {
      type: Number,
      default: -Infinity,
    },
    /**
     * Maximum limit of number when input type number
     */
    maxLimit: {
      type: Number,
      default: Infinity,
    },
    /**
     * To explicity alert user
     */
    alert: {
      type: Boolean,
      default: false,
    },
    /**
     * Display alert msg
     */
    alertMsg: {
      type: String,
      default: "",
    },
    /**
     * Style for label
     */
    style: {
      type: String,
      required: false,
    },
    needBracket: {
      type: String,
      default: "",
    },
  });
  
  const emit = defineEmits(["update:modelValue"]);
  const alert = computed(() => props.alert);
  const inputValue = computed(() => props.modelValue);
  const alertUser = ref(false);
  
  /**
   * Runs validation on input value empty or not
   *
   */
  const validate = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.required && !inputValue.value
      ? (alertUser.value = true)
      : (alertUser.value = false);
  };
  
  /**
   * Update the intermediate inputValue reference and
   * emits an event to update it in the parent too
   *
   * @param {string} newValue - new input value
   */
  const updateInputValue = (newValue: string) => {
    emit("update:modelValue", newValue);
    setTimeout(() => validate(), 100);
  };
  
  /**
   * For parent component to access child functions or variables
   */
  defineExpose({
    validate,
  });
  </script>