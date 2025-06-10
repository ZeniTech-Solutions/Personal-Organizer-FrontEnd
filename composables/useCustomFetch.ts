import useUserStore from "~/stores/userStore";

export async function useFetchWithTokenID(
  url: string,
  method: "get" | "post" | "put" | "delete",
  payload?: any,
  isFormData: boolean = false
) {
  let body = null;
  const bearerToken = useUserStore().getUserAuthToken
  const headers: Record<string, string> = {
    "accept": "application/json",
    "Authorization": `Bearer ${bearerToken}`
  }
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!isFormData && payload && method.toLowerCase() !== "get") {
    headers["Content-Type"] = "application/json";
  }
  
  if (payload) body = payload;
  
  try {
    const options: any = {
      method: method.toUpperCase(),
      headers,
      credentials: "include",
      ...(payload && method.toLowerCase() !== "get" ? { body: payload } : {}),
    }
    
    const { data, error } = await useFetch(`http://localhost:3001${url}`, options);
    if (error.value?.data) throw error.value?.data;
    return data.value as unknown;
  }
  catch (error: unknown) {
    console.error(error)
    throw useCatchError(error);
  }
}

export async function useFetchForLogin(
  url: string,
  method:  "get" | "post" | "put" | "delete",
  body?: any
) {

  const headers = {
    "accept": "application/json"
  }

  try {
    const { data, error } = await useFetch(`http://localhost:3001${url}`, {
      method: method,
      headers: headers,
      body,
    });
    if (error.value?.data) throw error.value?.data;
    return data.value;
  }
  catch (error: unknown) {
    console.error(error)
    // throw useCatchError(error);
  }
}
