import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem("auth");
        if (saved === "1") setIsLogged(true);
    }, []);

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

export function useAuth() {
    return useContext(AuthContext);
}