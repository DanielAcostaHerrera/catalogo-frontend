import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ANIME } from "../graphql";
import { useCart } from "../context/CartContext";
import "../App.css";

function StoreStatus({ error, children }) {
    return (
        <div className="catalogo-container-moderno">
            <p className={error ? "catalogo-status catalogo-status--error" : "catalogo-status"}>
                {children}
            </p>
        </div>
    );
}

export default function AnimeDetalles({ showToast }) {
    const { id } = useParams();
    const location = useLocation();
    const { cartItems, addToCart, updateCartItem } = useCart();
    const precioPorCapitulo = location.state?.precioPorCapitulo;

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    const handleAddTemporada = (anime, nombreBloque, cantidad) => {
        const existente = cartItems.find(
            (item) => item.tipo === "anime" && item.id === anime.Id
        );

        if (existente) {
            const yaSerieCompleta = existente.bloques.some(
                (b) => b.descripcion === "Serie entera"
            );
            if (yaSerieCompleta) {
                showToast("La serie completa ya está en el carrito, no puedes añadir temporadas.");
                return;
            }

            const yaTemporada = existente.bloques.some(
                (b) => b.descripcion === nombreBloque
            );
            if (yaTemporada) {
                showToast("Esta temporada ya esta en el carrito");
                return;
            }

            const nuevoBloques = [...existente.bloques, { descripcion: nombreBloque }];
            const nuevoPrecio = existente.precio + cantidad * Number(precioPorCapitulo);

            updateCartItem(anime.Id, {
                ...existente,
                precio: nuevoPrecio,
                bloques: nuevoBloques,
            });
        } else {
            const precio = cantidad * Number(precioPorCapitulo);
            const nuevoItem = {
                id: anime.Id,
                tipo: "anime",
                nombre: anime.Titulo,
                portada: anime.Portada,
                precio,
                bloques: [{ descripcion: nombreBloque }],
                Episodios: anime.Episodios,
            };

            addToCart(nuevoItem);
        }

        showToast("Temporada añadida correctamente");
    };

    const { loading, error, data } = useQuery(GET_ANIME, {
        variables: { id: Number(id) },
        fetchPolicy: "network-only",
    });

    if (loading) return <StoreStatus>Cargando…</StoreStatus>;
    if (error) return <StoreStatus error>Error: {error.message}</StoreStatus>;

    const a = data?.anime;
    if (!a) return <StoreStatus>No se encontró el anime.</StoreStatus>;

    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Anime/${a.Portada}`;
    const lineas = normalizarTexto(a.Episodios).split("\n").filter((l) => l.trim() !== "");

    return (
        <div className="catalogo-container-moderno">
            <div className="catalogo-header-moderno">
                <p className="store-kicker">Anime</p>
                <h1 className="catalogo-titulo-moderno">{a.Titulo}</h1>
                <p className="catalogo-subtitulo-moderno">Detalles del título</p>
            </div>

            <div className="detalle-container">
                <div className="detalle-portada">
                    <img src={portadaUrl} alt={a.Titulo} className="detalle-portada-img" />
                </div>

                <div className="detalle-info">
                    <dl className="detalle-spec">
                        <dt>Año de estreno</dt>
                        <dd>{a.Anno || "No disponible"}</dd>
                    </dl>
                    <dl className="detalle-spec">
                        <dt>Temporadas</dt>
                        <dd>{a.Temporadas || "No disponible"}</dd>
                    </dl>
                </div>
            </div>

            <div className="detalle-extra">
                <div className="detalle-card">
                    <span className="detalle-card-title">Sinopsis</span>
                    <p className="detalle-card-body">
                        {normalizarTexto(a.Sinopsis) || "Sin sinopsis disponible."}
                    </p>
                </div>

                <div className="detalle-card">
                    <span className="detalle-card-title">Episodios</span>
                    <div className="episodios-container">
                        {lineas.map((l, idx) => {
                            const match = l.match(/(\d+)\s*Episodios?/i);
                            if (match) {
                                const cantidad = parseInt(match[1], 10);
                                const nombreBloque =
                                    l.replace(/-\s*\d+\s*Episodios?/i, "").trim() + " (entera)";

                                return (
                                    <div key={idx} className="episodio-item">
                                        <span className="episodio-texto">{l}</span>
                                        <button
                                            className="btn-add episodio-btn"
                                            onClick={() => handleAddTemporada(a, nombreBloque, cantidad)}
                                        >
                                            🛒 Añadir
                                        </button>
                                    </div>
                                );
                            }
                            return <div key={idx}>{l}</div>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
