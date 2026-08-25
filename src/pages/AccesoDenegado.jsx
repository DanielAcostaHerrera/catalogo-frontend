import { useNavigate } from "react-router-dom";

export default function AccesoDenegado() {
    const navigate = useNavigate();

    return (
        <div className="acceso-denegado-container">
            <div className="acceso-denegado-content">
                <div className="acceso-denegado-icono">🚫</div>
                <h1 className="acceso-denegado-titulo">Acceso Denegado</h1>
                <p className="acceso-denegado-texto">
                    No tienes permisos para acceder a esta sección.
                </p>
                <p className="acceso-denegado-subtexto">
                    Debes iniciar sesión como administrador para ver esta página.
                </p>
                <button 
                    className="btn-dark" 
                    onClick={() => navigate("/")}
                    style={{ marginTop: "20px" }}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}