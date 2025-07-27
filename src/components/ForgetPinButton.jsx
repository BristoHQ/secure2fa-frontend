import React, { useState } from "react";
import ForgetPinModal from "./ForgetPinModal";
import "../styles/components/ForgetPinButton.css";

const ForgetPinButton = ({
  className = "",
  variant = "link", // "button" | "link" | "text"
  onSuccess,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setShowModal(false);
    onSuccess?.();
  };

  const buttonClass = `forget-pin-btn forget-pin-btn--${variant} ${className}`;

  return (
    <>
      <button
        className={buttonClass}
        onClick={() => setShowModal(true)}
        disabled={disabled}
        type="button"
      >
        <i className="ri-lock-unlock-line"></i>
        Forgot PIN?
      </button>

      <ForgetPinModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default ForgetPinButton;
