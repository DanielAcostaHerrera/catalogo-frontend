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
    const location = useLocation();
    const navigate = useNavigate();

    const toastRef = useRef();
    const showToast = (msg) => toastRef.current?.showToast(msg);

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    const procesarRequisitos = (txt) => {
        if (!txt) return "";
        const lineas = normalizarTexto(txt).split(/\r?\n/);
        const resultado = [];

        lineas.forEach((linea) => {
            const l = linea.trim();

            if (/^recomendado/i.test(l)) {
                if (resultado.length > 0 && resultado[resultado.length - 1] !== "") {
                    resultado.push("");
                }
                resultado.push(l);
            } else if (l !== "") {
                resultado.push(l);
            }
        });

        return resultado.join("\n");
    };

    return (
        <Query query={GET_JUEGO} variables={{ id: Number(id) }} fetchPolicy="network-only">
            {({ loading, error, data }) => {
                if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                const j = data?.juego;
                if (!j) return <p>No se encontró el juego.</p>;

                // 🔹 Portada directa desde Render (sin encode)
                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${j.Portada}`;

                return (
                    <div className="detalle-wrapper">

                        {/* 🔹 BOTÓN VOLVER */}
                        <button
                            className="btn-volver"
                            onClick={() => {
                                if (location.state?.from) {
                                    navigate(location.state.from);
                                } else {
                                    navigate("/catalogo-juegos");
                                }
                            }}
                        >
                            ← Volver
                        </button>

                        {/* 🔹 TÍTULO */}
                        <h2 className="detalle-titulo">{j.Nombre}</h2>

                        <div className="detalle-container">
                            <Toast ref={toastRef} />

                            {/* 🔹 IZQUIERDA: Portada + Añadir */}
                            <div className="detalle-portada">
                                <img
                                    src={portadaUrl}
                                    alt={j.Nombre}
                                    className="detalle-portada-img"
                                />

                                <AddToCartButton game={j} showToast={showToast} />
                            </div>

                            {/* 🔹 DERECHA: Info */}
                            <div className="detalle-info">
                                <p><strong>Tamaño:</strong> {j.TamanoFormateado}</p>

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

                        {/* 🔹 SINOPSIS + REQUISITOS */}
                        <div className="detalle-extra">

                            <div className="detalle-card">
                                <strong>Sinopsis:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10, textAlign: "justify" }}>
                                    {normalizarTexto(j.Sinopsis) || "Sin sinopsis disponible."}
                                </p>
                            </div>

                            <div className="detalle-card">
                                <strong>Requisitos de Sistema:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10, textAlign: "justify" }}>
                                    {procesarRequisitos(j.Requisitos) || "No disponibles."}
                                </p>

                                {j.Requisitos === "No disponible" && (
                                    <button
                                        className="btn-add"
                                        onClick={() => {
                                            const nombreLimpio = limpiarNombreParaBusqueda(j.Nombre);
                                            const query = encodeURIComponent(`Requisitos ${nombreLimpio}`);
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
