import type { UserCredential } from "firebase/auth";
// import { getAdditionalUserInfo } from "firebase/auth";
import useUserStore from "@/stores/userStore";
import type { APIResponse } from "@/types";
import { API_LogIn, API_SignOut } from "~/api/auth";
import useShowSnackbar from "./useSnackbar";

// type WindowWithDataLayer = Window & {
//   dataLayer: Record<string, any>[];
//   gtag: (...args: any[]) => void;
// };

// declare const window: WindowWithDataLayer;

export const useBackendAuthAPI = {
  login: async (userCredential: UserCredential) => {
    const { onFailure } = useShowSnackbar();
    const { redirectedFrom, query } = useRoute();
    const { uid, providerData } = userCredential.user;
    const userProfileStore = useUserStore();
    const userStore = useUserStore();
    const providerId = providerData[0].providerId;

    try {
      console.log(uid, providerData)
      // const getLoginState = getAdditionalUserInfo(userCredential); // new user or old user
      const { url, method } = API_LogIn.Post.logIn;
      const response = await useFetchForLogin(url, method, userCredential);
      const { data } = response as APIResponse;
      const userProfile = data;
      const { email, current_client_team_role, admin_teams, current_client_team_id, client_teams }
        = userProfile;

      /** TODO: Use it later */
      // window.dataLayer = window.dataLayer || [];
      // function gtag(...args: any[]) {
      //   window.dataLayer.push(args);
      // }
      // gtag("js", new Date());
      // gtag("config", useRuntimeConfig().public.gtagId, { user_id: uid });
      // if (uid) gtag("set", useRuntimeConfig().public.gtagId, { user_id: uid });
      // if (getLoginState?.isNewUser) window.gtag("event", "sign_up");
      // else window.gtag("event", "login");

      // Setting user details in store
    //   userStore.setUserState(uid, email, providerId, current_client_team_role);
      // Setting user profile details in store
    //   const {
    //     setUserProfileStore,
    //     setAdminTeamId,
    //     setCurrentTeamId,
    //     setTeamDetail,
    //   } = userProfileStore;
    //   setUserProfileStore(userProfile);
    //   setAdminTeamId(admin_teams ? Object.keys(admin_teams)[0] : null);
    //   setCurrentTeamId(current_client_team_id);
    //   setTeamDetail(client_teams);
      if (userCredential.user.emailVerified) {
        if (query.redirectUrl) return navigateTo(query.redirectUrl as string);
        if (redirectedFrom && redirectedFrom.name !== "index")
          return navigateTo(redirectedFrom.fullPath);
        else return navigateTo("/dashboard");
      }
      else {
        if (query.redirectUrl) return navigateTo({ name: "email-verification", query: { redirectUrl: query.redirectUrl } });
        else return navigateTo({ name: "email-verification" });
      }
    }
    catch (error: unknown) {
      const { data } = error as APIResponse;
      onFailure(data);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { url, method } = API_SignOut.Post.signOut;
      await useFetchWithTokenID(url, method, null);
    }
    catch (error) {
      throw useCatchError(error);
    }
  },
};