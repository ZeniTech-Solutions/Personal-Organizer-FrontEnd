/**
 * This function is used to show snackbar with alert message
 *
 */

export default function useShowSnackbar() {
  const $snackbar = useNuxtApp().$snackbar as any;

  /**
   * Custom function to show success snackbar
   *
   */
  function onSuccess(text: string, title: string = "Request Successful") {
    return $snackbar.add({
      type: "success",
      title,
      text,
    });
  }

  /**
   * Custom function to show info snackbar
   *
   */
  function onInfo(text: string, title: string = "Info") {
    return $snackbar.add({
      type: "info",
      title,
      text,
    });
  }

  /**
   * Custom function to show faliure snackbar
   *
   */
  function onFailure(text: string, title: string = "Request Failed") {
    return $snackbar.add({
      type: "error",
      title,
      text,
    });
  }

  return {
    onSuccess,
    onInfo,
    onFailure,
  };
}