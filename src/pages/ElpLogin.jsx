import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/components/ElpLogin.css";

const ElpLogin = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setError("");

    if (!file) return;

    // Check file extension
    if (!file.name.endsWith(".elp") && !file.name.endsWith(".enc")) {
      setError("Please select a valid ELP file (.elp or .enc format)");
      return;
    }

    // Check file size (should be reasonable for an ELP file)
    if (file.size > 1024 * 1024) {
      // 1MB limit
      setError("ELP file seems too large. Please check if it's a valid file.");
      return;
    }

    if (file.size < 100) {
      // Minimum size check
      setError("ELP file seems too small. Please check if it's a valid file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleElpLogin = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select an ELP file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8080/api/v1/elp/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token (assuming the API returns a token)
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          navigate("/dashboard");
        } else {
          setError("Login successful but no token received");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to authenticate with ELP file");
      }
    } catch (err) {
      console.log(err);

      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="elp-login-container">
      <div className="elp-login-card">
        <div className="elp-header">
          <div className="elp-icon">
            <i className="ri-file-shield-2-fill"></i>
          </div>
          <h1 className="elp-title">Emergency Login</h1>
          <p className="elp-subtitle">
            Use your Emergency Login Package (.elp) file
          </p>
        </div>

        {/* Security Disclaimer */}
        <div className="security-disclaimer">
          <div className="disclaimer-header">
            <i className="ri-alert-fill"></i>
            <h3>Security Warning</h3>
          </div>
          <div className="disclaimer-content">
            <ul>
              <li>
                <strong>Keep your .elp file secure</strong> - Never share it
                with anyone
              </li>
              <li>
                <strong>Do not edit or rename</strong> the file - It will become
                invalid
              </li>
              <li>
                <strong>Store safely</strong> - Keep it in a secure location
              </li>
              <li>
                <strong>One-time use</strong> - Generate a new one after each
                use
              </li>
            </ul>
          </div>
        </div>

        <form className="elp-form" onSubmit={handleElpLogin}>
          <div className="file-upload-section">
            <div
              className={`file-drop-zone ${dragActive ? "active" : ""} ${
                selectedFile ? "has-file" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="elp-file"
                className="file-input"
                accept=".elp,.enc"
                onChange={handleFileChange}
              />

              {selectedFile ? (
                <div className="file-selected">
                  <i className="ri-file-check-fill"></i>
                  <div className="file-info">
                    <p className="file-name">{selectedFile.name}</p>
                    <p className="file-size">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => setSelectedFile(null)}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ) : (
                <label htmlFor="elp-file" className="file-drop-label">
                  <i className="ri-upload-cloud-2-line"></i>
                  <div className="drop-text">
                    <p>
                      <strong>Click to select</strong> or drag & drop your .elp
                      file
                    </p>
                    <p className="drop-hint">Only .elp files are accepted</p>
                  </div>
                </label>
              )}
            </div>

            {error && (
              <div className="error-message">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`elp-login-button ${isLoading ? "btn-loading" : ""}`}
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner">
                  <i className="ri-loader-4-line rotating"></i>
                </div>
                <span className="btn-text">Processing ELP file</span>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </>
            ) : (
              <>
                <i className="ri-key-2-fill"></i>
                Login with ELP
              </>
            )}
          </button>
        </form>

        <div className="elp-footer">
          <div className="back-link">
            <a href="/login">
              <i className="ri-arrow-left-line"></i>
              Back to regular login
            </a>
          </div>

          <div className="help-text">
            <p>
              Don't have an .elp file?{" "}
              <a href="/elp-generate">Generate one here</a>
            </p>
          </div>
        </div>

        <div className="security-info">
          <i className="ri-shield-keyhole-line"></i>
          <span>
            ELP files are AES-256 encrypted and contain your emergency access
            keys
          </span>
        </div>
      </div>
    </div>
  );
};

export default ElpLogin;
