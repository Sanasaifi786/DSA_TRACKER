import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Initialize from localStorage so state survives refresh
    const [user, setUser] = useState(
        () => JSON.parse(localStorage.getItem("user") || "null")
    );
    const [token, setToken] = useState(
        () => localStorage.getItem("accessToken") || null
    );

    // Called after successful login
    const login = (data) => {
        localStorage.setItem("accessToken",  data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user",         JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.accessToken);
    };

    // Called on logout
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
