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

    const ordenTipo = { juego: 1, serie: 2, anime: 3, animado: 4 };

    const itemsPagina = cartItems
        .slice(startIndex, endIndex)
        .sort((a, b) => (ordenTipo[a.tipo] ?? 99) - (ordenTipo[b.tipo] ?? 99));

    const generarContenidoAgrupado = () => {
        const grupos = { juego: [], serie: [], anime: [], animado: [] };

        [...cartItems]
            .sort((a, b) => (ordenTipo[a.tipo] ?? 99) - (ordenTipo[b.tipo] ?? 99))
            .forEach((g) => {
                if (g.tipo === "juego") {
                    grupos.juego.push(`${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP) (${g.tamanoFormateado ?? "?"})`);
                } else if (g.tipo === "serie" || g.tipo === "anime" || g.tipo === "animado") {
                    const bloquesTxt = g.bloques?.map((b) => b.descripcion).join("\n   ");
                    grupos[g.tipo].push(`${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP)\n   ${bloquesTxt ?? ""}`);
                } else {
                    grupos[g.tipo]?.push(`${g.nombre} (${(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP)`);
                }
            });

        let content = "";
        if (grupos.juego.length) content += "Juegos:\n" + grupos.juego.join("\n") + "\n\n";
        if (grupos.serie.length) content += "Series:\n" + grupos.serie.join("\n") + "\n\n";
        if (grupos.anime.length) content += "Animes:\n" + grupos.anime.join("\n") + "\n\n";
        if (grupos.animado.length) content += "Animados:\n" + grupos.animado.join("\n") + "\n\n";

        content += `Total: ${(totals.price ?? 0).toFixed(2)} CUP\nEspacio: ${(totals.size ?? 0).toFixed(1)} GB`;

        return content;
    };

    const exportTxt = () => {
        const content = generarContenidoAgrupado();
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
        const content = generarContenidoAgrupado();
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

                    const portadaUrl = g.portada.includes("Portadas")
                        ? `https://catalogo-backend-f4sk.onrender.com/portadas/${g.portada}`
                        : `https://catalogo-backend-f4sk.onrender.com/portadas/${carpeta}/${g.portada}`;

                    return (
                        <li key={g.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <img
                                src={portadaUrl}
                                alt={g.nombre}
                                style={{
                                    width: "80px",
                                    height: "100px",
                                    objectFit: "fill",
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