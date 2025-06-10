<template>
    <div
      class="md:p-10 p-4 bg-white h-full rounded-lg shadow-lg sm:mx-20 md:mx-10 mx-2"
    >
      <div class="text-center w-full">
        <h1 class="text-3xl mt-3 font-bold">
          Sign Up
        </h1>
        <p class="text-sm sm:text-base w-full text-gray-600 py-3">
          By continuing, I confirm that I am 18 years of age or above and have
          read and accept MooDIY's <br>
          <NuxtLink
            href="/terms-conditions"
            class="text-blue-500 hover:underline"
          >Terms and Conditions</NuxtLink>,
          <NuxtLink
            href="/privacy-policy"
            class="text-blue-500 hover:underline"
          >
            Privacy Policy</NuxtLink>
          and
          <NuxtLink
            href="/cookies-policy"
            class="text-blue-500 hover:underline"
          >
            Cookies Policy</NuxtLink>.
        </p>
      </div>
  
      <div
        class="md:grid md:grid-cols-2 flex flex-col md:divide-x-2 md:gap-10 md:py-5 md:items-center"
      >
        <!-- Login With third party provider -->
        <AuthProvider
          class="-translate-y-7"
          @disable-login-or-sign-up="disableLoginOrSignUp = $event"
        />
  
        <!-- Or -->
        <div class="py-2 flex items-center space-x-5 md:hidden">
          <span class="bg-gray-200 w-full h-[2px] rounded-full" />
          <span class="text-gray-500">or</span>
          <span class="bg-gray-200 w-full h-[2px] rounded-full" />
        </div>
        <!-- Sing up with Email & Password -->
        <div class="md:pl-10 pb-2 w-full">
          <form
            class="py-2"
            @submit.prevent="submitHandler"
          >
            <div class="space-y-5">
              <div class="mb-4 flex gap-2">
                <GenericTextInput
                  ref="userFirstNameRef"
                  v-model="userDetails.firstName"
                  label="First name"
                  type="text"
                  placeholder="Enter first name"
                  class="md:max-w-48"
                  :required="true"
                />
                <GenericTextInput
                  ref="userLastNameRef"
                  v-model="userDetails.lastName"
                  label="Last name"
                  type="text"
                  class="md:max-w-48"
                  placeholder="Enter last name"
                  :required="true"
                />
              </div>
              <div class="mb-4">
                <GenericTextInput
                  ref="userEmailRef"
                  v-model="userDetails.userEmail"
                  label="Email address"
                  type="email"
                  placeholder="Enter email address"
                  :required="true"
                />
              </div>
              <div class="mb-6">
                <GenericTextInput
                  ref="userPasswordRef"
                  v-model="userDetails.userPassword"
                  label="Password"
                  :type="inputType"
                  placeholder="Enter password"
                  :required="true"
                  @input="isPasswordNotMatch = false"
                >
                  <EyeIcon
                    v-show="inputType === 'text'"
                    class="absolute h-5 right-0 cursor-pointer"
                    @click="inputType = 'password'"
                  />
                  <EyeSlashIcon
                    v-show="inputType === 'password'"
                    class="absolute h-5 right-0 cursor-pointer"
                    @click="inputType = 'text'"
                  />
                </GenericTextInput>
              </div>
              <div class="mb-6">
                <GenericTextInput
                  ref="userConfirmPasswordRef"
                  v-model="userDetails.userConfirmationPassword"
                  label="Confirm password"
                  :type="confirmInputType"
                  placeholder="Enter confirm password"
                  :required="true"
                  @input="isPasswordNotMatch = false"
                >
                  <EyeIcon
                    v-show="confirmInputType === 'text'"
                    class="absolute h-5 right-0 cursor-pointer"
                    @click="confirmInputType = 'password'"
                  />
                  <EyeSlashIcon
                    v-show="confirmInputType === 'password'"
                    class="absolute h-5 right-0 cursor-pointer"
                    @click="confirmInputType = 'text'"
                  />
                </GenericTextInput>
              </div>
            </div>
            <p
              v-if="isPasswordNotMatch"
              class="text-red-500 mt-2"
            >
              Password and Confirm password does not match
            </p>
            <div class="pt-8">
              <button
                class="genericBtn !w-full"
                :disabled="disableLoginOrSignUp || isLoading"
                :class="[
                  (disableLoginOrSignUp || isLoading)
                    && 'opacity-75 cursor-not-allowed active:scale-100',
                ]"
                type="submit"
              >
                <GenericLoading3
                  v-if="isLoading"
                  msg="Verifying"
                  class="tracking-wider"
                  spinner-size="h-4 w-4"
                />
                <span
                  v-else
                  class="tracking-widest"
                >CONTINUE</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <p class="text-gray-700 text-sm sm:text-base text-center pt-2">
        Already have account?
        <button
          class="text-blue-500 hover:text-blue-800 pl-1"
          :disabled="disableLoginOrSignUp"
          type="button"
          :class="[
            (disableLoginOrSignUp || isLoading)
              && 'opacity-75 cursor-not-allowed active:scale-100',
          ]"
        >
          <nuxt-link :to="navigateToLogin()">
            Login
          </nuxt-link>
        </button>
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/20/solid";
  import { useFirebase } from "@/composables/useFirebaseAuth";
  import type { ChildInputRef } from "~/types";
  
  const isLoading = ref<boolean>(false);
  const isPasswordNotMatch = ref<boolean>(false);
  const inputType = ref<"password" | "text">("password");
  const confirmInputType = ref<"password" | "text">("password");
  const userEmailRef = ref<ChildInputRef | null>(null);
  const userFirstNameRef = ref<ChildInputRef | null>(null);
  const userLastNameRef = ref<ChildInputRef | null>(null);
  const userPasswordRef = ref<ChildInputRef | null>(null);
  const userConfirmPasswordRef = ref<ChildInputRef | null>(null);
  const disableLoginOrSignUp = ref<boolean>(false);
  const userDetails = reactive({
    firstName: "",
    lastName: "",
    userEmail: "",
    userPassword: "",
    userConfirmationPassword: "",
  });
  
  // navigate to login page
  function navigateToLogin() {
    const { query } = useRoute();
    if (query.redirectUrl) return `/?redirectUrl=${encodeURIComponent(query.redirectUrl as string)}`;
    else return "/";
  }
  
  /**
   * Call firebase API to login or signup
   *
   */
  async function submitHandler() {
    inputType.value = "password";
    confirmInputType.value = "password";
    userFirstNameRef.value!.validate();
    userLastNameRef.value!.validate();
    userEmailRef.value!.validate();
    userPasswordRef.value!.validate();
    userConfirmPasswordRef.value!.validate();
    if (userDetails.userPassword !== userDetails.userConfirmationPassword) {
      isPasswordNotMatch.value = true;
      return;
    };
    if (!userDetails.userEmail || !userDetails.userPassword || !userDetails.firstName || !userDetails.lastName) {
      return;
    }
    disableLoginOrSignUp.value = true;
    if (userDetails.userEmail && userDetails.userPassword) isLoading.value = true;
    await useFirebase.handleSignup(userDetails.userEmail, userDetails.userPassword, userDetails.firstName, userDetails.lastName);
    isLoading.value = false;
    disableLoginOrSignUp.value = false;
  }
  </script>