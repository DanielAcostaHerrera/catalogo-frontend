import { useParams } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_JUEGO } from "../graphql";
import "../App.css"; // estilos globales
import { limpiarNombreParaBusqueda } from "../utils/FormatoJuego";
import { useRef } from "react";
import AddToCartButton from "../components/AddToCartButton";
import Toast from "../components/Toast";

export default function JuegoDetalles() {
    const { id } = useParams();
    const toastRef = useRef();
    const showToast = (msg) => {
        if (toastRef.current) toastRef.current.showToast(msg);
    };

    return (
        <Query query={GET_JUEGO} variables={{ id: Number(id) }}>
            {({ loading, error, data }) => {
                if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                const j = data?.juego;
                if (!j) return <p>No se encontró el juego.</p>;

                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/${encodeURIComponent(
                    j.Portada
                )}`;

                // Normalizar texto: convertir secuencias "\n" en saltos reales
                const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

                // Procesar requisitos para insertar renglón vacío antes de "Recomendados"
                const procesarRequisitos = (txt) => {
                    if (!txt) return "";
                    const lineas = normalizarTexto(txt).split("\n");
                    const resultado = [];
                    const patronesRec = /(recomendado[s]?|requisito[s]?\s+recomendado[s]?)/i;

                    lineas.forEach((linea) => {
                        const l = linea.trim();
                        if (patronesRec.test(l)) {
                            resultado.push(""); // salto de línea antes de recomendados
                            resultado.push(l);
                        } else {
                            resultado.push(l);
                        }
                    });

                    return resultado.join("\n");
                };

                return (
                    <div className="detalle-container">
                        <Toast ref={toastRef} />

                        {/* 🔹 Columna izquierda: portada + botón añadir */}
                        <div
                            className="detalle-portada"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <img
                                src={portadaUrl}
                                alt={j.Nombre}
                                style={{ width: "100%", height: "auto", borderRadius: 8 }}
                            />
                            <AddToCartButton game={j} showToast={showToast} />
                        </div>

                        {/* 🔹 Columna derecha: información */}
                        <div className="detalle-info">
                            <h2 style={{ marginTop: 0 }}>{j.Nombre}</h2>
                            <p>
                                <strong>Tamaño:</strong> {j.TamanoFormateado}
                            </p>
                            <p>
                                <strong>Precio:</strong>{" "}
                                {j.Precio ? `${j.Precio} CUP` : "No disponible"}
                            </p>
                            <p>
                                <strong>Año de actualización:</strong>{" "}
                                {j.AnnoAct || "No disponible"}
                            </p>

                            {/* Sinopsis */}
                            <div style={{ marginTop: 20 }}>
                                <strong>Sinopsis:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10 }}>
                                    {normalizarTexto(j.Sinopsis) || "Sin sinopsis disponible."}
                                </p>
                            </div>

                            {/* Requisitos */}
                            <div style={{ marginTop: 20 }}>
                                <strong>Requisitos de Sistema:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10 }}>
                                    {procesarRequisitos(j.Requisitos) || "No disponibles."}
                                </p>

                                {j.Requisitos === "No disponible" && (
                                    <button
                                        className="btn-buscar"
                                        onClick={() => {
                                            const nombreLimpio = limpiarNombreParaBusqueda(j.Nombre);
                                            const query = encodeURIComponent(
                                                `Requisitos ${nombreLimpio}`
                                            );
                                            window.open(
                                                `https://www.google.com/search?q=${query}`,
                                                "_blank"
                                            );
                                        }}
                                        style={{
                                            marginTop: 10,
                                            padding: "8px 12px",
                                            background: "#4285f4",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Buscar requisitos en Google
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }}
        </Query>
    );
}