import { useState, useEffect } from "react";
import { pinAPI } from "../services/api";

// Hook to check if user has PIN setup
export const usePinStatus = () => {
  const [hasPinSetup, setHasPinSetup] = useState(null); // null = loading, true/false = result
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        console.log("🔍 Checking PIN status...");
        // Use the new checkPinExists method for reliable PIN status
        const result = await pinAPI.checkPinExists();
        console.log("📋 PIN status result:", result);
         // Reset reminder status
         if( result.exists) {
          localStorage.removeItem("pinReminderDismissed");
         } else {
           localStorage.setItem("pinReminderDismissed", "true");
        }
        setHasPinSetup(result.exists);
        console.log(
          "🎯 PIN setup status:",
          result.exists ? "✅ Has PIN" : "❌ No PIN"
        );
      } catch (error) {
        console.error("❌ Error checking PIN status:", error);
        // For errors, assume PIN doesn't exist to be safe
        setHasPinSetup(false);
        console.log("🎯 PIN setup status (error fallback): ❌ No PIN");
      } finally {
        setLoading(false);
      }
    };

    checkPinStatus();
  }, []);

  return { hasPinSetup, loading };
};

// Utility function to check if reminder should be shown
export const shouldShowPinReminder = () => {
  console.log("🔔 Checking if PIN reminder should be shown...");

  // Check if user dismissed the reminder permanently
  const dismissed = localStorage.getItem("pinReminderDismissed");
  console.log("📝 PIN reminder dismissed status:", dismissed);
  if (dismissed === "true") {
    console.log("🚫 PIN reminder was permanently dismissed");
    return false;
  }

  // Check if user set a reminder time and it hasn't passed yet
  const reminderTime = localStorage.getItem("pinReminderTime");
  console.log("⏰ PIN reminder time:", reminderTime);
  if (reminderTime) {
    const currentTime = new Date().getTime();
    const reminderTimestamp = parseInt(reminderTime);
    console.log(
      "🕐 Current time:",
      currentTime,
      "Reminder time:",
      reminderTimestamp
    );
    if (currentTime < reminderTimestamp) {
      console.log("⏳ Still within reminder delay period");
      return false; // Still within reminder delay
    }
  }

  console.log("✅ PIN reminder should be shown");
  return true;
};

// Utility function to reset PIN reminder settings (for debugging)
export const resetPinReminderSettings = () => {
  console.log("🔄 Resetting PIN reminder settings...");
  localStorage.removeItem("pinReminderDismissed");
  localStorage.removeItem("pinReminderTime");
  console.log("✅ PIN reminder settings reset");
};
