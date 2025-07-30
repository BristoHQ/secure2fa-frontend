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
  const [imageLoading, setImageLoading] = useState(true);

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
          console.error("Sidebar: Error fetching current user:", error);
        }

        try {
          userInfo = await userAPI.getUserInfo();
        } catch (error) {
          console.error("Sidebar: Error fetching user info:", error);
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
          setLoading(false); // Only set loading to false when we have data
        } else {
          console.warn("Sidebar: No user data from API, using fallback.");
          throw new Error("Could not fetch user data from either endpoint");
        }
      } catch (error) {
        console.error("Sidebar: Error fetching user data:", error);
        console.error("Sidebar: Error details:", error.message);

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
        setLoading(false); // Set loading to false after setting fallback data
      }
    };

    fetchUserData();
  }, [navigate]);

  // Reset image loading when userData changes, and handle cached images
  useEffect(() => {
    if (userData) {
      const avatarUrl = userData.userAvatar || userData.avatar;
      if (!avatarUrl) {
        setImageLoading(false);
        return;
      }
      setImageLoading(true);
      // Check if image is already cached (complete)
      const img = new window.Image();
      img.src = avatarUrl;
      if (img.complete) {
        setImageLoading(false);
      } else {
        img.onload = () => setImageLoading(false);
        img.onerror = () => setImageLoading(false);
      }
    }
  }, [userData]);

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
        <div className="upper-sidebar">
          <div className="user-profile">
            {loading || imageLoading ? (
              <>
                <span className="skeleton-avatar"></span>
                <div className="user-info">
                  <span className="skeleton-name skeleton-text"></span>
                  <span className="skeleton-email skeleton-text"></span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={userData?.userAvatar || userData?.avatar || Avatar}
                  alt="User Profile"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.src = Avatar;
                    setImageLoading(false);
                  }}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "inline-block",
                    verticalAlign: "top",
                    objectFit: "cover",
                    objectPosition: "center",
                    border: "2px solid rgba(255,255,255,0.1)",
                    margin: 0,
                    padding: 0,
                    transition: "opacity 0.3s ease",
                    opacity: 1,
                  }}
                />
                <div className="user-info">
                  <h2>
                    {userData?.displayName ||
                      userData?.fullName ||
                      userData?.username ||
                      "Unknown"}
                  </h2>
                  <p>{userData?.email || "unknown@example.com"}</p>
                </div>
              </>
            )}
          </div>

          <span className="encryption-info">
            Secure2FA End-to-End Encryption{" "}
            <i className="ri-lock-star-line"></i>
          </span>
        </div>

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
