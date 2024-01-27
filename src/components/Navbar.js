import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Gallery</Link>
        </li>
        <li>
          <Link to="/upload">Upload Photo</Link>
        </li>
        {/* Add other navigation links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
