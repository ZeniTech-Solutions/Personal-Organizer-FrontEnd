import { defineStore } from "pinia";
import type { APIResponse, JWT } from "~/types";
import { API_Users } from "../api/users";

const useUserStore = defineStore("userStore", {
  /**
   *  ****************** User State ******************
   */
  state: (): {
    userAuthToken: null | string;
    userDetails: JWT | {}
  } => ({
    userAuthToken: null,
    userDetails: {}
  }),

  /**
   *  ****************** Getters ******************
   */
  getters: {
    /**
     * Getter get the auth token of the user
     *
     */
    getUserAuthToken(state) {
        return state.userAuthToken;
      },
    /**
     * Getter get the authenticated email of the user
     *
     */
    getUserDetails(state) {
      return state.userDetails;
    },
  },
  /**
   *  ****************** All Actions ******************
   */
  actions: {
    /**
     * Function to set user auth token
     *
     */
    setUserAuthToken(token: string | null) {
        this.userAuthToken = token;
      },
      
    /**
     * Function to set user uid
     *
     */
    setUserDetails(userDetails: JWT) {
      this.userDetails = userDetails;
    },
    async fetchUserDetails() {
      if (!this.userAuthToken || Object.keys(this.userDetails).length) return;
      const decodedJWT = decodeJWT(this.userAuthToken as string) as JWT;
      const { url, method } = API_Users.Get.users;
      const { data, success } = await useFetchWithTokenID(`${url}/${decodedJWT.id}`, method) as APIResponse;
      if (success) {
        console.log(data)
        this.setUserDetails(data);
      }
    },
    /**
     * Fetching user Auth token from secure cookie
     * 
     */
    async fetchTokenFromCookie() {
      const authToken = getAuthToken();
      if (authToken) {
        console.log("fetching token from cookie")
        this.userAuthToken = authToken
        await this.fetchUserDetails();
      }
      return authToken
    },
  },
});

export default useUserStore;
