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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await auth.login(user, pass);

        if (ok) {
            onClose();
        } else {
            setError(true);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-modal-header">
                        <span className="auth-modal-icon">🔐</span>
                        <h2 className="auth-title">Acceso Administrativo</h2>
                        <div className="auth-modal-line"></div>
                    </div>

                    <input
                        ref={userRef}
                        className="auth-input"
                        placeholder="👤 Usuario"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />

                    <div className="auth-input-container">
                        <input
                            className="auth-input auth-input-pass"
                            type={showPass ? "text" : "password"}
                            placeholder="🔑 Contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />

                        <span
                            className="auth-input-icon"
                            onClick={() => setShowPass(!showPass)}
                            type="button"
                        >
                            {showPass ? "👁️" : "🚫"}
                        </span>
                    </div>

                    {error && <p className="auth-error">❌ Credenciales incorrectas</p>}

                    <button type="submit" className="auth-btn-login">
                        ⚡ Entrar
                    </button>

                    <button type="button" className="auth-btn-cancel" onClick={onClose}>
                        ✕ Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}
