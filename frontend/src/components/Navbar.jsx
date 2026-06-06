import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { user, isLoggedIn, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/auth/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });
        } catch {}
        logout();       // clears AuthContext + localStorage
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
                {isLoggedIn && (
                    <NavLink to="/ai-insights" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        🤖 AI Insights
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
                        <div className="user-profile-chip">
                            <div className="user-avatar">
                                {(user.username || user.fullName || "U")[0].toUpperCase()}
                            </div>
                            <span className="user-name">
                                {user.username || user.fullName}
                            </span>
                        </div>
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
                    {isLoggedIn && (
                        <NavLink to="/ai-insights" className="mobile-link">🤖 AI Insights</NavLink>
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
