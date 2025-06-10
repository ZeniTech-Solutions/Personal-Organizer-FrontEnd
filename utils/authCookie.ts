/**
 * Utility functions for handling authentication tokens securely using HTTP-only cookies
 * This approach is more secure than localStorage as it protects against XSS attacks
 * Tokens are also cached in userStore for improved performance
 */

import useUserStore from '~/stores/userStore';

// Cookie options for secure token storage
const AUTH_COOKIE_NAME = 'auth_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

const cookieOptions = {
  // Cookie will only be sent over HTTPS in production
  secure: process.env.NODE_ENV === 'production',
  // Cookie cannot be accessed by JavaScript (protects against XSS)
  httpOnly: true,
  // Restrict cookie to this domain only
  sameSite: 'strict' as const,
  // Cookie expiration (7 days)
  maxAge: 60 * 60 * 24 * 7,
  // Cookie path
  path: '/'
};

// Auth token options (same as cookieOptions - 7 days)
const authTokenOptions = {
  ...cookieOptions
  // Using the same expiration as cookieOptions (7 days)
};

/**
 * Sets the authentication token as an HTTP-only cookie and in userStore
 */
export function setAuthCookie(token: string) {
  if (process.client) {
    // Store in userStore for faster access
    const userStore = useUserStore();
    userStore.setUserAuthToken(token);
  }
  
  // Set the HTTP-only cookie (this will work server-side in SSR mode)
  const authCookie = useCookie(AUTH_COOKIE_NAME, authTokenOptions);
  authCookie.value = token;
  
  // Set a client-accessible cookie for cross-tab authentication
  const clientAuthCookie = useCookie('client_auth_token', {
    ...authTokenOptions,
    httpOnly: false // Make it accessible to JavaScript
  });
  clientAuthCookie.value = token;
}

/**
 * Sets the refresh token as an HTTP-only cookie with longer expiration
 */
export function setRefreshCookie(token: string) {
  const refreshCookie = useCookie(REFRESH_COOKIE_NAME, cookieOptions);
  refreshCookie.value = token;
}

/**
 * Gets the authentication token from userStore, sessionStorage, or cookie
 */
export function getAuthToken(): string | null {
  if (process.client) {
    // Try to get from userStore first
    const userStore = useUserStore();
    if (userStore.getUserAuthToken) {
      return userStore.getUserAuthToken;
    }
    
    // Try to get from client-accessible cookie
    const clientAuthCookie = useCookie('client_auth_token');
    if (clientAuthCookie.value) {
      console.log('getting auth token from client cookie')
      // Store in userStore for future use
      userStore.setUserAuthToken(clientAuthCookie.value);
      return clientAuthCookie.value;
    }
  }
  
  // Get from HTTP-only cookie
  const authCookie = useCookie(AUTH_COOKIE_NAME);
  const token = authCookie.value || null;
  
  // Store in userStore if found
  if (token && process.client) {
    const userStore = useUserStore();
    userStore.setUserAuthToken(token);
  }
  
  return token;
}

/**
 * Removes all authentication cookies and storage
 */
export function clearAuthCookies() {
  if (process.client) {
    // Clear from userStore
    const userStore = useUserStore();
    userStore.setUserAuthToken(null);
  }
  
  // Clear all auth cookies
  const authCookie = useCookie(AUTH_COOKIE_NAME);
  const refreshCookie = useCookie(REFRESH_COOKIE_NAME);
  const clientAuthCookie = useCookie('client_auth_token');
  
  authCookie.value = null;
  refreshCookie.value = null;
  clientAuthCookie.value = null;
}