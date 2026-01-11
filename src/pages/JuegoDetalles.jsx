import { useParams } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_JUEGO } from "../graphql";
import "../App.css"; // 🔹 asegúrate de tener aquí los estilos globales

export default function JuegoDetalles() {
    const { id } = useParams();

    return (
        <Query query={GET_JUEGO} variables={{ id: Number(id) }}>
            {({ loading, error, data }) => {
                if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                const j = data?.juego;
                if (!j) return <p>No se encontró el juego.</p>;

                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/${encodeURIComponent(j.Portada)}`;

                return (
                    <div className="detalle-container">
                        <div className="detalle-portada">
                            <img
                                src={portadaUrl}
                                alt={j.Nombre}
                                style={{ width: "100%", height: "auto", borderRadius: 8 }}
                            />
                        </div>
                        <div className="detalle-info">
                            <h2 style={{ marginTop: 0 }}>{j.Nombre}</h2>
                            <p><strong>Tamaño:</strong> {j.TamanoFormateado}</p>
                            <p><strong>Precio:</strong> {j.Precio ? `${j.Precio} CUP` : "No disponible"}</p>
                            <p><strong>Año de actualización:</strong> {j.AnnoAct || "No disponible"}</p>
                            <p style={{ marginTop: 20 }}>
                                <strong>Sinopsis:</strong> {j.Sinopsis || "Sin sinopsis disponible."}
                            </p>
                        </div>
                    </div>
                );
            }}
        </Query>
    );
}