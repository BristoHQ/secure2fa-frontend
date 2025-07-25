import React from "react";
import "../styles/components/SearchBar.css";
export default function SearchBar() {
  return (
    <div className="searchbar-container">
      <div className="searchbar">
        <button className="search-button">
          <i className="ri-search-line"></i>
        </button>
        <div className="divider"></div>
        <input type="search" placeholder="Search..." />
      </div>
      <div className="filter">
        <button className="search-button">
          <i className="ri-filter-line"></i>
        </button>
        <select name="sortBy" id="sortBy">
          <option value="all">all</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
      </div>
    </div>
  );
}
