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
      </nav>
    </>
  );
}
