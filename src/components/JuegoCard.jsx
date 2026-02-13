import { Link, useNavigate, useLocation } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { useAuth } from "../AuthContext";
import { Mutation } from "react-apollo";
import { ELIMINAR_JUEGO } from "../mutations";

export default function JuegoCard({ juego, showToast, from }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 🔹 URL para mostrar la portada en el card (solo vista previa en catálogo)
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${juego.Portada}`;

    function handleEdit() {
        navigate(`/editar-juego/${juego.Id}`, {
            state: { from: location.pathname }
        });
    }

    return (
        <div
            style={{
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                overflow: "hidden",
                backgroundColor: "#1e1e1e",
            }}
        >
            <Link
                to={`/juego/${juego.Id}`}
                state={{ from }}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <img
                    src={portadaUrl}
                    alt={juego.Nombre}
                    style={{
                        width: "100%",
                        height: 180,
                        objectFit: "fill",
                        backgroundColor: "#000",
                        transition: "transform 0.2s, boxShadow 0.2s",
                        display: "block",
                    }}
                    loading="lazy"
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.4)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                />

                <h3
                    style={{
                        margin: 8,
                        fontSize: 15,
                        color: "#f0f0f0",
                        textAlign: "center",
                    }}
                >
                    {juego.Nombre}
                </h3>
            </Link>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                }}
            >
                {/* 🔹 Al añadir al carrito, se guarda carpeta + nombre, igual que en series */}
                <AddToCartButton
                    item={{
                        id: juego.Id,
                        tipo: "juego",
                        nombre: juego.Nombre,
                        portada: `Portadas Juegos/${juego.Portada}`,
                        precio: juego.Precio ?? 0,
                        tamanoFormateado: juego.TamanoFormateado ?? "Tamaño desconocido"
                    }}
                    showToast={showToast}
                />

                {auth.isLogged && (
                    <Mutation mutation={ELIMINAR_JUEGO}>
                        {(eliminarJuego) => (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="admin-edit-btn"
                                >
                                    ✏️
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!window.confirm(`¿Eliminar "${juego.Nombre}" del catálogo?`)) return;

                                        try {
                                            const res = await eliminarJuego({
                                                variables: { id: juego.Id },
                                            });

                                            if (res.data.eliminarJuego) {
                                                alert("Juego eliminado correctamente");
                                                window.location.reload();
                                            } else {
                                                alert("No se pudo eliminar el juego");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Error eliminando el juego");
                                        }
                                    }}
                                    className="admin-delete-btn"
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </Mutation>
                )}
            </div>
        </div>
    );
}