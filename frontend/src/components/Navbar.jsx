import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isLoggedIn = !!user;

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch("http://localhost:8000/api/v1/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
        } catch (err) {
            // Still logout on frontend even if request fails
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/signin");
    };

    return (
        <nav className="navbar">

            {/* ── Logo ── */}
            <Link to="/" className="navbar-logo">
                🧩 <span>SkillPath</span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="navbar-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Home
                </NavLink>
                <NavLink to="/sheet/striver" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Striver Sheet
                </NavLink>
                <NavLink to="/sheet/lovebabbar" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Love Babbar
                </NavLink>
                <NavLink to="/sheet/daily" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Daily Challenge
                </NavLink>
                {isLoggedIn && (
                    <NavLink to="/progress" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        My Progress
                    </NavLink>
                )}
            </div>

            {/* ── Right Side ── */}
            <div className="navbar-auth">
                {/* Theme Toggle */}
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>

                {isLoggedIn ? (
                    <>
                        <span className="navbar-username">
                            👤 {user.username || user.fullName}
                        </span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/signin" className="btn-signin">Sign In</Link>
                        <Link to="/signup" className="btn-signup">Sign Up</Link>
                    </>
                )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            {/* ── Mobile Menu ── */}
            {menuOpen && (
                <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
                    <NavLink to="/" end className="mobile-link">Home</NavLink>
                    <NavLink to="/sheet/striver" className="mobile-link">Striver Sheet</NavLink>
                    <NavLink to="/sheet/lovebabbar" className="mobile-link">Love Babbar</NavLink>
                    <NavLink to="/sheet/daily" className="mobile-link">Daily Challenge</NavLink>
                    {isLoggedIn && (
                        <NavLink to="/progress" className="mobile-link">My Progress</NavLink>
                    )}
                    <hr className="mobile-divider" />
                    <button
                        className="mobile-link mobile-theme-toggle"
                        onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                    >
                        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                    <hr className="mobile-divider" />
                    {isLoggedIn ? (
                        <button className="mobile-link btn-logout-mobile" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/signin" className="mobile-link">Sign In</Link>
                            <Link to="/signup" className="mobile-link">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
