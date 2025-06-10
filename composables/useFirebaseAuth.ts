import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signOut,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    type Auth,
    updateProfile,
    sendEmailVerification,
    getMultiFactorResolver,
    TotpMultiFactorGenerator,
    type MultiFactorResolver,
    multiFactor,
    sendPasswordResetEmail,
    updatePassword,
    type User,
    verifyPasswordResetCode,
    confirmPasswordReset,
    applyActionCode,
    checkActionCode,
  } from "firebase/auth";
  import useShowSnackbar from "@/composables/useSnackbar";
  
  type ProviderId = "google.com" | "github.com" | "microsoft.com" | "apple.com";
  
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const microsoftProvider = new OAuthProvider("microsoft.com");
  const appleProvider = new OAuthProvider("apple.com");
  
  const PROVIDER = {
    GOOGLE_PROVIDER_ID: "google.com",
    GITHUB_PROVDER_ID: "github.com",
    MICROSOFT_PROVIDER_ID: "microsoft.com",
    APPLE_PROVIDER_ID: "apple.com",
  };
  let loginResolver: MultiFactorResolver;
  export const useFirebase = {
    /**
    * This custom function used for get credentialFromError to used for pending credential
    *
    */
    getProviderCredentialError: (providerId: ProviderId, error: any) => {
      let pendingCredential;
      switch (providerId) {
        case PROVIDER.GOOGLE_PROVIDER_ID:
          pendingCredential = GoogleAuthProvider.credentialFromError(error);
          break;
        case PROVIDER.GITHUB_PROVDER_ID:
          pendingCredential = GithubAuthProvider.credentialFromError(error);
          break;
        case PROVIDER.MICROSOFT_PROVIDER_ID:
          pendingCredential = OAuthProvider.credentialFromError(error);
          break;
        case PROVIDER.APPLE_PROVIDER_ID:
          pendingCredential = OAuthProvider.credentialFromError(error);
          break;
        default:
          throw new Error(`No Provider Implemented for ${providerId}`);
      }
      return pendingCredential;
    },
  
    /**
    * This function used for get provider
    *
    */
    getProvider: (providerId: ProviderId) => {
      switch (providerId) {
        case PROVIDER.GOOGLE_PROVIDER_ID:
          return googleProvider;
        case PROVIDER.GITHUB_PROVDER_ID:
          return githubProvider;
        case PROVIDER.MICROSOFT_PROVIDER_ID:
          return microsoftProvider;
        case PROVIDER.APPLE_PROVIDER_ID:
          return appleProvider;
        default:
          throw new Error(`No provider implemented for ${providerId}`);
      }
    },
    deleteMFA: async () => {
      const auth = useNuxtApp().$auth as Auth;
      const { onFailure } = useShowSnackbar();
      try {
        // Unenroll from TOTP MFA.
        const mfid = multiFactor(auth.currentUser as User).enrolledFactors[0].uid;
        await multiFactor(auth.currentUser as User).unenroll(mfid);
      }
      catch (error) {
        const { data } = useFirebaseError(error);
        onFailure(data);
      }
    },
    handleMFALogin: async (otp: string) => {
      const { query } = useRoute();
      const { onFailure } = useShowSnackbar();
      try {
        const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(loginResolver.hints[0].uid, otp);
        // Finalize the sign-in.
        const userCredential = await loginResolver.resolveSignIn(multiFactorAssertion);
        if (query.redirectUrl === "settings") useFirebase.deleteMFA();
        return useBackendAuthAPI.login(userCredential);
      }
      catch (error) {
        const { data } = useFirebaseError(error);
        onFailure(data);
      }
    },
    resolveMfaError: async (error: any, reauth: boolean) => {
      const { query } = useRoute();
      const auth = useNuxtApp().$auth as Auth;
      loginResolver = getMultiFactorResolver(auth, error);
      if (reauth) return navigateTo({ name: "2fa-verification", query: { redirectUrl: "settings" } });
      else if (query.redirectUrl) return navigateTo({ name: "2fa-verification", query: { redirectUrl: query.redirectUrl } });
      else return navigateTo({ name: "2fa-verification" });
    },
    providerReauthentication: async (providerId: ProviderId, email: string) => {
      const $auth = useNuxtApp().$auth as Auth;
      const { onFailure } = useShowSnackbar();
      try {
        const provider = useFirebase.getProvider(providerId);
        provider.setCustomParameters({
          login_hint: email,
        });
        await signInWithPopup($auth, provider);
        navigateTo("/settings/two-factor-authentication");
      }
      catch (error: any) {
        if (error.code === "auth/multi-factor-auth-required") {
          useFirebase.resolveMfaError(error, true);
        }
        else {
          const { data } = useFirebaseError(error);
          onFailure(data);
        }
      }
    },
  
    /**
    * This firebase API is used for logging in user through its google email Id.
    * we are also creating a session at backend by using useBackendAuthAPI.login()
    *
    */
    providerAuthentication: async (providerId: ProviderId) => {
      const $auth = useNuxtApp().$auth as Auth;
      const { onFailure } = useShowSnackbar();
      try {
        const provider = useFirebase.getProvider(providerId);
        console.log(provider)
        const userCredential = await signInWithPopup($auth, provider);
        console.log(userCredential)
        if (!userCredential) throw new Error("User credential is empty");
        return await useBackendAuthAPI.login(userCredential);
      }
      catch (error: any) {
        if (error.code === "auth/multi-factor-auth-required") {
          await useFirebase.resolveMfaError(error, false);
        }
        else if (error.code === "auth/account-exists-with-different-credential") {
          const email = error.customData.email;
          const pendingCredential = useFirebase.getProviderCredentialError(providerId, error);
          
          // Fetch existing providers linked to the email
          const existingProvider = await fetchSignInMethodsForEmail($auth, email);
          console.log('hey rahul', existingProvider, email, pendingCredential)
          let signInWithCredentials;
          if (existingProvider.length) {
            const existingProviderData = useFirebase.getProvider(existingProvider[0] as ProviderId); // get provider id
            existingProviderData.setCustomParameters({ login_hint: email }); // set custom parameters
  
            signInWithCredentials = await signInWithPopup($auth, existingProviderData); // sign in with popup
  
            if (signInWithCredentials.user.email !== email) { // if browser loggedin email and selected provider email will be not same
              await signOut($auth);
              onFailure("Choose another account , match with github account");
            }
            else {
              try {
                let credential;
                if (pendingCredential) {
                  credential = await linkWithCredential(signInWithCredentials.user!, pendingCredential);
                }
                if (!credential) throw Error("User credential is empty");
                return await useBackendAuthAPI.login(credential);
              }
              catch (err: unknown) {
                const { data } = useFirebaseError(err);
                onFailure(data);
              }
            }
          }
        }
        else {
          const { data } = useFirebaseError(error);
          onFailure(data);
        }
      }
    },
  
    /**
     * This firebase API is used for logging out the user from the application.
     * we are also destroying user session from backend by using useBackendAuthAPI.signOut()
     *
     */
    signOutUser: async () => {
      try {
        await useBackendAuthAPI.signOut();
        await useFirebase.deleteToken();
        return useResponse(true, "Successfully logged out");
      }
      catch (error) {
        throw { success: false, message: error };
      }
    },
    sendSigninVerificationLink: async () => {
      const { onSuccess, onFailure } = useShowSnackbar();
      try {
        const auth = useNuxtApp().$auth as Auth;
        await sendEmailVerification(auth.currentUser as User);
        onSuccess("Verification email send successfully");
      }
      catch (error) {
        const { data } = useFirebaseError(error);
        onFailure(data);
      }
    },
    /**
  * This firebase API handles signup using email and password
  *
  */
    handleSignup: async (email: string, password: string, firstName: string, lastName: string) => {
      const { onFailure } = useShowSnackbar();
      try {
        const auth = useNuxtApp().$auth as Auth;
        const user = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user.user, { displayName: `${firstName} ${lastName}` });
        await sendEmailVerification(auth.currentUser as User);
        return useBackendAuthAPI.login(user);
      }
      catch (error) {
        const { data } = useFirebaseError(error);
        onFailure(data);
      }
    },
    /**
    * This firebase API handles login using email and password
    *
    */
    handleLogin: async (email: string, password: string) => {
      const { onFailure } = useShowSnackbar();
      try {
        const auth = useNuxtApp().$auth as Auth;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return useBackendAuthAPI.login(userCredential);
      }
      catch (error: any) {
        if (error.code === "auth/multi-factor-auth-required") {
          useFirebase.resolveMfaError(error, false);
        }
        else {
          const { data } = useFirebaseError(error);
          onFailure(data);
        }
      }
    },
    /**
    * This firebase API change password of loggedin user
    *
    */
    changeUserPassword: async (oldPassword: string, newPassword: string) => {
      const auth = useNuxtApp().$auth as Auth;
      const user = auth.currentUser;
      const userCredential = await signInWithEmailAndPassword(auth, user?.email as string, oldPassword);
      await updatePassword(userCredential.user, newPassword);
    },
  
    /**
      * This firebase API to send reset password mail
      *
      */
    sendPasswordResetMail: async (email: string) => {
      const auth = useNuxtApp().$auth as Auth;
      await sendPasswordResetEmail(auth, email);
    },
    /**
     * This firebase API to reset password
     *
     */
    handleResetPassword: async (actionCode: string, newPassword: string) => {
      const auth = useNuxtApp().$auth as Auth;
      // Verify the password reset code is valid.
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, newPassword);
    },
    /**
     * This firebase API is used for verify email
     *
     */
    handleVerifyEmail: async (actionCode: string) => {
      const auth = useNuxtApp().$auth as Auth;
      await applyActionCode(auth, actionCode);
      if (auth.currentUser) await auth.currentUser.reload();
    },
    /**
     * This firebase API is used for revert/enroll MFA
     *
     */
    handleRevertSecondFactor: async (actionCode: string) => {
      const auth = useNuxtApp().$auth as Auth;
      // check Action code is valid or not
      await checkActionCode(auth, actionCode);
      await applyActionCode(auth, actionCode);
    },
    /**
     * This firebase API is used for logging out the user from the application.
     * i.e. deleting user token
     *
     */
    deleteToken: async () => {
      const $auth = useNuxtApp().$auth as Auth;
      // eslint-disable-next-line no-useless-catch
      try {
        await signOut($auth);
        // useEmptyAllStore();
        navigateTo({ name: "index" });
      }
      catch (error: unknown) {
        throw error;
      }
    },
  };