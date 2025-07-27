import React from "react";
import "../styles/pages/NotFound404.css";
const buyMeCoffeeLogo = (
  // Inline SVG, replace with <img src="your_logo.png" /> if you prefer
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FFDD00" />
    <g>
      <path
        d="M7.5 11C7.5 8.51472 9.51472 6.5 12 6.5H20C22.4853 6.5 24.5 8.51472 24.5 11V19C24.5 21.4853 22.4853 23.5 20 23.5H12C9.51472 23.5 7.5 21.4853 7.5 19V11Z"
        fill="#FFF5D6"
        stroke="#F7B500"
        strokeWidth="1.5"
      />
      <ellipse cx="16" cy="16" rx="6" ry="3.5" fill="#FECA57" />
      <circle cx="16" cy="16" r="2" fill="#804000" />
    </g>
  </svg>
);

export default function NotFound404() {
  return (
    <div className="notfound-wrapper">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Oops! The page you’re looking for doesn't exist or has been moved.</p>
      <div className="suggestion">
        <span>Are you trying to find this?</span>
        <a
          href="https://coff.ee/itz_Manish02"
          target="_blank"
          rel="noopener noreferrer"
          className="coffee-link"
        >
          {buyMeCoffeeLogo}
          <span>Buy Me a Coffee</span>
        </a>
      </div>
    </div>
  );
}
