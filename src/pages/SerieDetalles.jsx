import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_SERIE } from "../graphql";
import "../App.css";

export default function SerieDetalles() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    return (
        <Query
            query={GET_SERIE}
            variables={{ id: Number(id) }}
            fetchPolicy="network-only"
        >
            {({ loading, error, data }) => {
                if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                const s = data?.serie;
                if (!s) return <p>No se encontró la serie.</p>;

                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${s.Portada}`;

                return (
                    <div className="detalle-wrapper">

                        {/* 🔹 TÍTULO */}
                        <h2 className="detalle-titulo">{s.Titulo}</h2>

                        <div className="detalle-container">

                            {/* 🔹 IZQUIERDA: Portada */}
                            <div className="detalle-portada">
                                <img
                                    src={portadaUrl}
                                    alt={s.Titulo}
                                    className="detalle-portada-img"
                                />
                            </div>

                            {/* 🔹 DERECHA: Info */}
                            <div className="detalle-info">
                                <p>
                                    <strong>Año de estreno:</strong>{" "}
                                    {s.Anno || "No disponible"}
                                </p>

                                <p>
                                    <strong>Temporadas:</strong>{" "}
                                    {s.Temporadas || "No disponible"}
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
                                    {normalizarTexto(s.Sinopsis) ||
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
                                    {normalizarTexto(s.Episodios) ||
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