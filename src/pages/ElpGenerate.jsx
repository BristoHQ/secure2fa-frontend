import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Skeleton from "../components/Skeleton";
import "../styles/components/ElpGenerate.css";

const ElpGenerate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerateElp = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/elp/generate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Backend sends JSON with filename and fileContent
        const responseData = await response.json();
        const fileName = responseData.filename || "emergency-login.elp";
        const fileContent = responseData.fileContent;

        console.log("Received filename:", fileName); // Debug log
        console.log("File content length:", fileContent?.length); // Debug log

        if (!fileContent) {
          setError("No file content received from server");
          setIsGenerating(false);
          return;
        }

        // Decode base64 content and create blob
        const binaryString = atob(fileContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/octet-stream" });
        const downloadUrl = URL.createObjectURL(blob);

        setGeneratedFile({
          name: fileName,
          size: `${(blob.size / 1024).toFixed(2)} KB`,
          date: new Date().toLocaleString(),
          blob: blob,
          downloadUrl: downloadUrl,
        });

        // Automatically download the file with backend-provided filename
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.click();

        setIsGenerating(false);
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to generate ELP file");
        setIsGenerating(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedFile && generatedFile.downloadUrl) {
      const link = document.createElement("a");
      link.href = generatedFile.downloadUrl;
      link.download = generatedFile.name;
      link.click();
    }
  };

  const resetGeneration = () => {
    setGeneratedFile(null);
    setShowSuccess(false);
    setError("");
  };

  const goBackToManage = () => {
    navigate("/manage-elp");
  };

  return (
    <>
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="elp-generate-container">
            <div className="elp-generate-card">
              <div className="elp-header">
                <button className="back-btn" onClick={goBackToManage}>
                  <i className="ri-arrow-left-line"></i>
                  Back to Manage ELP
                </button>
                <i
                  className={`fas fa-file-export elp-icon ${
                    isGenerating ? "rotating" : ""
                  }`}
                ></i>
                <h1 className="elp-title">Generate Emergency Login</h1>
                <p className="elp-subtitle">
                  Create a secure backup file for emergency access
                </p>
              </div>

              {error && (
                <div className="error-message">
                  <i className="ri-error-warning-line"></i>
                  {error}
                </div>
              )}

              <div className="security-warning">
                <div className="warning-header">
                  <i className="fas fa-exclamation-triangle"></i>
                  <h3>Important Security Information</h3>
                </div>
                <div className="warning-content">
                  <ul>
                    <li>
                      <strong>Store Safely:</strong> Keep your .elp file in a
                      secure location
                    </li>
                    <li>
                      <strong>Never Share:</strong> This file contains sensitive
                      account data
                    </li>
                    <li>
                      <strong>Backup Purpose:</strong> Use only when normal
                      login isn't possible
                    </li>
                    <li>
                      <strong>One-Time Use:</strong> Generate a new file after
                      each use
                    </li>
                  </ul>
                </div>
              </div>

              {!generatedFile ? (
                <div className="generation-section">
                  <div className="generation-info">
                    <h3>What is an Emergency Login Package (.elp)?</h3>
                    <p>
                      An Emergency Login Package is an encrypted file containing
                      your account recovery information. It allows you to regain
                      access to your account if you lose your primary
                      authentication methods.
                    </p>
                  </div>

                  <div className="generation-features">
                    <div className="feature-item">
                      <i className="fas fa-shield-alt"></i>
                      <span>256-bit AES Encryption</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-clock"></i>
                      <span>Valid for 30 days</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-key"></i>
                      <span>Single-use authorization</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateElp}
                    disabled={isGenerating}
                    className="generate-button"
                  >
                    {isGenerating ? (
                      <>
                        <Skeleton width="16px" height="16px" />
                        <Skeleton variant="text" width="150px" />
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-export"></i>
                        Generate Emergency Login Package
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="success-section">
                  {showSuccess && (
                    <div className="success-message">
                      <i className="fas fa-check-circle"></i>
                      <span>
                        Emergency Login Package generated successfully!
                      </span>
                    </div>
                  )}

                  <div className="file-generated">
                    <div className="file-info">
                      <i className="fas fa-file-shield"></i>
                      <div className="file-details">
                        <h3 className="file-name">{generatedFile.name}</h3>
                        <div className="file-meta">
                          <span className="file-size">
                            {generatedFile.size}
                          </span>
                          <span className="file-date">
                            Generated: {generatedFile.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        onClick={handleDownload}
                        className="download-button"
                      >
                        <i className="fas fa-download"></i>
                        Download ELP File
                      </button>
                      <button
                        onClick={resetGeneration}
                        className="generate-new-button"
                      >
                        <i className="fas fa-redo"></i>
                        Generate New
                      </button>
                    </div>
                  </div>

                  <div className="next-steps">
                    <h3>Next Steps:</h3>
                    <ol>
                      <li>Download the .elp file to a secure location</li>
                      <li>
                        Store it on a separate device or secure cloud storage
                      </li>
                      <li>Do not share this file with anyone</li>
                      <li>Use it only for emergency account recovery</li>
                    </ol>
                  </div>
                </div>
              )}

              <div className="elp-footer">
                <div className="back-link">
                  <Link to="/dashboard">
                    <i className="fas fa-arrow-left"></i>
                    Back to Dashboard
                  </Link>
                </div>

                <div className="help-info">
                  <p>
                    Need help? <Link to="/support">Contact Support</Link>
                  </p>
                </div>
              </div>

              <div className="security-reminder">
                <i className="fas fa-info-circle"></i>
                <span>
                  Remember: This file is as sensitive as your password. Keep it
                  secure!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElpGenerate;
