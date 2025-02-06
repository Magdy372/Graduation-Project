// tokenUtils.js
import { jwtDecode } from "jwt-decode";

// Function to check if the token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Current time in seconds
  return decodedToken.exp < currentTime;
};

// Function to refresh access token
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    if (!refreshToken) {
        console.error("No refresh token available");
        return null;
    }

    try {
        const response = await fetch("http://localhost:8089/api/v1/auth/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`, // Add Bearer token to the request header
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            const { accessToken, refreshToken } = data; // Destructure the response data

            // Update both tokens in local storage with the new tokens
            localStorage.setItem("access_token", accessToken); // Update the access token
            localStorage.setItem("refresh_token", refreshToken); // Update the refresh token
            return accessToken; // Return the new access token
        } else {
            throw new Error("Failed to refresh token");
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
};

// tokenUtils.js
export const getRoleFromToken = (token) => {
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.roles; // Assuming the role is stored in the 'role' field of the JWT
  };
  
