import type { Auth, User } from "firebase/auth";
import { getIdToken } from "firebase/auth";
import useUserStore from "@/stores/userStore";

export default defineNuxtPlugin(async () => {

  if (import.meta.client) {
    const userStore = useUserStore();
    const $auth = useNuxtApp().$auth as Auth;

    try {
      const currentUser: User = await new Promise((resolve, reject) => {
        const unsubscribe = $auth.onAuthStateChanged((user) => {
          unsubscribe(); // Unsubscribe to avoid memory leaks
          if (user) {
            resolve(user);
          }
          else reject(new Error("Plugin Auth: User is NOT signed in"));
        });
      });
      const { uid, email, providerData } = currentUser;
      // setGtagConfig(uid);
      await getIdToken(currentUser, false);
    //   userStore.setUserUid(uid);
    //   userStore.setUserEmail(email!);
    //   userStore.setUserProviderId(providerData[0].providerId);
    }
    catch (error) {
      const { message } = error as { message: string };
    }
  }
});

/** TODO: Use it later */
// type WindowWithDataLayer = Window & {
//   dataLayer: Record<string, any>[];
// };

// declare const window: WindowWithDataLayer;

// /**
//  * Initialize Gtag Configuration
//  * @param userID : Firebase User Uid
//  */
// function setGtagConfig(userID: string) {
//   window.dataLayer = window.dataLayer || [];
//   function gtag(...args: any[]) {
//     window.dataLayer.push(args);
//   }
//   gtag("js", new Date());
//   gtag("config", useRuntimeConfig().public.gtagId, { user_id: userID });
//   if (userID) gtag("set", useRuntimeConfig().public.gtagId, { user_id: userID });
// }