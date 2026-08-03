import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {  // ← ✅ Export nombrado
    const [isLogged, setIsLogged] = useState(() => {
        try {
            return sessionStorage.getItem("auth") === "1";
        } catch {
            return false;
        }
    });

    function login(user, pass) {
        if (user === "danieldavidacostaherrera" && pass === "Entrar020296") {
            setIsLogged(true);
            sessionStorage.setItem("auth", "1");
            return true;
        }
        return false;
    }

    function logout() {
        setIsLogged(false);
        sessionStorage.removeItem("auth");
    }

    return (
        <AuthContext.Provider value={{ isLogged, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}