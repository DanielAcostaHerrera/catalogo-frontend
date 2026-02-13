import { useState } from "react";
import { useCart } from "../context/CartContext";
import Paginacion from "../components/Paginacion";

function CarritoView({ showToast }) {
    const { cartItems, removeFromCart, clearCart, totals } = useCart();

    const [page, setPage] = useState(1);
    const limit = 20;
    const totalPages = Math.ceil(cartItems.length / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const itemsPagina = cartItems.slice(startIndex, endIndex);

    const exportTxt = () => {
        let content = cartItems
            .map((g) => {
                if (g.tipo === "juego") {
                    return `${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP) (${g.tamanoFormateado ?? "?"})`;
                } else if (g.tipo === "serie" || g.tipo === "anime" || g.tipo === "animado") {
                    const bloquesTxt = g.bloques?.map((b) => b.descripcion).join("\n   ");
                    return `${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP)\n   ${bloquesTxt ?? ""}`;
                }
                return `${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP)`;
            })
            .join("\n");

        content += `\n\nTotal: ${(totals.price ?? 0).toFixed(2)} CUP\nEspacio: ${(totals.size ?? 0).toFixed(1)} GB`;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "pedido.txt";
        a.click();
        URL.revokeObjectURL(url);

        if (showToast) showToast("Pedido exportado a TXT");
    };

    const enviarWhatsApp = () => {
        let content = cartItems
            .map((g) => {
                if (g.tipo === "juego") {
                    return `${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP) (${g.tamanoFormateado ?? "?"})`;
                } else if (g.tipo === "serie" || g.tipo === "anime" || g.tipo === "animado") {
                    const bloquesTxt = g.bloques?.map((b) => b.descripcion).join("\n   ");
                    return `${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP)\n   ${bloquesTxt ?? ""}`;
                }
                return `${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP)`;
            })
            .join("\n");

        content += `\n\nTotal: ${(totals.price ?? 0).toFixed(2)} CUP\nEspacio: ${(totals.size ?? 0).toFixed(1)} GB`;

        const mensaje = `Hola, le escribo para realizar el siguiente pedido:\n\n${content}`;
        const numero = "5352524842";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");
    };

    return (
        <div>
            <h2>Mi pedido</h2>

            <div style={{ marginBottom: "16px" }}>
                <p>Total precio: {(totals.price ?? 0).toFixed(2)} CUP</p>
                <p>Total tamaño: {(totals.size ?? 0).toFixed(1)} GB</p>

                {cartItems.some((g) => g.tipo === "juego" && g.nombre.includes("[online]")) && (
                    <p style={{ color: "red" }}>⚠ El tamaño calculado no incluye juegos online</p>
                )}

                {cartItems.some((g) => g.tipo === "serie" || g.tipo === "anime" || g.tipo === "animado") && (
                    <p style={{ color: "red" }}>
                        ⚠ El tamaño calculado no incluye series/animados/anime
                    </p>
                )}

                <div className="btns-carrito">
                    <button className="btn-carrito" onClick={exportTxt} disabled={cartItems.length === 0}>
                        Exportar pedido
                    </button>

                    <button className="btn-carrito" onClick={enviarWhatsApp} disabled={cartItems.length === 0}>
                        📲 Enviar pedido por WhatsApp
                    </button>

                    <button
                        className="btn-carrito"
                        onClick={() => {
                            clearCart();
                            if (showToast) showToast("Carrito vaciado");
                        }}
                        disabled={cartItems.length === 0}
                    >
                        Vaciar carrito
                    </button>
                </div>
            </div>

            <ul className="carrito-lista">
                {itemsPagina.map((g) => {
                    let carpeta = "";
                    switch (g.tipo) {
                        case "juego": carpeta = "Portadas Juegos"; break;
                        case "serie": carpeta = "Portadas Series"; break;
                        case "animado": carpeta = "Portadas Animados"; break;
                        case "anime": carpeta = "Portadas Anime"; break;
                        default: carpeta = ""; break;
                    }

                    const portadaUrl = carpeta
                        ? `https://catalogo-backend-f4sk.onrender.com/portadas/${carpeta}/${g.portada}`
                        : `https://catalogo-backend-f4sk.onrender.com/portadas/${g.portada}`;

                    return (
                        <li key={g.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <img
                                src={portadaUrl}
                                alt={g.nombre}
                                style={{
                                    width: "80px",
                                    height: "100px",
                                    objectFit: "contain",
                                    borderRadius: 4,
                                }}
                            />

                            <div style={{ flex: 1 }}>
                                <strong>{g.nombre}</strong>
                                <div>{(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP</div>

                                {g.tipo === "juego" && (
                                    <div>{g.tamanoFormateado || "Tamaño desconocido"}</div>
                                )}

                                {g.bloques && (
                                    <div>
                                        {g.bloques.map((b, i) => (
                                            <div key={i}>{b.descripcion}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => removeFromCart(g.id)}>Quitar</button>
                        </li>
                    );
                })}
            </ul>

            {totalPages > 1 && (
                <Paginacion page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}

export default CarritoView;