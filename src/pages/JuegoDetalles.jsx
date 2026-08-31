import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_JUEGO } from "../graphql";
import "../App.css";
import { limpiarNombreParaBusqueda } from "../utils/FormatoJuego";
import AddToCartButton from "../components/AddToCartButton";

function StoreStatus({ error, children }) {
    return (
        <div className="catalogo-container-moderno">
            <p className={error ? "catalogo-status catalogo-status--error" : "catalogo-status"}>
                {children}
            </p>
        </div>
    );
}

export default function JuegoDetalles({ showToast }) {
    const { id } = useParams();

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

    const { loading, error, data } = useQuery(GET_JUEGO, {
        variables: { id: Number(id) },
        fetchPolicy: "network-only",
    });

    if (loading) return <StoreStatus>Cargando…</StoreStatus>;
    if (error) return <StoreStatus error>Error: {error.message}</StoreStatus>;

    const j = data?.juego;
    if (!j) return <StoreStatus>No se encontró el juego.</StoreStatus>;

    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${j.Portada}`;
    const anno = j.Nombre?.toLowerCase().includes("[online]")
        ? new Date().getFullYear()
        : j.AnnoAct || "No disponible";

    return (
        <div className="catalogo-container-moderno">
            <div className="catalogo-header-moderno">
                <p className="store-kicker">Juego</p>
                <h1 className="catalogo-titulo-moderno">{j.Nombre}</h1>
                <p className="catalogo-subtitulo-moderno">Detalles del título</p>
            </div>

            <div className="detalle-container">
                <div className="detalle-portada">
                    <img
                        src={portadaUrl}
                        alt={j.Nombre}
                        className="detalle-portada-img"
                    />
                </div>

                <div className="detalle-info">
                    <dl className="detalle-spec">
                        <dt>Tamaño</dt>
                        <dd>{j.TamanoFormateado}</dd>
                    </dl>
                    <dl className="detalle-spec">
                        <dt>Precio</dt>
                        <dd>{j.Precio ? `${j.Precio} CUP` : "No disponible"}</dd>
                    </dl>
                    <dl className="detalle-spec">
                        <dt>Año de actualización</dt>
                        <dd>{anno}</dd>
                    </dl>

                    <div className="detalle-buy">
                        <AddToCartButton
                            item={{
                                id: j.Id,
                                tipo: "juego",
                                nombre: j.Nombre,
                                portada: `Portadas Juegos/${j.Portada}`,
                                precio: j.Precio ?? 0,
                                tamanoFormateado: j.TamanoFormateado ?? "Tamaño desconocido"
                            }}
                            showToast={showToast}
                        />
                    </div>
                </div>
            </div>

            <div className="detalle-extra">
                <div className="detalle-card">
                    <span className="detalle-card-title">Sinopsis</span>
                    <p className="detalle-card-body">
                        {normalizarTexto(j.Sinopsis) || "Sin sinopsis disponible."}
                    </p>
                </div>

                <div className="detalle-card">
                    <span className="detalle-card-title">Requisitos de sistema</span>
                    <p className="detalle-card-body">
                        {procesarRequisitos(j.Requisitos) || "No disponibles."}
                    </p>

                    {j.Requisitos === "No disponible" && (
                        <button
                            className="btn-dark"
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
}
