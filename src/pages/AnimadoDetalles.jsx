import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_ANIMADO } from "../graphql";
import { useCart } from "../context/CartContext";
import "../App.css";

export default function AnimadoDetalles({ showToast }) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, addToCart, updateCartItem } = useCart();
    const precioPorCapitulo = location.state?.precioPorCapitulo;

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    const handleAddTemporada = (animado, nombreBloque, cantidad) => {
        const existente = cartItems.find(
            (item) => item.tipo === "animado" && item.id === animado.Id
        );

        if (existente) {
            const yaTemporada = existente.bloques.some(
                (b) => b.descripcion === nombreBloque
            );
            if (yaTemporada) {
                if (showToast) showToast(`${nombreBloque} ya está en el carrito.`);
                return;
            }

            const nuevoBloques = [...existente.bloques, { descripcion: nombreBloque }];
            const nuevoPrecio = existente.precio + cantidad * Number(precioPorCapitulo);

            updateCartItem(animado.Id, {
                ...existente,
                precio: nuevoPrecio,
                bloques: nuevoBloques,
            });

            if (showToast) showToast(`${nombreBloque} añadida correctamente`);
        } else {
            const precio = cantidad * Number(precioPorCapitulo);
            const nuevoItem = {
                id: animado.Id,
                tipo: "animado",
                nombre: animado.Titulo,
                portada: animado.Portada,
                precio,
                bloques: [{ descripcion: nombreBloque }],
                Episodios: animado.Episodios,
            };

            const result = addToCart(nuevoItem);
            if (showToast) {
                if (result.status === "added") {
                    showToast(`${nombreBloque} añadida correctamente`);
                } else {
                    showToast(`${nombreBloque} ya estaba en el carrito`);
                }
            }
        }
    };

    return (
        <Query query={GET_ANIMADO} variables={{ id: Number(id) }} fetchPolicy="network-only">
            {({ loading, error, data }) => {
                if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                const a = data?.animado;
                if (!a) return <p>No se encontró el animado.</p>;

                const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Animados/${a.Portada}`;
                const lineas = normalizarTexto(a.Episodios).split("\n").filter((l) => l.trim() !== "");

                return (
                    <div className="detalle-wrapper">
                        <h2 className="detalle-titulo">{a.Titulo}</h2>

                        <div className="detalle-container">
                            <div className="detalle-portada">
                                <img src={portadaUrl} alt={a.Titulo} className="detalle-portada-img" />
                            </div>

                            <div className="detalle-info">
                                <p><strong>Año de estreno:</strong> {a.Anno || "No disponible"}</p>
                                <p><strong>Temporadas:</strong> {a.Temporadas || "No disponible"}</p>
                            </div>
                        </div>

                        <div className="detalle-extra">
                            <div className="detalle-card">
                                <strong>Sinopsis:</strong>
                                <p style={{ whiteSpace: "pre-line", marginLeft: 10, textAlign: "justify" }}>
                                    {normalizarTexto(a.Sinopsis) || "Sin sinopsis disponible."}
                                </p>
                            </div>

                            <div className="detalle-card">
                                <strong>Episodios:</strong>
                                <br />
                                <br /> {/* 🔹 Espacios debajo del título */}
                                <div style={{ marginLeft: 10, whiteSpace: "pre-wrap" }}>
                                    {lineas.map((l, idx) => {
                                        const match = l.match(/(\d+)\s*Episodios?/i);
                                        if (match) {
                                            const cantidad = parseInt(match[1], 10);
                                            const nombreBloque = l.replace(/-\s*\d+\s*Episodios?/i, "").trim() + " (entera)";

                                            return (
                                                <div key={idx} style={{ marginBottom: 6 }}>
                                                    {l}{"  "}{/* 🔹 Par de espacios antes del botón */}
                                                    <button
                                                        className="btn-add"
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
            }}
        </Query>
    );
}