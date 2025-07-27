import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { totpAPI, pinAPI } from "../services/api";
import Skeleton from "../components/Skeleton";
import PinSetupModal from "../components/PinSetupModal";
import "../styles/components/AddToken.css";

const AddToken = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    totpSecret: "",
    issuer: "",
    nickname: "",
    customIssuer: "",
    customLogo: null,
  });
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [customLogoFile, setCustomLogoFile] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPinSetupModal, setShowPinSetupModal] = useState(false);
  const [pinExists, setPinExists] = useState(false);

  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const qrInputRef = useRef(null);

  // Function to check PIN status
  const checkPinStatus = async () => {
    try {
      const result = await pinAPI.checkPinExists();
      setPinExists(result.exists);
      return result.exists;
    } catch (error) {
      console.error("Error checking PIN status:", error);
      setPinExists(false);
      return false;
    }
  };

  // Check if PIN exists when component mounts
  useEffect(() => {
    const initPinCheck = async () => {
      const exists = await checkPinStatus();
      if (!exists) {
        setShowPinSetupModal(true);
      }
    };

    initPinCheck();
  }, []);

  // Auto-navigate to dashboard after successful token addition
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000); // Navigate after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Function to compress image file
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Helper function to handle image loading errors
  const handleImageError = (e, fallbackText, fontSize = "16px") => {
    if (e.target && e.target.parentElement) {
      e.target.style.display = "none";
      const parent = e.target.parentElement;
      parent.innerHTML = fallbackText;
      parent.style.color = "#fff";
      parent.style.display = "flex";
      parent.style.alignItems = "center";
      parent.style.justifyContent = "center";
      parent.style.fontSize = fontSize;
      parent.style.fontWeight = "bold";
    }
  };

  const defaultIssuers = [
    {
      name: "GitHub",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
      color: "#333",
    },
    {
      name: "Google",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg",
      color: "#4285f4",
    },
    {
      name: "Microsoft",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg",
      color: "#00a1f1",
    },
    {
      name: "Twitter",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg",
      color: "#1da1f2",
    },
    {
      name: "Facebook",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg",
      color: "#4267b2",
    },
    {
      name: "LinkedIn",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
      color: "#0077b5",
    },
    {
      name: "Discord",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg",
      color: "#5865f2",
    },
    {
      name: "Steam",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/steam.svg",
      color: "#171a21",
    },
    {
      name: "Dropbox",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/dropbox.svg",
      color: "#0061ff",
    },
    {
      name: "Amazon",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg",
      color: "#ff9900",
    },
    {
      name: "Cloudflare",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cloudflare.svg",
      color: "#f38020",
    },
    {
      name: "Binance",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/binance.svg",
      color: "#f0b90b",
    },
    {
      name: "Custom",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/circle.svg",
      color: "#666",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Auto-select logo when issuer is chosen
    if (field === "issuer" && value !== "Custom") {
      const issuer = defaultIssuers.find((i) => i.name === value);
      setSelectedLogo(issuer);
    }
  };

  const handleQrUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setQrImage(e.target.result);
          // Simulate QR code processing
          setIsProcessing(true);
          setTimeout(() => {
            setFormData((prev) => ({
              ...prev,
              totpSecret: "JBSWY3DPEHPK3PXP",
              issuer: "GitHub",
              nickname: "My GitHub Account",
            }));
            setSelectedLogo(defaultIssuers.find((i) => i.name === "GitHub"));
            setIsProcessing(false);
          }, 2000);
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({
          ...prev,
          qr: "Please upload a valid image file",
        }));
      }
    }
  };

  const handleCustomLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        // Check file size (limit to 10MB for original, will compress if needed)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            logo: `File too large. Please select an image smaller than 10MB. Current size: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)}MB`,
          }));
          return;
        }

        try {
          // Compress image if it's larger than 2MB
          let processedFile = file;
          if (file.size > 2 * 1024 * 1024) {
            setIsProcessing(true);
            processedFile = await compressImage(file, 800, 0.8);
            setIsProcessing(false);
          }

          // Store the processed file object for upload
          setCustomLogoFile(processedFile);

          // Create preview using FileReader
          const reader = new FileReader();
          reader.onload = (e) => {
            setFormData((prev) => ({ ...prev, customLogo: e.target.result }));
            setSelectedLogo({
              name: "Custom",
              logo: e.target.result,
              color: "#666",
              isCustom: true,
            });
          };
          reader.readAsDataURL(processedFile);
        } catch (error) {
          console.error("Image processing failed:", error);
          setErrors((prev) => ({
            ...prev,
            logo: "Failed to process image. Please try a different file.",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          logo: "Please upload a valid image file (JPG, PNG, GIF, WebP)",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.totpSecret.trim()) {
      newErrors.totpSecret = "TOTP secret is required";
    } else if (formData.totpSecret.length < 16) {
      newErrors.totpSecret = "TOTP secret must be at least 16 characters";
    }

    if (!formData.issuer && !formData.customIssuer.trim()) {
      newErrors.issuer = "Please select or enter an issuer";
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      setApiError("");

      try {
        // Determine the issuer name and logo URL
        const issuerName =
          formData.issuer === "Custom"
            ? formData.customIssuer
            : formData.issuer;

        let logoUrl = null;

        // Handle logo upload for custom logos
        if (formData.issuer === "Custom" && customLogoFile) {
          try {
            // Upload the custom logo file first
            const uploadResponse = await totpAPI.uploadLogo(customLogoFile);
            if (uploadResponse.success) {
              logoUrl = uploadResponse.url;
            } else {
              throw new Error(uploadResponse.error || "Failed to upload logo");
            }
          } catch (uploadError) {
            console.error("Logo upload failed:", uploadError);

            // Handle specific error types
            if (
              uploadError.message.includes("413") ||
              uploadError.message.includes("Content Too Large") ||
              uploadError.message.includes("File too large")
            ) {
              setApiError(
                `Logo file is too large. Please use an image smaller than 5MB.`
              );
              setIsProcessing(false);
              return;
            } else if (
              uploadError.message.includes("CORS") ||
              uploadError.message.includes("fetch") ||
              uploadError.message.includes("Failed to fetch")
            ) {
              setApiError(
                `Network error: Unable to connect to the server. Please ensure the SecureTOTP backend is running on http://localhost:8080 and CORS is properly configured.`
              );
              setIsProcessing(false);
              return;
            } else if (
              uploadError.message.includes("415") ||
              uploadError.message.includes("Unsupported")
            ) {
              setApiError(
                `Unsupported file format. Please use JPG, PNG, GIF, or WebP images.`
              );
              setIsProcessing(false);
              return;
            } else {
              // Continue without logo for other upload errors
              setApiError(
                `Warning: Logo upload failed (${uploadError.message}). Token will be created without logo.`
              );
            }
          }
        } else if (formData.issuer !== "Custom" && selectedLogo) {
          // For default issuers, use the predefined logo URL
          logoUrl = selectedLogo.logo;
        }

        // Call the TOTP API to add the account
        await totpAPI.addAccount(
          formData.nickname,
          issuerName,
          formData.totpSecret,
          logoUrl
        );

        setIsProcessing(false);
        setShowSuccess(true);
      } catch (error) {
        setIsProcessing(false);
        setApiError(error.message || "Failed to add token. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      totpSecret: "",
      issuer: "",
      nickname: "",
      customIssuer: "",
      customLogo: null,
    });
    setSelectedLogo(null);
    setCustomLogoFile(null);
    setQrImage(null);
    setActiveTab("manual");
    setShowSuccess(false);
    setErrors({});
  };

  if (showSuccess) {
    return (
      <div className="add-token-container">
        <div className="add-token-card">
          <div className="success-section">
            <i className="fas fa-check-circle success-icon"></i>
            <h1>Token Added Successfully!</h1>
            <p>Your new TOTP token has been added to your account</p>

            <div className="token-preview">
              <div className="token-logo">
                {selectedLogo?.isCustom ? (
                  <img src={selectedLogo.logo} alt="Custom logo" />
                ) : selectedLogo ? (
                  <div
                    className="success-logo-container"
                    style={{ backgroundColor: selectedLogo.color }}
                  >
                    <img
                      src={selectedLogo.logo}
                      alt={`${selectedLogo.name} logo`}
                      className="success-logo-img"
                      onError={(e) =>
                        handleImageError(e, selectedLogo.name.charAt(0), "24px")
                      }
                    />
                  </div>
                ) : (
                  <span>🔐</span>
                )}
              </div>
              <div className="token-info">
                <h3>{formData.nickname}</h3>
                <p>{formData.issuer || formData.customIssuer}</p>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/dashboard" className="dashboard-button">
                <i className="fas fa-home"></i>
                Go to Dashboard
              </Link>
              <button onClick={resetForm} className="add-another-button">
                <i className="fas fa-plus"></i>
                Add Another Token
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-token-container">
      <div className="add-token-card">
        <div className="add-token-header">
          <i className="fas fa-plus-circle add-icon"></i>
          <h1>Add New Token</h1>
          <p>Add a new TOTP token to your account</p>
        </div>

        <div className="method-tabs">
          <button
            className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            <i className="fas fa-keyboard"></i>
            Manual Entry
          </button>
          <button
            className={`tab-button ${activeTab === "qr" ? "active" : ""}`}
            onClick={() => setActiveTab("qr")}
          >
            <i className="fas fa-qrcode"></i>
            QR Code
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-token-form">
          {activeTab === "qr" && (
            <div className="qr-section">
              <div className="qr-upload-area">
                {qrImage ? (
                  <div className="qr-preview">
                    <img src={qrImage} alt="QR Code" />
                    <div className="qr-overlay">
                      {isProcessing ? (
                        <div className="processing">
                          <Skeleton width="24px" height="24px" />
                          <Skeleton variant="text" width="120px" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setQrImage(null)}
                          className="remove-qr"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="qr-drop-zone"
                    onClick={() => qrInputRef.current?.click()}
                  >
                    <i className="fas fa-qrcode"></i>
                    <h3>Upload QR Code</h3>
                    <p>Click to upload or drag and drop a QR code image</p>
                    <span className="file-hint">Supports JPG, PNG, WebP</span>
                  </div>
                )}
                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="hidden-input"
                />
              </div>
              {errors.qr && <div className="error-message">{errors.qr}</div>}
            </div>
          )}

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="totpSecret">
                <i className="fas fa-key"></i>
                TOTP Secret Key
              </label>
              <input
                type="text"
                id="totpSecret"
                value={formData.totpSecret}
                onChange={(e) =>
                  handleInputChange("totpSecret", e.target.value)
                }
                placeholder="Enter your TOTP secret key"
                className={`form-input ${errors.totpSecret ? "error" : ""}`}
                disabled={isProcessing}
              />
              {errors.totpSecret && (
                <div className="error-message">{errors.totpSecret}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-building"></i>
                Issuer
              </label>
              <div className="issuer-selection">
                <div className="issuer-grid">
                  {defaultIssuers.map((issuer) => (
                    <button
                      key={issuer.name}
                      type="button"
                      className={`issuer-card ${
                        formData.issuer === issuer.name ? "selected" : ""
                      }`}
                      onClick={() => handleInputChange("issuer", issuer.name)}
                      disabled={isProcessing}
                    >
                      <div
                        className="issuer-logo"
                        style={{ backgroundColor: issuer.color }}
                      >
                        <img
                          src={issuer.logo}
                          alt={`${issuer.name} logo`}
                          className="issuer-logo-img"
                          onError={(e) =>
                            handleImageError(e, issuer.name.charAt(0), "16px")
                          }
                        />
                      </div>
                      <span>{issuer.name}</span>
                    </button>
                  ))}
                </div>

                {formData.issuer === "Custom" && (
                  <input
                    type="text"
                    value={formData.customIssuer}
                    onChange={(e) =>
                      handleInputChange("customIssuer", e.target.value)
                    }
                    placeholder="Enter custom issuer name"
                    className="form-input custom-issuer-input"
                    disabled={isProcessing}
                  />
                )}
              </div>
              {errors.issuer && (
                <div className="error-message">{errors.issuer}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nickname">
                <i className="fas fa-tag"></i>
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="Enter a nickname for this token"
                className={`form-input ${errors.nickname ? "error" : ""}`}
                disabled={isProcessing}
              />
              {errors.nickname && (
                <div className="error-message">{errors.nickname}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-image"></i>
                Logo
              </label>
              <div className="logo-section">
                <div className="current-logo">
                  <div className="logo-preview">
                    {selectedLogo ? (
                      selectedLogo.isCustom ? (
                        <img src={selectedLogo.logo} alt="Custom logo" />
                      ) : (
                        <div
                          className="preview-logo-container"
                          style={{ backgroundColor: selectedLogo.color }}
                        >
                          <img
                            src={selectedLogo.logo}
                            alt={`${selectedLogo.name} logo`}
                            className="preview-logo-img"
                            onError={(e) =>
                              handleImageError(
                                e,
                                selectedLogo.name.charAt(0),
                                "20px"
                              )
                            }
                          />
                        </div>
                      )
                    ) : (
                      <span>🔐</span>
                    )}
                  </div>
                  <div className="logo-info">
                    <span>{selectedLogo ? selectedLogo.name : "Default"}</span>
                    <small>Current logo</small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className={`upload-logo-button ${
                    isProcessing ? "btn-loading" : ""
                  }`}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="loading-spinner">
                        <i className="ri-loader-4-line rotating"></i>
                      </div>
                      <span className="btn-text">Processing Image</span>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload"></i>
                      Upload Custom Logo
                    </>
                  )}
                </button>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomLogoUpload}
                  className="hidden-input"
                />
              </div>
              {errors.logo && (
                <div className="error-message">{errors.logo}</div>
              )}
            </div>
          </div>

          {apiError && (
            <div className="api-error">
              <i className="fas fa-exclamation-triangle"></i>
              {apiError}
            </div>
          )}

          {!pinExists && (
            <div className="pin-required-message">
              <i className="fas fa-lock"></i>
              <span>Please setup a PIN before adding TOTP tokens</span>
              <button
                type="button"
                onClick={() => setShowPinSetupModal(true)}
                className="setup-pin-link"
              >
                Setup PIN
              </button>
            </div>
          )}

          <div className="form-actions">
            <Link to="/dashboard" className="cancel-button">
              <i className="fas fa-times"></i>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isProcessing || !pinExists}
              className={`submit-button ${isProcessing ? "btn-loading" : ""} ${
                !pinExists ? "btn-disabled" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="loading-spinner">
                    <i className="ri-loader-4-line rotating"></i>
                  </div>
                  <span className="btn-text">Adding Token</span>
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </>
              ) : !pinExists ? (
                <>
                  <i className="fas fa-lock"></i>
                  Setup PIN Required
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Add Token
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* PIN Setup Modal */}
      <PinSetupModal
        isOpen={showPinSetupModal}
        onClose={async () => {
          setShowPinSetupModal(false);
          // Recheck PIN status after modal closes
          await checkPinStatus();
        }}
        actionType="addToken"
        message="To ensure your TOTP tokens remain secure, you must setup a PIN before adding them."
      />
    </div>
  );
};

export default AddToken;
