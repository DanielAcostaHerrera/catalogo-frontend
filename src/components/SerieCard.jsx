import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Mutation } from "react-apollo";
import { ELIMINAR_SERIE } from "../mutations";

export default function SerieCard({ serie, from }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${serie.Portada}`;

    function handleEdit() {
        navigate(`/editar-serie/${serie.Id}`, {
            state: { from }
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
                to={`/serie/${serie.Id}`}
                state={{ from }}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <img
                    src={portadaUrl}
                    alt={serie.Titulo}
                    style={{
                        width: "100%",
                        height: 180,
                        objectFit: "contain",
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
                    {serie.Titulo}
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
                {auth.isLogged && (
                    <Mutation mutation={ELIMINAR_SERIE}>
                        {(eliminarSerie) => (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="admin-edit-btn"
                                >
                                    ✏️
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!window.confirm(`¿Eliminar "${serie.Titulo}" del catálogo?`)) return;

                                        try {
                                            const res = await eliminarSerie({
                                                variables: { id: serie.Id },
                                            });

                                            if (res.data.eliminarSerie) {
                                                alert("Serie eliminada correctamente");
                                                window.location.reload();
                                            } else {
                                                alert("No se pudo eliminar la serie");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Error eliminando la serie");
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