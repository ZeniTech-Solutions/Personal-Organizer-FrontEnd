<template>
    <div
      class="py-4  mt-2 flex text-lg justify-between items-center flex-col gap-7"
    >
      <button
        v-if="providerList.includes('google.com')"
        :disabled="disableLoginOrSignUp"
        :class="[disableLoginOrSignUp && 'cursor-not-allowed', reauthetication && '!bg-primary-dark text-white hover:text-white h-14 px-0']"
        class="w-full py-2 lg:px-20 px-5 gap-4 text-nowrap font-medium flex justify-start items-center bg-white text-gray-800 hover:text-gray-800 border hover:border-gray-700 border-gray-500 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-700"
        @click="onClickProviderAuthentication('google.com')"
      >
        <img
          src="/google.svg"
          class="h-6 w-6"
          alt="Google"
        >
        Continue with Google
      </button>
      <button
        v-if="providerList.includes('microsoft.com')"
        :disabled="disableLoginOrSignUp"
        :class="[disableLoginOrSignUp && 'cursor-not-allowed', reauthetication && '!bg-primary-dark text-white hover:text-white h-14']"
        class="w-full py-2 lg:px-20 px-5 gap-4 text-nowrap font-medium flex justify-start items-center border bg-white text-gray-800 hover:text-gray-800 hover:border-gray-700 border-gray-500 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-700"
        @click="onClickProviderAuthentication('microsoft.com')"
      >
        <img
          src="/microsoft.svg"
          class="h-6 w-6"
          alt="Microsoft"
        >
        Continue with Microsoft
      </button>
      <button
        v-if="providerList.includes('apple.com')"
        :disabled="disableLoginOrSignUp"
        :class="[disableLoginOrSignUp && 'cursor-not-allowed', reauthetication && '!bg-primary-dark text-white hover:text-white h-14']"
        class="w-full py-2 lg:px-20 px-5 gap-4 text-nowrap font-medium flex justify-start items-center border bg-white text-gray-800 hover:text-gray-800 hover:border-gray-700 border-gray-500 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-700"
        @click="onClickProviderAuthentication('apple.com')"
      >
        <img
          src="/apple.svg"
          class="h-6 w-6"
          alt="Apple"
        >
        Continue with Apple
      </button>
      <button
        v-if="providerList.includes('github.com')"
        :disabled="disableLoginOrSignUp"
        :class="[disableLoginOrSignUp && 'cursor-not-allowed', reauthetication && '!bg-primary-dark text-white hover:text-white h-14']"
        class="w-full py-2 lg:px-20 px-5 gap-4 text-nowrap font-medium flex justify-start items-center border bg-white text-gray-800 hover:text-gray-800 hover:border-gray-700 border-gray-500 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-700"
        @click="onClickProviderAuthentication('github.com')"
      >
        <img
          src="/github.svg"
          class="h-6 w-6"
          alt="Github"
        >
        Continue with Github
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    providerList: {
      type: Array as PropType<string[]>,
      default: () => ["google.com", "github.com", "microsoft.com", "apple.com"],
    },
    reauthetication: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: "",
    },
  
  });
  const { providerAuthentication, providerReauthentication } = useFirebase;
  type ProviderId = "google.com" | "github.com" | "microsoft.com" | "apple.com";
  
  const disableLoginOrSignUp = ref<boolean>(false);
  const emit = defineEmits(["disableLoginOrSignUp"]);
  
  async function onClickProviderAuthentication(providerId: ProviderId) {
    disableLoginOrSignUp.value = true;
    if (props.reauthetication) {
      await providerReauthentication(providerId, props.email);
    }
    else {
      await providerAuthentication(providerId);
      disableLoginOrSignUp.value = false;
    }
  }
  
  watch(disableLoginOrSignUp, () => emit("disableLoginOrSignUp", disableLoginOrSignUp.value));
  </script>