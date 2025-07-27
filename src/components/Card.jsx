import React, { useState, useEffect } from "react";
import "../styles/components/Card.css";

export default function Card(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Timer countdown animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 30; // Reset to 30 when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle TOTP visibility
  const handleViewToggle = () => {
    setIsVisible(!isVisible);
  };

  // Copy TOTP to clipboard
  const handleCopy = async () => {
    // Prevent copying if TOTP is blurred/hidden
    if (!isVisible) {
      console.log("Cannot copy: TOTP is hidden. Please make it visible first.");
      return;
    }

    const totpCode = (props.totp || "12 34 56").replace(/\s/g, ""); // Remove spaces

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(totpCode);
      } else {
        // Fallback for mobile/older browsers
        const textArea = document.createElement("textarea");
        textArea.value = totpCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      // Show success message
      setShowCopiedMessage(true);
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000); // Hide after 2 seconds

      console.log("TOTP copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Show error message (you could add error state here)
    }
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    setShowDeletePopup(false);
    // Call the onRemove function passed as prop
    if (props.onRemove) {
      props.onRemove();
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  return (
    <>
      <div className="card">
        <div className="upper">
          <div className="icon">
            <img
              src={
                props.icon ||
                "https://imgs.search.brave.com/GxVOq9xuqtiB4Tpa8JJxeWKumoDP0A9x9UXm7yU0e4A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDMu/ZGVwb3NpdHBob3Rv/cy5jb20vMTAwMTg2/MC8xNjM3NS9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzE2Mzc1NzYz/Mi1zdG9jay1waG90/by1hbWF6b24tbG9n/by1vbi1hLXdoaXRl/LmpwZw"
              }
              alt="Card Icon"
            />
          </div>
          <div className="info">
            <div className="account">{props.account || "Amazon"}</div>
            <div className="name">{props.name || "manish kumar"}</div>
            <div className={`totp ${!isVisible ? "blurred" : ""}`}>
              {props.totp || "12 34 56"}
            </div>
          </div>
          <div className="timer">
            <svg className="timer-circle" viewBox="0 0 36 36">
              <path
                className="timer-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="timer-progress"
                strokeDasharray={`${(timer / 30) * 100}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="time">{timer}</div>
          </div>
        </div>
        <div className="lower">
          <div className="actions">
            <div className="view" onClick={handleViewToggle}>
              <i className={isVisible ? "ri-eye-line" : "ri-eye-off-line"}></i>
            </div>
            <div
              className={`copy ${!isVisible ? "disabled" : ""}`}
              onClick={handleCopy}
              title={
                !isVisible ? "Make TOTP visible to copy" : "Copy TOTP code"
              }
            >
              <i className="ri-clipboard-line"></i>
            </div>
          </div>
          <div className="delete" onClick={handleDelete}>
            <i className="ri-delete-bin-line"></i>
          </div>
        </div>
      </div>

      {/* Copied Message Toast */}
      {showCopiedMessage && (
        <div className="copied-toast">
          <i className="ri-check-line"></i>
          <span>Code copied to clipboard!</span>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <div className="popup-icon">
              <i className="ri-delete-bin-line"></i>
            </div>
            <h3>Delete 2FA Token</h3>
            <p>
              Are you sure you want to delete the 2FA token for{" "}
              <strong>{props.account || "this account"}</strong>?
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="popup-actions">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
