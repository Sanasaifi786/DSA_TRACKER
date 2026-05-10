import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    // Backend registerUser expects: fullName, username, email, password
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message); // show backend error message
                return;
            }

            // Registration successful → redirect to login
            navigate("/signin");

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="text"
                    name="username"
                    placeholder="Enter your Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

            </form>

            <p>
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </div>
    );
}

export default SignUp;
