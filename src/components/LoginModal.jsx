import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

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
                        <p className="store-kicker">Administración</p>
                        <h2 className="auth-title">Iniciar sesión</h2>
                        <div className="auth-modal-line"></div>
                    </div>

                    <input
                        ref={userRef}
                        className="auth-input"
                        placeholder="Usuario"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />

                    <div className="auth-input-container">
                        <input
                            className="auth-input auth-input-pass"
                            type={showPass ? "text" : "password"}
                            placeholder="Contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />

                        <IconButton
                            className="auth-input-icon"
                            onClick={() => setShowPass(!showPass)}
                            size="small"
                            sx={{ 
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                padding: "4px",
                                // 🔥 Estilo Windows: blanco cuando oculto, opaco cuando visible
                                color: showPass ? "#8f98a0" : "#66c0f4",
                                transition: "color 0.2s ease"
                            }}
                        >
                            {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                    </div>

                    {error && <p className="auth-error">❌ Credenciales incorrectas</p>}

                    <button type="submit" className="auth-btn-login">
                        Entrar
                    </button>

                    <button type="button" className="auth-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}
