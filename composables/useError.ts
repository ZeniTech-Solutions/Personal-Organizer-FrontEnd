import type { FailedAPIResponse, FailedFirebaseResponse } from "~/types";

/**
 * This Function is used to return API Response
 * @param isSuccess - Status of API response
 * @param responseMessage - API response message
 * @returns
 */
export function useResponse(isSuccess: boolean, responseMessage: string) {
    return {
      success: isSuccess,
      data: responseMessage,
    };
  }

/**
   * Type guard function to check if the error is typeof FailedAPIResponse
   *
   */
  function isFailedAPIResponse(error: unknown): error is FailedAPIResponse {
    const result
      = typeof error === "object"
      && error !== null
      && "success" in error
      && "data" in error;
    return result;
  }
  
  /**
   * This function is used to return unknown error
   *
   */
  function useUnknownError(message = "Unknown Error Occured") {
    return {
      success: false,
      data: message,
    };
  }
  
  /**
   * This function is used to check unknown error type
   * if error type of FailedAPIResponse, return respective error
   * else return unknown error
   *
   */
  export function useCatchError(error: unknown) {
    if (isFailedAPIResponse(error)) {
        return useResponse(error.success, error.data);
    }
    return useUnknownError((error as { error: string }).error);
  }

  /**
 * Type guard function to check if the error is typeof FailedFirebaseResponse
 *
 */
function isFirebaseError(error: unknown): error is FailedFirebaseResponse {
  const result = typeof error === "object" && error !== null && "code" in error;
  return result;
}

  /**
 * This function is used to check unknown error type
 * if error type of FailedFirebaseResponse, return respective error
 * else return unknown error
 *
 */
export function useFirebaseError(error: unknown) {
  if (isFirebaseError(error)) {
    const faliureMessage = error.code.split("/")[1].split("-").join(" ");
    return useResponse(false, faliureMessage);
  }
  return useUnknownError();
}
