import { createContext, useContext } from "react";

export const AuthContext = createContext({
    isLogged: false,
    user: null,
    login: async () => {},
    logout: () => {},
});

export function authContext() {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usada dentro de AuthProvider");
    }
    return context;
}
