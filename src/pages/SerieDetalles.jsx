import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SERIE } from "../graphql";
import { useCart } from "../context/CartContext";
import "../App.css";

export default function SerieDetalles({ showToast }) {
    const { id } = useParams();
    const location = useLocation();
    const { cartItems, addToCart, updateCartItem } = useCart();
    const precioPorCapitulo = location.state?.precioPorCapitulo;

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    const handleAddTemporada = (serie, nombreBloque, cantidad) => {
        const existente = cartItems.find(
            (item) => item.tipo === "serie" && item.id === serie.Id
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

            updateCartItem(serie.Id, {
                ...existente,
                precio: nuevoPrecio,
                bloques: nuevoBloques,
            });
        } else {
            const precio = cantidad * Number(precioPorCapitulo);
            const nuevoItem = {
                id: serie.Id,
                tipo: "serie",
                nombre: serie.Titulo,
                portada: serie.Portada,
                precio,
                bloques: [{ descripcion: nombreBloque }],
                Episodios: serie.Episodios,
            };

            addToCart(nuevoItem);
        }

        showToast("Temporada añadida correctamente");
    };

    const { loading, error, data } = useQuery(GET_SERIE, {
        variables: { id: Number(id) },
        fetchPolicy: "network-only",
    });

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const s = data?.serie;
    if (!s) return <p>No se encontró la serie.</p>;

    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${s.Portada}`;
    const lineas = normalizarTexto(s.Episodios).split("\n").filter((l) => l.trim() !== "");

    return (
        <>
            <div className="catalogo-container-moderno">
                <div className="catalogo-header-moderno">
                    <h1 className="catalogo-titulo-moderno">🎬 {s.Titulo}</h1>
                    <p className="catalogo-subtitulo-moderno">
                        Detalles de la serie
                    </p>
                </div>

                <div className="detalle-container">
                    <div className="detalle-portada">
                        <img src={portadaUrl} alt={s.Titulo} className="detalle-portada-img" />
                    </div>

                    <div className="detalle-info">
                        <p><strong>Año de estreno:</strong> {s.Anno || "No disponible"}</p>
                        <p><strong>Temporadas:</strong> {s.Temporadas || "No disponible"}</p>
                    </div>
                </div>

                <div className="detalle-extra">
                    <div className="detalle-card">
                        <strong>Sinopsis:</strong>
                        <p style={{ whiteSpace: "pre-line", marginLeft: 10, textAlign: "justify" }}>
                            {normalizarTexto(s.Sinopsis) || "Sin sinopsis disponible."}
                        </p>
                    </div>

                    <div className="detalle-card">
                        <strong>Episodios:</strong>
                        <br />
                        <br />
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
                                                onClick={() => handleAddTemporada(s, nombreBloque, cantidad)}
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
        </>
    );
}
