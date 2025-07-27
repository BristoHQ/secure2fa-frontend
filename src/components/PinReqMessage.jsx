import React, { useState } from "react";
import { pinAPI } from "../services/api";
import ForgetPinButton from "./ForgetPinButton";
import PinSetupModal from "./PinSetupModal";
import "../styles/components/PinReqMessage.css";

export default function PinReqMessage({ onPinVerified }) {
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pinExists, setPinExists] = useState(null); // null = not checked, true = exists, false = doesn't exist
  const [showPinSetupModal, setShowPinSetupModal] = useState(false);
  const [checkingPin, setCheckingPin] = useState(false);

  const handleUnlockClick = async () => {
    // Check PIN status when user tries to unlock
    if (pinExists === null) {
      setCheckingPin(true);
      setError("");

      try {
        const result = await pinAPI.checkPinExists();
        setPinExists(result.exists);

        if (result.exists) {
          setShowPinEntry(true);
        } else {
          setShowPinSetupModal(true);
        }
      } catch (error) {
        console.error("Error checking PIN status:", error);
        setPinExists(false);
        setShowPinSetupModal(true);
      } finally {
        setCheckingPin(false);
      }
    } else if (pinExists) {
      setShowPinEntry(true);
      setError("");
    } else {
      setShowPinSetupModal(true);
    }
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
    setError("");
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting to verify PIN with length:", pin.length);
      await pinAPI.verifyPin(pin);
      console.log("PIN verification successful");
      onPinVerified(pin); // Pass the PIN to parent component
    } catch (error) {
      console.error("PIN verification error:", error);
      console.error("Error status:", error.status);
      console.error("Error message:", error.message);

      // Handle different types of errors
      let errorMessage = "Incorrect PIN. Please try again.";

      if (error.message) {
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          errorMessage = "Invalid PIN. Please check and try again.";
        } else if (error.message.includes("PIN not found")) {
          errorMessage = "No PIN found. Please set up a PIN first.";
        } else if (
          error.message.includes("PIN expired") ||
          error.message.includes("expired")
        ) {
          errorMessage = "PIN has expired. Please reset your PIN.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("Network")
        ) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          // Use the actual error message if it's user-friendly
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerifyPin();
    }
  };

  return (
    <>
      <div className="pin-req-card">
        <div className="lock-icon">
          <i className="ri-lock-star-fill"></i>
        </div>

        <div className="pin-req-header">
          <h3>Sensitive Content Protected</h3>
        </div>

        {checkingPin ? (
          <div className="pin-req-message">
            <div className="loading-text">
              <div className="loading-spinner">
                <i className="ri-loader-4-line rotating"></i>
              </div>
              <span>Checking PIN status</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        ) : pinExists === false ? (
          <div className="pin-req-message">
            <p>
              To secure your 2FA tokens, you need to setup a PIN first. This
              ensures your authentication data remains protected.
            </p>
            <button className="unlock-btn" onClick={handleUnlockClick}>
              <i className="ri-shield-keyhole-line"></i>
              Setup PIN Now
            </button>
          </div>
        ) : (
          <>
            <div className="pin-req-message">
              <p>
                Your 2FA tokens are encrypted and protected. Please enter your
                PIN to view your TOTP codes and sensitive authentication data.
              </p>
            </div>

            {!showPinEntry ? (
              <button className="unlock-btn" onClick={handleUnlockClick}>
                <i className="ri-unlock-line"></i>
                Enter PIN to Access
              </button>
            ) : (
              <div className="pin-entry-section">
                <div className="pin-input-container">
                  <input
                    type="password"
                    placeholder="Enter 6-digit PIN"
                    maxLength="6"
                    className="pin-input"
                    value={pin}
                    onChange={handlePinChange}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="error-message">
                    <i className="ri-error-warning-line"></i>
                    {error}
                  </div>
                )}
                <div className="pin-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowPinEntry(false);
                      setPin("");
                      setError("");
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`verify-btn ${isLoading ? "btn-loading" : ""}`}
                    onClick={handleVerifyPin}
                    disabled={isLoading || pin.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner">
                          <i className="ri-loader-4-line rotating"></i>
                        </div>
                        <span className="btn-text">Verifying</span>
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <i className="ri-check-line"></i>
                        Verify PIN
                      </>
                    )}
                  </button>
                </div>
                <div className="forget-pin-section">
                  <ForgetPinButton
                    variant="link"
                    onSuccess={() => {
                      // Reset the PIN entry form after successful PIN reset
                      setShowPinEntry(false);
                      setPin("");
                      setError("");
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="warning-text">
          <i className="ri-information-line"></i>
          Keep your PIN secure and don't share it with anyone
        </div>
      </div>

      {/* PIN Setup Modal */}
      <PinSetupModal
        isOpen={showPinSetupModal}
        onClose={() => {
          setShowPinSetupModal(false);
          // Refresh PIN status when modal is closed
          const checkPinStatus = async () => {
            try {
              setCheckingPin(true);
              const result = await pinAPI.checkPinExists();
              setPinExists(result.exists);
            } catch (error) {
              console.error("Error checking PIN status:", error);
              setPinExists(false);
            } finally {
              setCheckingPin(false);
            }
          };
          checkPinStatus();
        }}
        actionType="accessTokens"
        message="Setup a PIN to securely access your TOTP tokens and authentication data."
      />
    </>
  );
}
