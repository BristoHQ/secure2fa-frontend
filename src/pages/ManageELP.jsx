import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/components/ManageELP.css";

const ManageELP = () => {
  const [elpData, setElpData] = useState({
    hasELP: false,
    elpFile: null,
    fileName: null,
    fileSize: null,
    createdAt: null,
    downloadUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    // Check if user has existing ELP data
    checkExistingELP();
  }, []);

  const checkExistingELP = async () => {
    setLoading(true);
    try {
      // Check if user has an existing ELP
      const response = await fetch("http://localhost:8080/api/v1/elp/status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setElpData({
          hasELP: data.hasELP || false,
          elpFile: null,
          fileName: data.fileName || null
        });
      } else {
        // No ELP exists
        setElpData({
          hasELP: false,
          elpFile: null,
          fileName: null
        });
      }
    } catch (error) {
      console.error("Failed to check ELP status:", error);
      setElpData({
        hasELP: false,
        elpFile: null,
        fileName: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateELP = () => {
    navigate("/elp-generate");
  };

  const deleteELP = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/elp/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setElpData({
          hasELP: false,
          elpFile: null,
          fileName: null
        });
      }
    } catch (error) {
      console.error("Failed to delete ELP:", error);
      alert("Failed to delete ELP. Please try again.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };


  const renderSkeletonContent = () => (
    <div className="elp-content">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="elp-section skeleton-section">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      ))}
    </div>
  );

  const renderNoELP = () => (
    <div className="elp-content">
      <div className="elp-section">
        <div className="elp-status no-elp">
          <div className="status-icon">
            <i className="ri-shield-cross-line"></i>
          </div>
          <h3>No Emergency Login Package</h3>
          <p>
            You haven't generated an Emergency Login Package (ELP) yet. ELP is
            an encrypted file that contains your authentication data and
            provides a secure backup method to access your account.
          </p>
        </div>

        <div className="elp-benefits">
          <h4>Benefits of Emergency Login Package:</h4>
          <ul>
            <li>
              <i className="ri-check-line"></i> Encrypted file with your auth
              data
            </li>
           
            <li>
              <i className="ri-check-line"></i> Can be stored on external
              devices
            </li>
            <li>
              <i className="ri-check-line"></i> Login from any device with the
              file
            </li>
          </ul>
        </div>

        <div className="elp-actions-section">
          <button className="create-elp-btn" onClick={handleGenerateELP}>
            <i className="ri-download-cloud-line"></i>
            Generate Emergency Login Package
          </button>

          <div className="elp-info">
            <p>
              <i className="ri-information-line"></i>
              Click to generate and download your ELP file securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveELP = () => (
    <div className="elp-content">
      <div className="elp-section">
        <div className="elp-status active">
          <div className="status-icon">
            <i className="ri-shield-check-line"></i>
          </div>
          <h3>Emergency Login Package Active</h3>
          <p>
            Your Emergency Login Package is ready. This encrypted file contains
            your authentication data and can be used to login from any device.
          </p>
        </div>

        <div className="elp-details">
          <div className="detail-item">
            <span className="label">File Name:</span>
            <code className="elp-code">{elpData.fileName}</code>
            <button className="copy-btn" title="Copy File Name">
              <i className="ri-clipboard-line"></i>
            </button>
          </div>

       
        </div>

        <div className="elp-warning">
          <i className="ri-alert-line"></i>
          <div>
            <strong>Important:</strong> Store this ELP file securely on multiple
            devices or storage locations. Keep it safe as it contains encrypted
            access to your account.
          </div>
        </div>

        <div className="elp-actions">
          {/* <button className="download-btn" onClick={downloadELP}>
            <i className="ri-download-line"></i>
            Download ELP File
          </button> */}

          <button className="regenerate-btn" onClick={handleGenerateELP}>
            <i className="ri-refresh-line"></i>
            Regenerate ELP
          </button>

          <button
            className="delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <i className="ri-delete-bin-line"></i>
            Delete ELP
          </button>
        </div>
      </div>
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
          <div className="elp-container">
            <div className="elp-header">
              <h1>Manage Emergency Login Protection</h1>
              <p>Secure backup authentication for emergency access</p>
            </div>

            {loading
              ? renderSkeletonContent()
              : elpData.hasELP
              ? renderActiveELP()
              : renderNoELP()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">
              <i className="ri-alert-line"></i>
            </div>
            <h3>Delete Emergency Login Package?</h3>
            <p>
              Are you sure you want to delete your Emergency Login Package? This
              will permanently remove your encrypted backup file.
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={deleteELP}>
                Delete ELP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageELP;
