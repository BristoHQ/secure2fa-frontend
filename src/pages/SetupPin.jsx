import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pinAPI } from "../services/api";
import OTPInput from "../components/OTPInput";
import Skeleton from "../components/Skeleton";
import "../styles/pages/SetupPin.css";

const SetupPin = () => {
  const [step, setStep] = useState(1); // 1: Create PIN, 2: Confirm PIN
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Auto-navigate to dashboard after successful PIN setup
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handlePinChange = (value) => {
    setPin(value);
    setError("");
  };

  const handleConfirmPinChange = (value) => {
    setConfirmPin(value);
    setError("");
  };

  const handleNextStep = () => {
    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError("PIN must contain only numbers");
      return;
    }

    setStep(2);
  };

  const handleCreatePin = async () => {
    if (confirmPin.length !== 6) {
      setError("Please confirm your 6-digit PIN");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await pinAPI.createPin(pin);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to create PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setConfirmPin("");
    setError("");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (success) {
    return (
      <div className="setup-pin-container">
        <div className="setup-pin-card success-card">
          <div className="success-icon">
            <i className="ri-shield-check-fill"></i>
          </div>
          <h1>PIN Created Successfully!</h1>
          <p>Your account is now secured with a PIN.</p>
          <div className="success-message">
            <i className="ri-check-line"></i>
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-pin-container">
      <div className="setup-pin-card">
        <div className="setup-header">
          <div className="security-icon">
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <h1>Setup Security PIN</h1>
          <p>
            {step === 1
              ? "Create a 6-digit PIN to secure your TOTP tokens"
              : "Confirm your PIN to complete setup"}
          </p>
        </div>

        <div className="setup-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: step === 1 ? "50%" : "100%" }}
            ></div>
          </div>
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span>1</span>
              <label>Create PIN</label>
            </div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span>2</span>
              <label>Confirm PIN</label>
            </div>
          </div>
        </div>

        <div className="setup-form">
          {step === 1 ? (
            <div className="pin-input-section">
              <label>Enter your 6-digit PIN</label>
              <OTPInput
                length={6}
                value={pin}
                onChange={handlePinChange}
                disabled={isLoading}
              />
              <div className="pin-requirements">
                <h4>PIN Requirements:</h4>
                <ul>
                  <li className={pin.length === 6 ? "valid" : ""}>
                    <i
                      className={
                        pin.length === 6 ? "ri-check-line" : "ri-close-line"
                      }
                    ></i>
                    <span>Must be exactly 6 digits</span>
                  </li>
                  <li
                    className={
                      /^\d*$/.test(pin) && pin.length > 0 ? "valid" : ""
                    }
                  >
                    <i
                      className={
                        /^\d*$/.test(pin) && pin.length > 0
                          ? "ri-check-line"
                          : "ri-close-line"
                      }
                    ></i>
                    <span>Numbers only (0-9)</span>
                  </li>
                  <li
                    className={
                      !/(.)\1{2,}/.test(pin) && pin.length > 0 ? "valid" : ""
                    }
                  >
                    <i
                      className={
                        !/(.)\1{2,}/.test(pin) && pin.length > 0
                          ? "ri-check-line"
                          : "ri-close-line"
                      }
                    ></i>
                    <span>Avoid repeating digits (e.g., 111111)</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="pin-input-section">
              <label>Confirm your 6-digit PIN</label>
              <OTPInput
                length={6}
                value={confirmPin}
                onChange={handleConfirmPinChange}
                disabled={isLoading}
              />
              <div className="pin-match-indicator">
                {confirmPin.length === 6 && (
                  <div
                    className={`match-status ${
                      pin === confirmPin ? "match" : "no-match"
                    }`}
                  >
                    <i
                      className={
                        pin === confirmPin ? "ri-check-line" : "ri-close-line"
                      }
                    ></i>
                    <span>
                      {pin === confirmPin ? "PINs match!" : "PINs do not match"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <div className="setup-actions">
            {step === 1 ? (
              <>
                <button
                  className="next-button"
                  onClick={handleNextStep}
                  disabled={pin.length !== 6 || isLoading}
                >
                  <i className="ri-arrow-right-line"></i>
                  Continue
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  <i className="ri-close-line"></i>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="create-button"
                  onClick={handleCreatePin}
                  disabled={
                    confirmPin.length !== 6 || pin !== confirmPin || isLoading
                  }
                >
                  {isLoading ? (
                    <>
                      <Skeleton width="20px" height="20px" />
                      <span>Creating PIN...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line"></i>
                      Create PIN
                    </>
                  )}
                </button>
                <button
                  className="back-button"
                  onClick={handleBackToStep1}
                  disabled={isLoading}
                >
                  <i className="ri-arrow-left-line"></i>
                  Back
                </button>
              </>
            )}
          </div>
        </div>

        <div className="setup-footer">
          <div className="security-notice">
            <i className="ri-information-line"></i>
            <div>
              <strong>Important:</strong>
              <p>
                Your PIN cannot be recovered if forgotten. Make sure to remember
                it or use the "Forgot PIN" feature which requires email
                verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPin;
