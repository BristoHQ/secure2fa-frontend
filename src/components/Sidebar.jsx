import "../styles/components/Sidebar.css";
import Avatar from "../assets/defualt-user-av.webp";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { authAPI, userAPI } from "../services/api";
import { useState, useEffect } from "react";
import { getUserInfoFromToken, cleanupLocalStorage } from "../utils/tokenUtils";

export default function Sidebar({ isActive }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try to get both user endpoints
        let currentUser = null;
        let userInfo = null;

        try {
          currentUser = await userAPI.getCurrentUser();
        } catch (error) {
          console.error("Error fetching current user:", error);
        }

        try {
          userInfo = await userAPI.getUserInfo();
        } catch (error) {
          console.error("Error fetching user info:", error);
        }

        // Merge and prioritize the data
        if (currentUser || userInfo) {
          const mergedData = {
            username: currentUser?.username || "",
            email: currentUser?.email || "",
            fullName:
              currentUser?.fullName ||
              userInfo?.fullName ||
              userInfo?.displayName ||
              currentUser?.displayName ||
              "",
            displayName:
              currentUser?.fullName ||
              userInfo?.fullName ||
              userInfo?.displayName ||
              currentUser?.displayName ||
              "",
            userAvatar:
              currentUser?.userAvatar ||
              userInfo?.userAvatar ||
              userInfo?.avatar ||
              null,
          };
          setUserData(mergedData);
        } else {
          throw new Error("Could not fetch user data from either endpoint");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        console.error("Error details:", error.message);

        // Check if it's an authentication error
        if (error.message && error.message.includes("Authentication failed")) {
          // Clear all auth data and redirect to login
          cleanupLocalStorage();
          navigate("/login");
          return;
        }

        // Try to get user data from JWT token as fallback
        const tokenUserInfo = getUserInfoFromToken();
        const fallbackData = {
          username:
            tokenUserInfo?.username ||
            tokenUserInfo?.preferred_username ||
            "Unknown",
          email: tokenUserInfo?.email || "unknown@example.com",
          displayName:
            tokenUserInfo?.fullName ||
            tokenUserInfo?.name ||
            tokenUserInfo?.username ||
            tokenUserInfo?.preferred_username ||
            "Unknown",
          userAvatar: null, // No avatar in token
        };

        setUserData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/login");
    } catch (error) {
      // Even if API call fails, clear local storage and redirect
      console.error("Logout error:", error);
      authAPI.logout(); // This clears localStorage
      navigate("/login");
    }
  };

  return (
    <>
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="user-profile">
          {/* src={userData?.userAvatar || userData?.avatar || Avatar} */}
          <img
            src={userData?.userAvatar || userData?.avatar || Avatar}
            alt="User Profile"
            onError={(e) => {
              e.target.src = Avatar; // Fallback to default avatar if image fails to load
            }}
          />
          <div className="user-info">
            {loading ? (
              <>
                <div className="skeleton-text skeleton-name"></div>
                <div className="skeleton-text skeleton-email"></div>
              </>
            ) : (
              <>
                <h2>
                  {userData?.displayName ||
                    userData?.fullName ||
                    userData?.username ||
                    "Unknown"}
                </h2>
                <p>{userData?.email || "unknown@example.com"}</p>
              </>
            )}
          </div>
        </div>

        <span className="encryption-info">
          Secure2FA End-to-End Encryption <i className="ri-lock-star-line"></i>
        </span>

        <div className="divider"></div>
        <div className="lists">
          <ul>
            <li>
              <Link
                to="/inbox"
                className={`nav-link ${
                  location.pathname === "/inbox" ? "active" : ""
                }`}
              >
                <i className="ri-inbox-2-line"></i> Inbox
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`nav-link ${
                  location.pathname === "/dashboard" ? "active" : ""
                }`}
              >
                <i className="ri-dashboard-line"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/add-token"
                className={`nav-link ${
                  location.pathname === "/add-token" ? "active" : ""
                }`}
              >
                <i className="ri-add-line"></i> Add Token
              </Link>
            </li>
            <li>
              <Link
                to="/manage-elp"
                className={`nav-link ${
                  location.pathname === "/manage-elp" ? "active" : ""
                }`}
              >
                <i className="ri-error-warning-line"></i> Manage ELP
              </Link>
            </li>
              <li>
              <Link
                to="/support"
                className={`nav-link ${
                  location.pathname === "/support" ? "active" : ""
                }`}
              >
                <i className="ri-database-2-line"></i> Support/Help
              </Link>
            </li>
            {/* <li>
              <Link
                to="/backup-restore"
                className={`nav-link ${
                  location.pathname === "/backup-restore" ? "active" : ""
                }`}
              >
                <i className="ri-database-2-line"></i> Backup/Restore
              </Link>
            </li> */}
            <li>
              <Link
                to="/appearance"
                className={`nav-link ${
                  location.pathname === "/appearance" ? "active" : ""
                }`}
              >
                <i className="ri-contrast-2-line"></i> Appearance
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`nav-link ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
              >
                <i className="ri-settings-4-line"></i> Profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="logout">
          <button className="logout-button" onClick={handleLogout}>
            <i className="ri-logout-box-r-line"></i> Logout
          </button>
        </div>
      </div>
    </>
  );
}
