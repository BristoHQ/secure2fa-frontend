import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/PinSetupReminder.css";

const PinSetupReminder = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSetupNow = () => {
    setLoading(true);
    // Navigate to PIN setup (you can adjust this route as needed)
    navigate("/setup-account");
    onClose();
  };

  const handleRemindLater = () => {
    // Set a reminder in localStorage to show again after some time
    const reminderTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem("pinReminderTime", reminderTime.toString());
    onClose();
  };

  const handleDismiss = () => {
    // User chose to dismiss permanently
    localStorage.setItem("pinReminderDismissed", "true");
    onClose();
  };

  return (
    <div className="pin-reminder-overlay">
      <div className="pin-reminder-modal">
        <div className="pin-reminder-header">
          <div className="warning-icon">
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <h2>Secure Your Account with PIN</h2>
          <p>Your account is not fully secured yet!</p>
        </div>

        <div className="pin-reminder-content">
          <div className="security-benefits">
            <h3>Why PIN Setup is Important:</h3>
            <ul>
              <li>
                <i className="ri-shield-check-line"></i>
                <span>Extra layer of security for your tokens</span>
              </li>
              <li>
                <i className="ri-lock-line"></i>
                <span>Protects against unauthorized access</span>
              </li>
              <li>
                <i className="ri-key-2-line"></i>
                <span>Required for Emergency Login Password (ELP)</span>
              </li>
              <li>
                <i className="ri-time-line"></i>
                <span>Takes less than 2 minutes to setup</span>
              </li>
            </ul>
          </div>

          <div className="security-warning">
            <div className="warning-box">
              <i className="ri-error-warning-line"></i>
              <div>
                <strong>Security Risk:</strong>
                <p>
                  Without a PIN, your 2FA tokens are vulnerable if someone gains
                  access to your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pin-reminder-actions">
          <button
            className="setup-now-btn"
            onClick={handleSetupNow}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line rotating"></i>
                Setting up...
              </>
            ) : (
              <>
                <i className="ri-shield-keyhole-fill"></i>
                Setup PIN Now (Recommended)
              </>
            )}
          </button>

          <div className="secondary-actions">
            <button className="remind-later-btn" onClick={handleRemindLater}>
              <i className="ri-time-line"></i>
              Remind me in 24 hours
            </button>

            <button className="dismiss-btn" onClick={handleDismiss}>
              <i className="ri-close-line"></i>
              Don't show again
            </button>
          </div>
        </div>

        <div className="pin-reminder-footer">
          <div className="security-info">
            <i className="ri-information-line"></i>
            <span>You can always setup PIN later from Settings → Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSetupReminder;
