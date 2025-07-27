import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/components/Inbox.css";

const Inbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: "security",
          title: "Security Update Available",
          message:
            "A new security update is available for Secure2FA. Please update to ensure your account remains protected.",

          priority: "high",
          sender: "Secure2FA Security Team",
        },
        {
          id: 2,
          type: "backup",
          title: "Weekly Backup Reminder",
          message:
            "Don't forget to create a backup of your TOTP accounts. Regular backups help protect your data.",

          priority: "normal",
          sender: "Secure2FA Backup Service",
        },
        {
          id: 3,
          type: "system",
          title: "New Feature: Enhanced ELP",
          message:
            "Emergency Login Protection has been enhanced with new security features. Check out the improvements.",

          priority: "normal",
          sender: "Secure2FA Product Team",
        },
        {
          id: 4,
          type: "security",
          title: "Account Security Scan Complete",
          message:
            "Your account security scan is complete. No issues were found. Your TOTP accounts are secure.",

          priority: "normal",
          sender: "Secure2FA Security Scanner",
        },
        {
          id: 5,
          type: "welcome",
          title: "Welcome to Secure2FA",
          message:
            "Welcome to Secure2FA! We're excited to help you secure your digital accounts with our advanced 2FA solution.",

          priority: "normal",
          sender: "Secure2FA Team",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "security") return notif.type === "security";
    return true;
  });

  const renderSkeletonNotifications = () => (
    <div className="notifications-list">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="notification-item skeleton-notification">
          <div className="notification-icon skeleton skeleton-shimmer"></div>
          <div className="notification-content">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-subtitle"></div>
          </div>
          <div className="notification-actions">
            <div className="skeleton skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {sidebarActive && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}
      <Sidebar isActive={sidebarActive} />
      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content">
          <div className="inbox-container">
            <div className="inbox-header">
              <h1>Inbox</h1>
              <div className="inbox-filters">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filter === "security" ? "active" : ""}
                  onClick={() => setFilter("security")}
                >
                  Security
                </button>
              </div>
            </div>

            {loading ? (
              renderSkeletonNotifications()
            ) : (
              <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                  <div className="empty-state">
                    <i className="ri-mail-line"></i>
                    <h3>No notifications</h3>
                    <p>You're all caught up!</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.priority}`}
                    >
                      <div className={`notification-icon ${notification.type}`}>
                        <i
                          className={
                            notification.type === "security"
                              ? "ri-shield-line"
                              : notification.type === "backup"
                              ? "ri-cloud-line"
                              : "ri-information-line"
                          }
                        ></i>
                      </div>
                      <div className="notification-content">
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <span className="time">{notification.time}</span>
                      </div>
                      <div className="notification-actions">
                        <button
                          className="delete"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inbox;
