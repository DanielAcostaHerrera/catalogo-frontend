import { useParams } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_JUEGO } from "../graphql";

export default function JuegoDetalles() {
    const { id } = useParams();

    return (
        <Query query={GET_JUEGO} variables={{ id: Number(id) }}>
            {({ loading, error, data }) => {
                if (loading) return <p>Cargando…</p>;
                if (error) return <p>Error: {error.message}</p>;

                const j = data?.juego;
                if (!j) return <p>No se encontró el juego.</p>;

                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/${encodeURIComponent(j.Portada)}`;

                // 🔹 Lógica MB → GB con reglas especiales
                const mb = Number(j.Tamano);
                const esOnline = j.Nombre?.toLowerCase().includes("[online]");

                const tamanoFormateado =
                    j.Tamano == null || isNaN(mb)
                        ? "Desconocido"
                        : mb === 0 || esOnline
                            ? "Variable"
                            : mb < 1024
                                ? `${mb.toFixed(2)} MB`
                                : `${(mb / 1024).toFixed(2)} GB`;

                const annoActualizacion = esOnline
                    ? new Date().getFullYear()
                    : j.AnnoAct || "No disponible";

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
                            <p><strong>Tamaño:</strong> {tamanoFormateado}</p>
                            <p><strong>Precio:</strong> {j.Precio ? `${j.Precio} MN` : "No disponible"}</p>
                            <p><strong>Año de actualización:</strong> {annoActualizacion}</p>
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