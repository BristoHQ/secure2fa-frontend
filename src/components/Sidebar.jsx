import "../styles/components/Sidebar.css";
import Avatar from "../assets/my-av.webp";

export default function Sidebar({ isActive }) {
  return (
    <>
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="user-profile">
          <img src={Avatar} alt="User Profile" />
          <div className="user-info">
            <h2>Manish Kumar</h2>
            <p>manishkumar070707@gmail.com</p>
          </div>
        </div>

        <span className="encryption-info">
          Secure2FA End-to-End Encryption <i className="ri-lock-star-line"></i>
        </span>

        <div className="divider"></div>
        <div className="lists">
          <ul>
            <li>
              <i className="ri-inbox-2-line"></i> Inbox
            </li>
            <li>
              <i className="ri-dashboard-line"></i> Dashboard
            </li>
            <li>
              <i className="ri-add-line"></i> Add Token
            </li>
            <li>
              <i className="ri-error-warning-line"></i> Manage ELP
            </li>
            <li>
              <i className="ri-database-2-line"></i> Backup/Restore
            </li>
            <li>
              <i className="ri-contrast-2-line"></i> Appearance
            </li>
            <li>
              <i className="ri-settings-4-line"></i> Settings
            </li>
          </ul>
          <div className="logout">
            <button className="logout-button">
              <i className="ri-logout-box-r-line"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
