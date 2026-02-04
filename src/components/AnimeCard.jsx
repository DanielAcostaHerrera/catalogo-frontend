import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Mutation } from "react-apollo";
import { ELIMINAR_ANIME } from "../mutations";

export default function AnimeCard({ anime, from }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Anime/${anime.Portada}`;

    function handleEdit() {
        navigate(`/editar-anime/${anime.Id}`, {
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
                to={`/anime/${anime.Id}`}
                state={{ from }}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <img
                    src={portadaUrl}
                    alt={anime.Titulo}
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
                    {anime.Titulo}
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
                    <Mutation mutation={ELIMINAR_ANIME}>
                        {(eliminarAnime) => (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="admin-edit-btn"
                                >
                                    ✏️
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!window.confirm(`¿Eliminar "${anime.Titulo}" del catálogo?`)) return;

                                        try {
                                            const res = await eliminarAnime({
                                                variables: { id: anime.Id },
                                            });

                                            if (res.data.eliminarAnime) {
                                                alert("Anime eliminado correctamente");
                                                window.location.reload();
                                            } else {
                                                alert("No se pudo eliminar el anime");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Error eliminando el anime");
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