import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/components/BackupRestore.css";

const BackupRestore = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <>
      {sidebarActive && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}
      <Sidebar isActive={sidebarActive} />
      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content">
          <div className="backup-container">
            <div className="backup-header">
              <h1>Feature Unavailable</h1>
              <p>This feature has been temporarily disabled</p>
            </div>

            <div className="feature-disabled-content">
              <div className="disabled-section">
                <div className="disabled-icon">
                  <i className="ri-settings-3-line"></i>
                </div>
                <h3>Backup & Restore Feature Disabled</h3>
                <p>
                  The backup and restore functionality is currently unavailable.
                  This feature has been temporarily disabled for maintenance and
                  security improvements.
                </p>

                <div className="alternative-info">
                  <h4>Alternative Data Protection Methods:</h4>
                  <ul>
                    <li>
                      <i className="ri-shield-check-line"></i>
                      <span>
                        Use Emergency Login Protection (ELP) for account
                        recovery
                      </span>
                    </li>
                    <li>
                      <i className="ri-key-2-line"></i>
                      <span>Keep secure records of your TOTP secret keys</span>
                    </li>
                    <li>
                      <i className="ri-smartphone-line"></i>
                      <span>Register multiple trusted devices for 2FA</span>
                    </li>
                    <li>
                      <i className="ri-download-cloud-line"></i>
                      <span>Manually export your TOTP codes when needed</span>
                    </li>
                  </ul>
                </div>

                <div className="recommendation-card">
                  <div className="recommendation-icon">
                    <i className="ri-lightbulb-line"></i>
                  </div>
                  <div className="recommendation-content">
                    <h4>Recommended Action</h4>
                    <p>
                      Set up Emergency Login Protection to ensure you can always
                      regain access to your account. Visit the Manage ELP
                      section to configure this secure backup authentication
                      method.
                    </p>
                    <a href="/manage-elp" className="elp-link">
                      <i className="ri-arrow-right-line"></i>
                      Go to Emergency Login Protection
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackupRestore;
