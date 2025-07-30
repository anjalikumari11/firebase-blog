import React, { useEffect, useState } from 'react'
// import logo from "../../assets/logo.jpg"
import logo from "/assets/blogLogo.jpg";
import { useNavigate } from 'react-router-dom';
import './navbar.css'
import { auth } from '../../firebase/FirebaseConfig';

function Navbar() {
  const navigate = useNavigate();
  const handleBlog = () => {
    navigate("/allBlogs");
  }
  const handleLogin = () => {
    navigate("/adminLogin");
  }
  const handleDashboard = () => {
    navigate("/admin/dashboard");
  }
  const handleHome = () => {
    navigate("/");
  }
  const [searchInput, setSearchInput] = useState();
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/allBlogs?search=${encodeURIComponent(searchInput)}`)

  }
  const admin = localStorage.getItem("admin");
  const parsedAdmin = JSON.parse(admin);
  const userProfile = parsedAdmin?.photoURL;

  const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem("admin");
            set({ user: null });
            console.log("User logged out");
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    }

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><img src={logo} height={40} style={{ borderRadius: "50%" }} /> MetaMinds</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="ms-auto d-flex align-items-center gap-3 MyMainNav">
              <form className="d-flex RespFromNav" onSubmit={handleSearch}>
                <input className="form-control me-2" type="search" placeholder="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} aria-label="Search" />
                <button className="btn btn-outline-success" type="submit" >Search</button>
              </form>

              <ul className="navbar-nav mb-2 mb-md-0 d-flex align-items-center myNavLink">
                <li className="nav-item">
                  <a className="nav-link" href='#' aria-current="page" onClick={handleHome}>Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href='#' onClick={handleBlog}>Blog</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={handleLogin} href="#">Admin Login</a>
                </li>
                <li>
                  <div className="dropdown myResdropdown">
                    <a className="nav-link" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" href='#'><img src={userProfile || logo} height={40} style={{ borderRadius: "50%" }} /></a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li><a className="dropdown-item" href="#" onClick={handleDashboard}>Dashboard</a></li>
                      <li><a className="dropdown-item" href="#" onClick={() => navigate('/Save&Draft')}>Save & Draft</a></li>
                      <li><a className="dropdown-item" href="#">Settings</a></li>
                      <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
