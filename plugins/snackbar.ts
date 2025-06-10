export default defineNuxtPlugin((nuxtApp) => {
  const snackbar = useSnackbar();
  nuxtApp.provide("snackbar", snackbar);
});