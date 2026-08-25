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
    const tipoNombres = { juego: "🎮 Juegos", serie: "🎬 Series", anime: "🍥 Animes", animado: "🐭 Animados" };

    // Agrupar items por tipo
    const itemsAgrupados = {
        juego: [],
        serie: [],
        anime: [],
        animado: []
    };

    cartItems.forEach((item) => {
        if (itemsAgrupados[item.tipo]) {
            itemsAgrupados[item.tipo].push(item);
        }
    });

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

        content += `Precio total: ${(totals.price ?? 0).toFixed(2)} CUP\nTamaño total: ${(totals.size ?? 0).toFixed(1)} GB`;

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
        <div className="catalogo-container-moderno">
            <div className="catalogo-header-moderno">
                <h1 className="catalogo-titulo-moderno">🛒 Mi Pedido</h1>
                <p className="catalogo-subtitulo-moderno">
                    Revisa y confirma tu pedido antes de enviarlo
                </p>
            </div>

            <div className="carrito-resumen">
                <div className="carrito-totales">
                    <div className="carrito-total-item">
                        <span className="carrito-total-label">Precio total:</span>
                        <span className="carrito-total-valor">{(totals.price ?? 0).toFixed(2)} CUP</span>
                    </div>
                    <div className="carrito-total-item">
                        <span className="carrito-total-label">Tamaño total:</span>
                        <span className="carrito-total-valor">{(totals.size ?? 0).toFixed(1)} GB</span>
                    </div>
                </div>

                {cartItems.some((g) => g.tipo === "juego" && g.nombre.includes("[online]")) && (
                    <p className="carrito-advertencia">⚠ El tamaño calculado no incluye juegos online</p>
                )}

                {cartItems.some((g) => g.tipo === "serie" || g.tipo === "anime" || g.tipo === "animado") && (
                    <p className="carrito-advertencia">
                        ⚠ El tamaño calculado no incluye series/animados/anime
                    </p>
                )}

                <div className="btns-carrito">
                    <button className="btn-dark" onClick={exportTxt} disabled={cartItems.length === 0}>
                        📄 Exportar pedido
                    </button>

                    <button className="btn-dark" onClick={enviarWhatsApp} disabled={cartItems.length === 0}>
                        📲 Enviar por WhatsApp
                    </button>

                    <button
                        className="btn-dark"
                        onClick={() => {
                            clearCart();
                            if (showToast) showToast("Carrito vaciado");
                        }}
                        disabled={cartItems.length === 0}
                    >
                        🗑️ Vaciar carrito
                    </button>
                </div>
            </div>

            {/* Secciones agrupadas por tipo */}
            {Object.keys(itemsAgrupados).map((tipo) => {
                const items = itemsAgrupados[tipo];
                if (items.length === 0) return null;

                // Filtrar items de la página actual para esta sección
                const itemsSeccion = items.filter(item => {
                    const index = cartItems.indexOf(item);
                    return index >= startIndex && index < endIndex;
                });

                if (itemsSeccion.length === 0) return null;

                return (
                    <div key={tipo} className="carrito-seccion">
                        <h2 className="carrito-seccion-titulo">{tipoNombres[tipo] || tipo}</h2>
                        <ul className="carrito-lista-moderna">
                            {itemsSeccion.map((g) => {
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
                                    <li key={g.id} className="carrito-item">
                                        <img
                                            src={portadaUrl}
                                            alt={g.nombre}
                                            className="carrito-item-img"
                                        />

                                        <div className="carrito-item-info">
                                            <strong>{g.nombre}</strong>
                                            <div className="carrito-item-precio">{(g.Precio ?? g.precio ?? 0).toFixed(2)} CUP</div>

                                            {g.tipo === "juego" && (
                                                <div className="carrito-item-tamano">{g.tamanoFormateado || "Tamaño desconocido"}</div>
                                            )}

                                            {g.bloques && (
                                                <div className="carrito-item-bloques">
                                                    {g.bloques.map((b, i) => (
                                                        <div key={i}>{b.descripcion}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button className="btn-dark carrito-item-remove" onClick={() => removeFromCart(g.id)}>
                                            ✕
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}

            {totalPages > 1 && (
                <Paginacion page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}

export default CarritoView;