import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_JUEGO } from "../graphql";
import "../App.css";
import { limpiarNombreParaBusqueda } from "../utils/FormatoJuego";
import { useRef } from "react";
import AddToCartButton from "../components/AddToCartButton";
import Toast from "../components/Toast";

export default function JuegoDetalles() {
    const { id } = useParams();
    const location = useLocation();     // 🔹 Para saber desde dónde venimos
    const navigate = useNavigate();     // 🔹 Para volver exactamente a esa vista

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

                const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

                const procesarRequisitos = (txt) => {
                    if (!txt) return "";
                    const lineas = normalizarTexto(txt).split("\n");
                    const resultado = [];
                    const patronesRec = /(recomendado[s]?|requisito[s]?\s+recomendado[s]?)/i;

                    lineas.forEach((linea) => {
                        const l = linea.trim();
                        if (patronesRec.test(l)) {
                            resultado.push("");
                            resultado.push(l);
                        } else {
                            resultado.push(l);
                        }
                    });

                    return resultado.join("\n");
                };

                return (
                    <div className="detalle-wrapper">

                        {/* 🔹 BOTÓN VOLVER (inteligente) */}
                        <button
                            className="btn-volver"
                            onClick={() => {
                                if (location.state?.from) {
                                    navigate(location.state.from);
                                } else {
                                    navigate("/catalogo");
                                }
                            }}
                        >
                            ← Volver
                        </button>

                        {/* 🔹 TÍTULO ARRIBA Y CENTRADO */}
                        <h2 className="detalle-titulo">{j.Nombre}</h2>

                        <div className="detalle-container">
                            <Toast ref={toastRef} />

                            {/* 🔹 IZQUIERDA: Portada + Botón Añadir */}
                            <div className="detalle-portada">
                                <img
                                    src={portadaUrl}
                                    alt={j.Nombre}
                                    className="detalle-portada-img"
                                />

                                {/* Botón Añadir */}
                                <AddToCartButton game={j} showToast={showToast} />
                            </div>

                            {/* 🔹 DERECHA: Tamaño / Precio / Año */}
                            <div className="detalle-info">
                                <p>
                                    <strong>Tamaño:</strong> {j.TamanoFormateado}
                                </p>

                                <p>
                                    <strong>Precio:</strong>{" "}
                                    {j.Precio ? `${j.Precio} CUP` : "No disponible"}
                                </p>

                                <p>
                                    <strong>Año de actualización:</strong>{" "}
                                    {j.Nombre?.toLowerCase().includes("[online]")
                                        ? new Date().getFullYear()
                                        : j.AnnoAct || "No disponible"}
                                </p>
                            </div>
                        </div>

                        {/* 🔹 ABAJO: Sinopsis + Requisitos */}
                        <div className="detalle-extra">

                            {/* SINOPSIS */}
                            <div className="detalle-card">
                                <strong>Sinopsis:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10 }}>
                                    {normalizarTexto(j.Sinopsis) || "Sin sinopsis disponible."}
                                </p>
                            </div>

                            {/* REQUISITOS */}
                            <div className="detalle-card">
                                <strong>Requisitos de Sistema:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10 }}>
                                    {procesarRequisitos(j.Requisitos) || "No disponibles."}
                                </p>

                                {j.Requisitos === "No disponible" && (
                                    <button
                                        className="btn-add"
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
                                    >
                                        Buscar en Google
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
