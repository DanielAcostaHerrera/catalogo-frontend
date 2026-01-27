import { useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthContext";

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

                {/* Usuario */}
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

                {/* Contraseña + ojito */}
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        className="auth-input"
                        type={showPass ? "text" : "password"}
                        placeholder="Contraseña"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleLogin();
                        }}
                        style={{ paddingRight: 40 }}
                    />

                    <span
                        onClick={() => setShowPass(!showPass)}
                        style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#ccc",
                            fontSize: 18,
                            userSelect: "none"
                        }}
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