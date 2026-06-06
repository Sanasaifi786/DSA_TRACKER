import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    return (
        <div className="notfound-page">
            <div className="notfound-content">
                <div className="notfound-code">404</div>
                <h1 className="notfound-title">Page not found</h1>
                <p className="notfound-subtitle">
                    Looks like this page doesn't exist. Maybe it got lost in a recursion loop?
                </p>
                <Link to="/" className="notfound-btn">← Back to Home</Link>
            </div>
        </div>
    );
}

export default NotFound;
