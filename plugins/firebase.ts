import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

export default defineNuxtPlugin(async (nuxtApp) => {

  const firebaseConfig = useRuntimeConfig().public.firebaseConfig;

  // Establishing web(FrontEnd) connection to Firebase(BackEnd)
  const app = firebase.initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // This will make 'auth' available globally in your Nuxt application.
  nuxtApp.provide("auth", auth);
});