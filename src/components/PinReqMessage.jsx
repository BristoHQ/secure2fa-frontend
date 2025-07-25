import React, { useState } from "react";
import "../styles/components/PinReqMessage.css";

export default function PinReqMessage({ onPinVerified }) {
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const CORRECT_PIN = "123456"; // In real app, this would come from secure storage

  const handleUnlockClick = () => {
    setShowPinEntry(true);
    setError("");
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
    setError("");
  };

  const handleVerifyPin = () => {
    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }

    setIsLoading(true);

    // Simulate PIN verification delay
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        setError("");
        onPinVerified(pin); // Pass the PIN to parent component
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
      setIsLoading(false);
    }, 1000);
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

        <div className="pin-req-message">
          <p>
            Your 2FA tokens are encrypted and protected. Please enter your PIN
            to view your TOTP codes and sensitive authentication data.
          </p>
        </div>

        {!showPinEntry ? (
          <button className="unlock-btn" onClick={handleUnlockClick}>
            <i className="ri-lock-unlock-line"></i>
            Enter PIN to Unlock
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
                className="verify-btn"
                onClick={handleVerifyPin}
                disabled={isLoading || pin.length !== 6}
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line rotating"></i>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line"></i>
                    Verify PIN
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        <div className="warning-text">
          <i className="ri-information-line"></i>
          Keep your PIN secure and don't share it with anyone
        </div>
      </div>
    </>
  );
}
