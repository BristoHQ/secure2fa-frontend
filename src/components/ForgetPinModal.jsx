import React, { useState } from "react";
import { pinAPI } from "../services/api";
import OTPInput from "./OTPInput";
import "../styles/components/ForgetPinModal.css";

const ForgetPinModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset PIN
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  // Reset modal state when opened/closed
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setOtp("");
      setNewPin("");
      setConfirmPin("");
      setRecoveryToken("");
      setMaskedEmail("");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await pinAPI.sendRecoveryOTP();
      setMaskedEmail(response.email);
      setSuccess(response.message);
      setStep(2);
    } catch (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await pinAPI.verifyRecoveryOTP(otp);
      setRecoveryToken(response.recoveryToken);
      setSuccess(response.message);
      setStep(3);
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async () => {
    if (newPin.length !== 6) {
      setError("PIN must be exactly 6 digits");
      return;
    }

    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await pinAPI.resetPinWithToken(recoveryToken, newPin);
      setSuccess(response.message);

      // Wait a moment then close and notify parent
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to reset PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handlePinChange = (e, setter) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setter(value);
  };

  if (!isOpen) return null;

  return (
    <div className="forget-pin-modal">
      <div className="modal-header">
        <h2>Forget PIN Recovery</h2>
        <button
          className="close-button"
          onClick={handleClose}
          disabled={loading}
        >
          ×
        </button>
      </div>

      <div className="modal-body">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <label>Send OTP</label>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <label>Verify OTP</label>
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <label>Reset PIN</label>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="alert alert-error">
            <i className="ri-error-warning-line"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <i className="ri-checkbox-circle-line"></i>
            {success}
          </div>
        )}

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <div className="step-content">
            <div className="step-info">
              <i className="ri-mail-send-line step-icon"></i>
              <h3>Send Recovery OTP</h3>
              <p>
                We'll send a 6-digit verification code to your registered email
                address. This code will be valid for 10 minutes.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP to Email"}
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="step-content">
            <div className="step-info">
              <i className="ri-shield-check-line step-icon"></i>
              <h3>Verify OTP</h3>
              <p>
                Enter the 6-digit verification code sent to{" "}
                <strong>{maskedEmail}</strong>
              </p>
            </div>
            <div className="form-group">
              <label>Enter OTP Code</label>
              <OTPInput
                length={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={loading}
              />
              <small>Code expires in 10 minutes</small>
            </div>
            <div className="button-group">
              <button
                className="secondary-button"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="primary-button"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reset PIN */}
        {step === 3 && (
          <div className="step-content">
            <div className="step-info">
              <i className="ri-lock-password-line step-icon"></i>
              <h3>Set New PIN</h3>
              <p>Create a new 6-digit PIN for your SecureTOTP account.</p>
            </div>
            <div className="form-group">
              <label>New PIN</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => handlePinChange(e, setNewPin)}
                placeholder="000000"
                className="pin-input"
                maxLength="6"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => handlePinChange(e, setConfirmPin)}
                placeholder="000000"
                className="pin-input"
                maxLength="6"
                autoComplete="new-password"
              />
            </div>
            <div className="button-group">
              <button
                className="secondary-button"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="primary-button"
                onClick={handleResetPin}
                disabled={
                  loading || newPin.length !== 6 || confirmPin.length !== 6
                }
              >
                {loading ? "Resetting..." : "Reset PIN"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPinModal;
