// Utility functions for JWT token handling

/**
 * Extract user information from JWT token
 * @param {string} token - JWT token
 * @returns {object|null} User information or null if invalid
 */
export const getUserInfoFromToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      username: payload.sub || payload.username || payload.preferred_username,
      email: payload.email,
      userId: payload.sub,
      displayName:
        payload.name || payload.displayName || payload.preferred_username,
      fullName: payload.name,
    };
  } catch {
    return null;
  }
};

/**
 * Check if JWT token is valid and not expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is valid
 */
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

/**
 * Get token expiration date
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
};

/**
 * Clean up localStorage by removing insecure user data
 * Only keep the auth token
 */
export const cleanupLocalStorage = () => {
  // Remove insecure user data, keep only the token
  localStorage.removeItem("userEmail");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("displayName");
  localStorage.removeItem("fullName");
};
