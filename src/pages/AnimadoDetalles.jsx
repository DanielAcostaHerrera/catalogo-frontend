import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_ANIMADO } from "../graphql";
import "../App.css";

export default function AnimadoDetalles() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    return (
        <Query
            query={GET_ANIMADO}
            variables={{ id: Number(id) }}
            fetchPolicy="network-only"
        >
            {({ loading, error, data }) => {
                if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                const a = data?.animado;
                if (!a) return <p>No se encontró el animado.</p>;

                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Animados/${a.Portada}`;

                return (
                    <div className="detalle-wrapper">

                        {/* 🔹 BOTÓN VOLVER */}
                        <button
                            className="btn-volver"
                            onClick={() => {
                                if (location.state?.from) {
                                    navigate(location.state.from);
                                } else {
                                    navigate("/catalogo-animados");
                                }
                            }}
                        >
                            ← Volver
                        </button>

                        {/* 🔹 TÍTULO */}
                        <h2 className="detalle-titulo">{a.Titulo}</h2>

                        <div className="detalle-container">

                            {/* 🔹 IZQUIERDA: Portada */}
                            <div className="detalle-portada">
                                <img
                                    src={portadaUrl}
                                    alt={a.Titulo}
                                    className="detalle-portada-img"
                                />
                            </div>

                            {/* 🔹 DERECHA: Info */}
                            <div className="detalle-info">
                                <p>
                                    <strong>Año de estreno:</strong>{" "}
                                    {a.Anno || "No disponible"}
                                </p>

                                <p>
                                    <strong>Temporadas:</strong>{" "}
                                    {a.Temporadas || "No disponible"}
                                </p>
                            </div>
                        </div>

                        {/* 🔹 SINOPSIS + EPISODIOS */}
                        <div className="detalle-extra">

                            <div className="detalle-card">
                                <strong>Sinopsis:</strong>
                                <p
                                    style={{
                                        whiteSpace: "pre-line",
                                        marginLeft: 10,
                                        textAlign: "justify",
                                    }}
                                >
                                    {normalizarTexto(a.Sinopsis) ||
                                        "Sin sinopsis disponible."}
                                </p>
                            </div>

                            <div className="detalle-card">
                                <strong>Episodios:</strong>
                                <p
                                    style={{
                                        whiteSpace: "pre-line",
                                        marginLeft: 10,
                                        textAlign: "justify",
                                    }}
                                >
                                    {normalizarTexto(a.Episodios) ||
                                        "No disponibles."}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }}
        </Query>
    );
}