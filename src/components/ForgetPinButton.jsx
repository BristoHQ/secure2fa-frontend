import React, { useState } from "react";
import ForgetPinModal from "./ForgetPinModal";
import "../styles/components/ForgetPinButton.css";

const ForgetPinButton = ({
  className = "",
  variant = "link", // "button" | "link" | "text"
  onSuccess,
  onModalOpen,
  onModalClose,
  disabled = false,
  hideModal = false, // New prop to control whether to render the modal
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setShowModal(false);
    onModalClose?.();
    onSuccess?.();
  };

  const handleOpenModal = () => {
    setShowModal(true);
    onModalOpen?.();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onModalClose?.();
  };

  const buttonClass = `forget-pin-btn forget-pin-btn--${variant} ${className}`;

  return (
    <>
      <button
        className={buttonClass}
        onClick={handleOpenModal}
        disabled={disabled}
        type="button"
      >
        <i className="ri-lock-unlock-line"></i>
        Forgot PIN?
      </button>

      {!hideModal && (
        <ForgetPinModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default ForgetPinButton;
