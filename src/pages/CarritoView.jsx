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
    const juegosPagina = cartItems.slice(startIndex, endIndex);

    // 🔹 Exportar pedido a TXT
    const exportTxt = () => {
        let content = cartItems
            .map(
                (g) =>
                    `${g.nombre} (${(g.precio ?? 0).toFixed(2)} CUP) (${g.tamanoFormateado ?? "?"})`
            )
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

    // 🔹 Enviar pedido por WhatsApp
    const enviarWhatsApp = () => {
        let content = cartItems
            .map(
                (g) =>
                    `${g.nombre} (${(g.precio ?? 0).toFixed(2)} CUP) (${g.tamanoFormateado ?? "?"})`
            )
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

            {/* Totales y botones arriba */}
            <div style={{ marginBottom: "16px" }}>
                <p>Total precio: {(totals.price ?? 0).toFixed(2)} CUP</p>
                <p>Total tamaño: {(totals.size ?? 0).toFixed(1)} GB</p>

                {cartItems.some((g) => g.nombre.includes("[online]")) && (
                    <p style={{ color: "red" }}>
                        ⚠ Algunos juegos online tienen tamaño variable
                    </p>
                )}

                <div className="btns-carrito">
                    <button
                        className="btn-carrito"
                        onClick={exportTxt}
                        disabled={cartItems.length === 0}
                    >
                        Exportar pedido
                    </button>

                    <button
                        className="btn-carrito"
                        onClick={enviarWhatsApp}
                        disabled={cartItems.length === 0}
                    >
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

            {/* Listado de juegos */}
            <ul className="carrito-lista">
                {juegosPagina.map((g) => {
                    const portadaUrl = g.portada
                        ? `https://catalogo-backend-f4sk.onrender.com/portadas/${encodeURIComponent(g.portada)}`
                        : null;
                    return (
                        <li key={g.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            {portadaUrl && (
                                <img
                                    src={portadaUrl}
                                    alt={g.nombre}
                                    style={{ width: "80px", height: "100px", objectFit: "contain", borderRadius: 4 }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <strong>{g.nombre}</strong>
                                <div>{(g.precio ?? 0).toFixed(2)} CUP</div>
                                <div>{g.tamanoFormateado || "Tamaño desconocido"}</div>
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