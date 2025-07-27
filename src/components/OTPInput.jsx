import React, { useState, useRef, useEffect } from "react";
import "../styles/components/OTPInput.css";

const OTPInput = ({ length = 6, value, onChange, disabled = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const otpArray = value.split("").slice(0, length);
      while (otpArray.length < length) {
        otpArray.push("");
      }
      setOtp(otpArray);
    }
  }, [value, length]);

  const handleChange = (index, digit) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Call onChange with joined string
    onChange?.(newOtp.join(""));

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        // Clear current digit
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle paste
    else if (e.key === "Enter") {
      e.preventDefault();
      // Could trigger submit if OTP is complete
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const digits = paste.replace(/\D/g, "").split("").slice(0, length);

    const newOtp = Array(length).fill("");
    digits.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    // Focus appropriate input
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleFocus = (index) => {
    // Select all text when focused
    inputRefs.current[index]?.select();
  };

  return (
    <div className="otp-input-container">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className="otp-digit"
          maxLength={1}
          autoComplete="off"
          inputMode="numeric"
        />
      ))}
    </div>
  );
};

export default OTPInput;
