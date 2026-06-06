import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });
    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res  = await fetch("http://localhost:8000/api/v1/auth/register", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            navigate("/signin");

        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Start tracking your DSA journey today — it's free</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
