import React from "react";
import { useSearchParams, Link } from "react-router-dom";

const ResetPasswordTest = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "50px auto",
        background: "#f5f5f5",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Password Reset Token Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <strong>Current URL:</strong>
        <div
          style={{
            background: "#e9e9e9",
            padding: "10px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
            wordBreak: "break-all",
          }}
        >
          {window.location.href}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>Token Status:</strong>
        <div
          style={{
            padding: "10px",
            borderRadius: "4px",
            background: token ? "#d4edda" : "#f8d7da",
            color: token ? "#155724" : "#721c24",
          }}
        >
          {token ? "✅ Token Found" : "❌ No Token"}
        </div>
      </div>

      {token && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Token Value:</strong>
          <div
            style={{
              background: "#e9e9e9",
              padding: "10px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px",
              wordBreak: "break-all",
            }}
          >
            {token}
          </div>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>Test URLs:</h3>
        <ul>
          <li>
            <Link to="/forgot-password">Request Password Reset</Link>
          </li>
          <li>
            <Link to="/forgot-password?token=test123">
              Reset with Test Token
            </Link>
          </li>
          <li>
            <Link to="/reset-password?token=test123">
              Reset via /reset-password (should work)
            </Link>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        <Link
          to="/forgot-password"
          style={{
            background: "#007bff",
            color: "white",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Go to Password Reset Page
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordTest;
