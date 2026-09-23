import { useState, useRef, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const CREAR_USUARIO = gql`
    mutation CrearUsuario($data: CreateUsuarioInput!) {
        crearUsuario(data: $data)
    }
`;

export default function RegistroModal({ onClose }) {
    const [usuario, setUsuario] = useState("");
    const [pass, setPass] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);

    const userRef = useRef();

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    const [crearUsuario, { loading }] = useMutation(CREAR_USUARIO);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (pass !== confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (pass.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            await crearUsuario({
                variables: {
                    data: {
                        Usuario: usuario,
                        Password: pass,
                        Rol: "cliente",
                    },
                },
            });
            alert("Usuario registrado correctamente");
            onClose();
        } catch (err) {
            setError(err.message || "Error al registrar usuario");
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-modal-header">
                        <p className="store-kicker">Únete a PixelPlay</p>
                        <h2 className="auth-title">Crear cuenta</h2>
                        <div className="auth-modal-line"></div>
                    </div>

                    <input
                        ref={userRef}
                        className="auth-input"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                        minLength={3}
                    />

                    <div className="auth-input-container">
                        <input
                            className="auth-input auth-input-pass"
                            type={showPass ? "text" : "password"}
                            placeholder="Contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required
                            minLength={6}
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
                                color: showPass ? "#8f98a0" : "#66c0f4",
                                transition: "color 0.2s ease",
                            }}
                        >
                            {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                    </div>

                    <div className="auth-input-container">
                        <input
                            className="auth-input auth-input-pass"
                            type={showConfirmar ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                            required
                        />

                        <IconButton
                            className="auth-input-icon"
                            onClick={() => setShowConfirmar(!showConfirmar)}
                            size="small"
                            sx={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                padding: "4px",
                                color: showConfirmar ? "#8f98a0" : "#66c0f4",
                                transition: "color 0.2s ease",
                            }}
                        >
                            {showConfirmar ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                    </div>

                    {error && <p className="auth-error">❌ {error}</p>}

                    <button type="submit" className="auth-btn-login" disabled={loading}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>

                    <button type="button" className="auth-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}