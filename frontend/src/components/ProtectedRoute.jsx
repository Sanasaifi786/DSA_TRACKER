import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps any route that requires login.
// If not logged in → redirects to /signin
function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}

export default ProtectedRoute;
