import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
    const auth = useAuth();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const userRef = useRef();

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    function handleLogin() {
        if (auth.login(user, pass)) onClose();
        else setError(true);
    }

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <h2 className="auth-title">Acceso Administrativo</h2>

                <input
                    ref={userRef}
                    className="auth-input"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                    }}
                />

                {/* CONTENEDOR DEL INPUT DE CONTRASEÑA */}
                <div className="auth-input-container">
                    <input
                        className="auth-input auth-input-pass"
                        type={showPass ? "text" : "password"}
                        placeholder="Contraseña"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleLogin();
                        }}
                    />

                    <span
                        className="auth-input-icon"
                        onClick={() => setShowPass(!showPass)}
                    >
                        {showPass ? "👁️" : "🚫"}
                    </span>
                </div>

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