// apiUtils.js
import { refreshAccessToken, isTokenExpired } from '../utils/tokenutills.js';

export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = localStorage.getItem('access_token');

  // Check if the access token is expired
  if (accessToken && isTokenExpired(accessToken)) {
    // If the access token is expired, refresh the token
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw new Error('Failed to refresh access token');
    }
  }

  // Add the access token to the request headers
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  // Proceed with the fetch request
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.ok) {
      return response.json(); // Return the response as JSON
    }

    // Handle 401 Unauthorized error: Try to refresh token and retry
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return fetchWithAuth(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      }
    }

    // Handle other non-200 status codes
    const errorMessage = await response.text(); // Get the error message from the response body
    throw new Error(`Request failed with status ${response.status}: ${errorMessage}`);
  } catch (error) {
    // Catch any other errors (e.g., network issues)
    console.error('Error in fetchWithAuth:', error);
    throw new Error(error.message || 'An unknown error occurred');
  }
};
