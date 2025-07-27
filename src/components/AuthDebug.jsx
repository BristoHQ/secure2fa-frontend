import { useState, useEffect } from "react";

// Debug component to show authentication status
const AuthDebug = () => {
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    let tokenInfo = {};
    let userInfo = {};

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;
        tokenInfo = {
          valid: payload.exp > currentTime,
          expired: payload.exp <= currentTime,
          expiresAt: new Date(payload.exp * 1000).toLocaleString(),
        };

        // Extract user info from token payload
        userInfo = {
          username:
            payload.sub || payload.username || payload.preferred_username,
          email: payload.email,
          userId: payload.sub,
          displayName: payload.name || payload.displayName,
        };
      } catch {
        tokenInfo = { error: "Invalid token format" };
      }
    }

    setAuthInfo({
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      tokenInfo,
      userInfo,
    });
  }, []);

  // Only show in development mode (you can toggle this manually for debugging)
  const isDevelopment = true; // Change to false to hide

  if (!isDevelopment) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 10000,
        maxWidth: "300px",
      }}
    >
      <h4>Auth Debug Info</h4>
      <div>Has Token: {authInfo.hasToken ? "✅" : "❌"}</div>
      <div>Token: {authInfo.tokenPreview || "None"}</div>
      <div>Email: {authInfo.userInfo?.email || "None"}</div>
      <div>Username: {authInfo.userInfo?.username || "None"}</div>
      <div>User ID: {authInfo.userInfo?.userId || "None"}</div>
      <div>Display Name: {authInfo.userInfo?.displayName || "None"}</div>
      {authInfo.tokenInfo && (
        <div>
          <div>Token Valid: {authInfo.tokenInfo.valid ? "✅" : "❌"}</div>
          <div>Expires: {authInfo.tokenInfo.expiresAt}</div>
          {authInfo.tokenInfo.error && (
            <div style={{ color: "red" }}>
              Error: {authInfo.tokenInfo.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
