import { Link, NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            {/* Logo */}
            <Link to="/">🧩 SkillPath</Link>

            {/* Navigation Links */}
            <div>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/sheet/striver">Striver Sheet</NavLink>
                <NavLink to="/sheet/lovebabbar">Love Babbar Sheet</NavLink>
                <NavLink to="/sheet/daily">Daily Challenge</NavLink>
                <NavLink to="/progress">My Progress</NavLink>
            </div>

            {/* Auth Buttons */}
            <div>
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    );
}

export default Navbar;
