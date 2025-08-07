import CryptoJS from "crypto-js";
const API_BASE_URL = "http://localhost:9000";

// Use CryptoJS to hash the pin and get the first 16 bytes as key
function getAesKey(pin) {
  const hash = CryptoJS.SHA256(pin);
  // Get first 16 bytes (32 hex chars) for AES-128
  return CryptoJS.enc.Hex.parse(
    hash.toString(CryptoJS.enc.Hex).substring(0, 32)
  );
}

function decryptAES(key, ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

// Helper function to clear auth and redirect to login
const clearAuthAndRedirect = () => {
  removeAuthToken();
  // Clear any other cached data
  if (typeof localStorage !== "undefined") {
    // Clear any cached user data or other app-specific data
    localStorage.removeItem("userData");
    localStorage.removeItem("userProfile");
    // Add any other app-specific cache clearing here
  }
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Expose a global function for developers to manually clear auth if user was deleted
if (typeof window !== "undefined") {
  window.clearAuthAndRedirect = clearAuthAndRedirect;
  window.clearDeletedUserAuth = () => {
    console.log("Clearing authentication for deleted user...");
    clearAuthAndRedirect();
  };
}

// Helper function to create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    // Handle authentication errors and user-not-found scenarios
    if (response.status === 401 || response.status === 403) {
      // Clear invalid token
      removeAuthToken();
      throw new Error("Authentication failed. Please login again.");
    }

    // Handle 500 errors that might indicate deleted user with valid token
    if (response.status === 500) {
      // Check if this is a user-related endpoint
      const url = response.url;
      if (url.includes("/users/me") || url.includes("/users/info")) {
        // This is likely a deleted user with valid token scenario
        clearAuthAndRedirect();
        throw new Error("User account not found. Please login again.");
      }
    }

    // Try to parse error response as JSON, fallback to text
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || `HTTP error! status: ${response.status}`;
    } catch {
      // If JSON parsing fails, try to get text response
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP error! status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }

  // Try to parse successful response as JSON
  try {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    throw new Error("Failed to read response");
  }
};

// Auth API endpoints
export const authAPI = {
  // Login user
  login: async (emailOrUsername, password) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: createHeaders(false),
      body: JSON.stringify({
        emailOrUsername,
        password,
      }),
    });

    console.log("Login request:", response);

    const data = await handleResponse(response);
    console.log("Login response data:", data);

    if (data.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  // Register user
  register: async (fullName, username, email, password, provider = "LOCAL") => {
    const requestBody = {
      fullName,
      username,
      email,
      password,
      provider,
    };

    console.log("Registration request:", requestBody);

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: createHeaders(false),
      body: JSON.stringify(requestBody),
    });

    console.log("Registration response status:", response.status);

    if (!response.ok) {
      // Log the response text for debugging
      const errorData = await response.json();
      console.error("Registration error response:", errorData);

      // Try to parse as JSON
      try {
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Registration failed with status ${response.status}`
        );
      } catch {
        throw new Error(
          errorData.message ||
            `Registration failed with status ${response.status}`
        );
      }
    }

    return handleResponse(response);
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: createHeaders(false),
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    return handleResponse(response);
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-otp`, {
      method: "POST",
      headers: createHeaders(false),
      body: JSON.stringify({
        email,
      }),
    });

    return handleResponse(response);
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: createHeaders(),
    });

    removeAuthToken();
    return handleResponse(response);
  },

  // Validate token
  validateToken: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/validateToken`, {
      method: "POST",
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/isLogin`, {
        method: "GET",
        headers: createHeaders(),
      });

      return response.ok;
    } catch {
      return false;
    }
  },

  // Reset password request
  resetPasswordRequest: async (email) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/reset-password?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",
        headers: createHeaders(false),
      }
    );

    return handleResponse(response);
  },

  // Reset password complete
  resetPassword: async (token, newPassword) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/reset-password?token=${encodeURIComponent(
        token
      )}&newPassword=${encodeURIComponent(newPassword)}`,
      {
        method: "POST",
        headers: createHeaders(false),
      }
    );

    return handleResponse(response);
  },

  // Get user by email or username
  getUserByEmailOrUsername: async (emailOrUsername) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/byEmailUsername/${encodeURIComponent(
        emailOrUsername
      )}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },
};

// User API endpoints
export const userAPI = {
  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: "GET",
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Get user info
  getUserInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/info`, {
      method: "GET",
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Update username
  updateUsername: async (username) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/username?username=${encodeURIComponent(
        username
      )}`,
      {
        method: "PUT",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update email
  updateEmail: async (email) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/email?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "PUT",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update full name
  updateFullName: async (fullName) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/fullname?fullName=${encodeURIComponent(
        fullName
      )}`,
      {
        method: "PUT",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update recovery phone
  updateRecoveryPhone: async (recoveryPhone) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/recovery-phone?recoveryPhone=${encodeURIComponent(
        recoveryPhone
      )}`,
      {
        method: "PUT",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update avatar
  updateAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const headers = {
      Authorization: `Bearer ${getAuthToken()}`,
    };

    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/avatar`,
      {
        method: "PUT",
        headers,
        body: formData,
      }
    );

    return handleResponse(response);
  },

  // Update individual profile fields
  updateProfileField: async (fieldData, avatar = null, banner = null) => {
    const formData = new FormData();
    let hasFiles = false;

    // Add files to FormData
    if (avatar) {
      formData.append("avatar", avatar);
      hasFiles = true;
    }
    if (banner) {
      formData.append("banner", banner);
      hasFiles = true;
    }

    // Add profile data as query parameters
    const queryParams = new URLSearchParams();
    Object.keys(fieldData).forEach((key) => {
      if (fieldData[key] !== null && fieldData[key] !== undefined) {
        queryParams.append(key, fieldData[key]);
      }
    });

    const headers = {
      Authorization: `Bearer ${getAuthToken()}`,
    };
    // Don't set Content-Type for FormData, let browser set it with boundary

    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/update?${queryParams.toString()}`,
      {
        method: "PUT",
        headers,
        body: hasFiles ? formData : undefined, // Only send formData if there are files
      }
    );

    return handleResponse(response);
  },

  // Update profile
  updateProfile: async (profileData, avatar = null, banner = null) => {
    const formData = new FormData();

    // Add profile data as query parameters
    const queryParams = new URLSearchParams();
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        queryParams.append(key, profileData[key]);
      }
    });

    // Add files to FormData
    if (avatar) {
      formData.append("avatar", avatar);
    }
    if (banner) {
      formData.append("banner", banner);
    }

    const headers = {
      Authorization: `Bearer ${getAuthToken()}`,
    };
    // Don't set Content-Type for FormData, let browser set it with boundary

    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/update?${queryParams.toString()}`,
      {
        method: "PUT",
        headers,
        body: formData,
      }
    );

    return handleResponse(response);
  },

  // Redeem premium code
  redeemPremium: async (code) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/redeem?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/profile/password?currentPassword=${encodeURIComponent(
        currentPassword
      )}&newPassword=${encodeURIComponent(newPassword)}`,
      {
        method: "PUT",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },
};

// Premium API endpoints
export const premiumAPI = {
  // Generate redeem code
  generateRedeemCode: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/premium/generate`, {
      method: "POST",
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Get all redeem codes
  getAllRedeemCodes: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/premium/code`, {
      method: "GET",
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Get specific redeem code
  getRedeemCode: async (code) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/premium/code/${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    return handleResponse(response);
  },
};

// SecureTOTP API endpoints (Base URL: http://localhost:8080)
const TOTP_BASE_URL = "http://localhost:8080";

// Helper function to create TOTP headers with auth token
const createTOTPHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function to handle TOTP API responses
const handleTOTPResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;

    // Handle specific error codes
    if (response.status === 413) {
      errorMessage = "File too large. Please use an image smaller than 5MB.";
    } else if (response.status === 415) {
      errorMessage =
        "Unsupported file type. Please use JPG, PNG, GIF, or WebP.";
    } else if (response.status === 401) {
      errorMessage = "Authentication failed. Please login again.";
    } else if (response.status === 403) {
      errorMessage =
        "Access denied. You don't have permission to perform this action.";
    } else {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP error! status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

// PIN Management API endpoints
export const pinAPI = {
  // Create user PIN
  createPin: async (pin) => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/pin/create-pin`, {
      method: "POST",
      headers: createTOTPHeaders(),
      body: JSON.stringify({ pin }),
    });

    return handleTOTPResponse(response);
  },

  // Get user PIN
  getPin: async () => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/pin/get-pin`, {
      method: "GET",
      headers: createTOTPHeaders(),
    });

    return handleTOTPResponse(response);
  },

  // Update PIN
  updatePin: async (oldPin, newPin) => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/pin/update-pin`, {
      method: "PUT",
      headers: createTOTPHeaders(),
      body: JSON.stringify({ oldPin, newPin }),
    });

    return handleTOTPResponse(response);
  },

  // Verify PIN
  verifyPin: async (pin) => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/pin/verify-pin`, {
      method: "POST",
      headers: createTOTPHeaders(),
      body: JSON.stringify({ pin }),
    });

    return handleTOTPResponse(response);
  },

  // Validate PIN (alias for verifyPin for compatibility)
  validatePIN: async (pin) => {
    return pinAPI.verifyPin(pin);
  },

  // Check if PIN exists
  // Note: This endpoint returns 404 when PIN doesn't exist, which is normal behavior
  // The browser console will show this 404 error, but it's handled gracefully by our code
  checkPinExists: async () => {
    try {
      const response = await fetch(`${TOTP_BASE_URL}/api/v1/pin/get-pin`, {
        method: "GET",
        headers: createTOTPHeaders(),
      });

      if (response.ok) {
        // PIN exists and we can read it
        try {
          const result = await response.json();
          return { exists: true, data: result };
        } catch {
          // Response was OK but couldn't parse JSON - still means PIN exists
          return { exists: true };
        }
      } else if (response.status === 404) {
        // 404 means PIN not found - this is expected when no PIN is set
        // The browser console will show this 404, but it's normal behavior
        return { exists: false };
      } else {
        // Other HTTP errors (401, 403, 500, etc.) - treat as no PIN to prompt setup
        return { exists: false };
      }
    } catch {
      // Network errors, CORS issues, etc. - assume no PIN to allow setup
      return { exists: false };
    }
  },

  // Delete PIN
  deletePin: async () => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/pin/delete-pin`, {
      method: "DELETE",
      headers: createTOTPHeaders(),
    });

    return handleTOTPResponse(response);
  },

  // Forget PIN - Send OTP for PIN recovery
  sendRecoveryOTP: async () => {
    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/forget-pin/send-otp`,
      {
        method: "POST",
        headers: createTOTPHeaders(),
      }
    );

    return handleTOTPResponse(response);
  },

  // Forget PIN - Verify OTP
  verifyRecoveryOTP: async (otp) => {
    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/forget-pin/verify-otp`,
      {
        method: "POST",
        headers: createTOTPHeaders(),
        body: JSON.stringify({ otp }),
      }
    );

    return handleTOTPResponse(response);
  },

  // Forget PIN - Reset PIN using recovery token
  resetPinWithToken: async (recoveryToken, newPin) => {
    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/forget-pin/reset-pin`,
      {
        method: "POST",
        headers: createTOTPHeaders(),
        body: JSON.stringify({ recoveryToken, newPin }),
      }
    );

    return handleTOTPResponse(response);
  },
};

// ELP (Encrypted Login Package) API endpoints
export const elpAPI = {
  // Generate ELP
  generateELP: async () => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/elp/generate`, {
      method: "POST",
      headers: createTOTPHeaders(),
    });

    return handleTOTPResponse(response);
  },

  // Upload ELP
  uploadELP: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${TOTP_BASE_URL}/api/v1/elp/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    return handleTOTPResponse(response);
  },
};

// Account/TOTP API endpoints
export const totpAPI = {
  // Get all accounts
  getAccounts: async (enteredPin) => {
    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/accounts?pin=${encodeURIComponent(enteredPin)}`,
      {
        method: "GET",
        headers: createTOTPHeaders(),
      }
    );
    let responseData = await handleTOTPResponse(response);
    console.log("Accounts response data:", responseData);

    const key = getAesKey(enteredPin);
    responseData.forEach((element) => {
      let code = decryptAES(key, element.code);
      element.code = code;
    });

    console.log("Decrypted accounts:", responseData);

    return responseData;
  },

  // Upload logo image
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/accounts/upload-logo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }
    );

    return handleTOTPResponse(response);
  },

  // Add new account
  addAccount: async (nickname, issuer, secret, logoUrl = null) => {
    const response = await fetch(`${TOTP_BASE_URL}/api/v1/accounts`, {
      method: "POST",
      headers: createTOTPHeaders(),
      body: JSON.stringify({
        nickname,
        issuer,
        secret,
        logoUrl,
      }),
    });

    return handleTOTPResponse(response);
  },

  // Get current TOTP codes
  getCurrentCodes: async (enteredPin) => {
    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/accounts/current-codes?pin=${encodeURIComponent(
        enteredPin
      )}`,
      {
        method: "GET",
        headers: createTOTPHeaders(),
      }
    );

    let responseData = await handleTOTPResponse(response);
    console.log("current-codes response data:", responseData);

    const key = getAesKey(enteredPin);
    responseData.forEach((element) => {
      let code = decryptAES(key, element.code);
      element.code = code;
    });

    console.log("Decrypted current-codes:", responseData);

    return responseData;
  },

  // Remove account
  removeAccount: async (issuer, nickname) => {
    const response = await fetch(
      `${TOTP_BASE_URL}/api/v1/accounts/account/${encodeURIComponent(
        issuer
      )}/${encodeURIComponent(nickname)}`,
      {
        method: "DELETE",
        headers: createTOTPHeaders(),
      }
    );

    return handleTOTPResponse(response);
  },
};

// Export helper functions
export { getAuthToken, setAuthToken, removeAuthToken, clearAuthAndRedirect };
