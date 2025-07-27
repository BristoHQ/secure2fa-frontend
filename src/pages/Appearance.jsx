import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../hooks/useTheme";
import "../styles/components/Appearance.css";

const Appearance = () => {
  const { currentTheme, changeTheme, isLoading } = useTheme();
  const [loading, setLoading] = useState(true);
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    // Wait for theme to load, then simulate component loading
    if (!isLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [isLoading]);

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
  };

  const renderSkeletonSettings = () => (
    <div className="appearance-content">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="setting-group skeleton-section">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="theme-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton skeleton-theme-option"></div>
            ))}
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
          <div className="appearance-container">
            <div className="appearance-header">
              <h1>Appearance</h1>
              <p>Customize the look and feel of your Secure2FA experience</p>
            </div>

            {loading ? (
              renderSkeletonSettings()
            ) : (
              <div className="appearance-content">
                {/* Standard Themes Card */}
                <div className="appearance-section">
                  <div className="section-header">
                    <h3>Theme Selection</h3>
                    <p>Choose your preferred theme</p>
                  </div>

                  <div className="theme-grid three-columns">
                    <div
                      className={`theme-option ${
                        currentTheme === "system" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("system")}
                    >
                      <div className="theme-preview system-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>System Default</h4>
                        <p>Follows your system theme</p>
                      </div>
                    </div>

                    <div
                      className={`theme-option ${
                        currentTheme === "light" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <div className="theme-preview light-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Light Theme</h4>
                        <p>Clean and bright interface</p>
                      </div>
                    </div>

                    <div
                      className={`theme-option ${
                        currentTheme === "dark" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <div className="theme-preview dark-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Dark Theme</h4>
                        <p>Easy on the eyes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure2FA Custom Themes Card */}
                <div className="appearance-section">
                  <div className="section-header">
                    <h3>Secure2FA Themes</h3>
                    <p>Exclusive themes designed by our team</p>
                    <span className="badge">Made by Secure2FA</span>
                  </div>

                  <div className="theme-grid three-columns">
                    <div
                      className={`theme-option ${
                        currentTheme === "cyberpunk" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("cyberpunk")}
                    >
                      <div className="theme-preview cyberpunk-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Cyberpunk</h4>
                        <p>Neon-inspired security theme</p>
                      </div>
                    </div>

                    <div
                      className={`theme-option ${
                        currentTheme === "security" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("security")}
                    >
                      <div className="theme-preview security-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Security Pro</h4>
                        <p>Professional security interface</p>
                      </div>
                    </div>

                    <div
                      className={`theme-option ${
                        currentTheme === "ocean" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("ocean")}
                    >
                      <div className="theme-preview ocean-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Ocean Blue</h4>
                        <p>Deep ocean inspired theme</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Themes Section */}
                <div className="appearance-section">
                  <div className="section-header">
                    <h3>Nature Collection</h3>
                    <p>Themes inspired by nature</p>
                  </div>

                  <div className="theme-grid three-columns">
                    <div
                      className={`theme-option ${
                        currentTheme === "forest" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("forest")}
                    >
                      <div className="theme-preview forest-preview">
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Forest Green</h4>
                        <p>Nature inspired security</p>
                      </div>
                    </div>

                    <div className="theme-option coming-soon">
                      <div className="theme-preview coming-soon-preview">
                        <div className="preview-overlay">
                          <i className="ri-time-line"></i>
                          <span>Coming Soon</span>
                        </div>
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>More Themes</h4>
                        <p>Additional themes coming soon</p>
                      </div>
                    </div>

                    <div className="theme-option coming-soon">
                      <div className="theme-preview coming-soon-preview">
                        <div className="preview-overlay">
                          <i className="ri-palette-line"></i>
                          <span>Custom</span>
                        </div>
                        <div className="preview-header"></div>
                        <div className="preview-content">
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>Custom Theme</h4>
                        <p>Create your own theme</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appearance;
