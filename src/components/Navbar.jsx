import "../styles/components/Navbar.css";
import SearchBar from "../components/SearchBar";

export default function Navbar({ toggleSidebar }) {
  return (
    <>
      <nav className="navbar">
        <div className="hamburger" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <SearchBar />
        {/* <div className="navbar-actions">
          <div className="branding">
            <span className="brand-highlight">by bristoHQ</span>
          </div>
        </div> */}
      </nav>
    </>
  );
}
