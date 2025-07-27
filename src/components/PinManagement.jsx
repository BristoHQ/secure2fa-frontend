import React from "react";
import ForgetPinButton from "./ForgetPinButton";
import "../styles/components/PinManagement.css";

const PinManagement = ({ onPinReset }) => {
  return (
    <div className="pin-management-card">
      <div className="pin-management-header">
        <h3>PIN Management</h3>
        <p>Manage your SecureTOTP PIN settings</p>
      </div>

      <div className="pin-actions-list">
        <div className="pin-action-item">
          <div className="action-info">
            <i className="ri-lock-password-line"></i>
            <div>
              <h4>Change PIN</h4>
              <p>Update your current PIN</p>
            </div>
          </div>
          <button className="action-button">
            <i className="ri-edit-line"></i>
            Change
          </button>
        </div>

        <div className="pin-action-item">
          <div className="action-info">
            <i className="ri-lock-unlock-line"></i>
            <div>
              <h4>Forgot PIN</h4>
              <p>Reset your PIN via email verification</p>
            </div>
          </div>
          <ForgetPinButton variant="button" onSuccess={onPinReset} />
        </div>

        <div className="pin-action-item">
          <div className="action-info">
            <i className="ri-delete-bin-line"></i>
            <div>
              <h4>Remove PIN</h4>
              <p>Disable PIN protection (not recommended)</p>
            </div>
          </div>
          <button className="action-button danger">
            <i className="ri-delete-bin-line"></i>
            Remove
          </button>
        </div>
      </div>

      <div className="pin-security-info">
        <i className="ri-shield-check-line"></i>
        <p>Your PIN protects access to your 2FA tokens and sensitive data.</p>
      </div>
    </div>
  );
};

export default PinManagement;
