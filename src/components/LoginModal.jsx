import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function LoginModal({ onClose }) {
    const auth = useAuth();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);

    function handleLogin() {
        if (auth.login(user, pass)) onClose();
        else setError(true);
    }

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <h2 className="auth-title">Acceso Administrativo</h2>

                <input
                    className="auth-input"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Contraseña"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />

                {error && <p className="auth-error">Credenciales incorrectas</p>}

                <button className="auth-btn-login" onClick={handleLogin}>
                    Entrar
                </button>

                <button className="auth-btn-cancel" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}