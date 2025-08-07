import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/PinSetupModal.css";

const PinSetupModal = ({ isOpen, onClose, message, actionType = "setup" }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSetupPin = () => {
    setLoading(true);
    // Navigate to PIN setup page
    navigate("/setup-pin");
    onClose();
  };

  const getModalContent = () => {
    switch (actionType) {
      case "addToken":
        return {
          title: "PIN Required to Add Token",
          description: "You need to setup a PIN before adding TOTP tokens.",
          icon: "ri-shield-keyhole-line",
          warning:
            "Security tokens require PIN protection to ensure your accounts remain secure.",
        };
      case "accessTokens":
        return {
          title: "PIN Required for Access",
          description:
            "You need to setup a PIN before accessing your TOTP tokens.",
          icon: "ri-lock-line",
          warning: "Your tokens are protected and require PIN authentication.",
        };
      default:
        return {
          title: "Setup Security PIN",
          description:
            "Secure your account with a PIN for enhanced protection.",
          icon: "ri-shield-keyhole-line",
          warning: "A PIN is required to use SecureTOTP features.",
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="pin-setup-modal-overlay">
      <div className="pin-setup-modal">
        <div className="pin-setup-header">
          <div className="warning-icon">
            <i className={content.icon}></i>
          </div>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>

        <div className="pin-setup-content">
          <div className="security-warning">
            <div className="warning-box">
              <i className="ri-error-warning-line"></i>
              <div>
                <strong>Security Notice:</strong>
                <p>{content.warning}</p>
                {message && <p className="custom-message">{message}</p>}
              </div>
            </div>
          </div>

          <div className="security-benefits">
            <h3>Why PIN is Required:</h3>
            <ul>
              <li>
                <i className="ri-shield-check-line"></i>
                <span>Protects your 2FA tokens from unauthorized access</span>
              </li>
              {/* <li>
                <i className="ri-lock-line"></i>
                <span>Ensures device security even if compromised</span>
              </li>
              <li>
                <i className="ri-key-2-line"></i>
                <span>Required for Emergency Login Package (ELP)</span>
              </li> */}
              <li>
                <i className="ri-time-line"></i>
                <span>Quick setup - takes less than 2 minutes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pin-setup-actions">
          <button
            className={`setup-pin-btn ${loading ? "btn-loading" : ""}`}
            onClick={handleSetupPin}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner">
                  <i className="ri-loader-4-line rotating"></i>
                </div>
                <span className="btn-text">Redirecting</span>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </>
            ) : (
              <>
                <i className="ri-shield-keyhole-fill"></i>
                Setup PIN Now
              </>
            )}
          </button>

          <button className="cancel-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
            Cancel
          </button>
        </div>

        <div className="pin-setup-footer">
          <div className="security-info">
            <i className="ri-information-line"></i>
            <span>
              Your PIN is stored securely and cannot be recovered. Make sure to
              remember it.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSetupModal;
