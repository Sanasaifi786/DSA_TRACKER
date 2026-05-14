import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Read saved theme from localStorage, default to "dark"
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "dark"
    );

    // Apply data-theme to <body> whenever theme changes
    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook for easy access
export function useTheme() {
    return useContext(ThemeContext);
}
