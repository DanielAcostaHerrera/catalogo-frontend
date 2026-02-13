import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const raw = localStorage.getItem("pph_cart");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("pph_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        let finalItem = item;

        if (item.tipo === "juego") {
            finalItem = normalizeGame(item);
        }

        if (
            (item.tipo === "serie" || item.tipo === "anime" || item.tipo === "animado") &&
            item.bloques?.some((b) => /entera/i.test(b.descripcion))
        ) {
            setCartItems((prev) => {
                // eliminar temporadas previas de esa serie/anime/animado
                const sinPrevias = prev.filter((i) => i.id !== item.id);
                return [...sinPrevias, finalItem];
            });
            return { status: "added" };
        }

        const exists = cartItems.some((g) => g.id === finalItem.id);
        if (exists) {
            return { status: "duplicate" };
        }

        setCartItems((prev) => [...prev, finalItem]);
        return { status: "added" };
    };

    const updateCartItem = (id, nuevoItem) => {
        setCartItems((prev) =>
            prev.map((i) => (i.id === id ? nuevoItem : i))
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((g) => g.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totals = useMemo(() => {
        const price = cartItems.reduce((acc, g) => acc + (Number(g.precio) || 0), 0);

        const size = cartItems.reduce((acc, g) => {
            if (!g.tamanoFormateado) return acc;
            const str = String(g.tamanoFormateado).toLowerCase();
            const m = str.match(/([\d.,]+)\s*(gb|mb)/);
            if (!m) return acc;
            const num = parseFloat(m[1].replace(",", "."));
            const unit = m[2];
            if (unit === "mb") {
                return acc + num / 1024;
            }
            return acc + num;
        }, 0);

        return { price, size };
    }, [cartItems]);

    const value = { cartItems, addToCart, updateCartItem, removeFromCart, clearCart, totals };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

function normalizeSerie(j) {
    const id = j.Id ?? j.id;
    const nombre = j.Nombre ?? j.nombre;
    const precio = j.Precio ?? j.precio ?? 0;
    const portada = j.Portada ?? j.portada;
    const episodios = j.Episodios ?? j.episodios;
    let bloques = j.Bloques ?? j.bloques;

    // 🔹 Conservar la descripción literal, solo ajustar casos especiales
    bloques = (bloques || []).map((b) => {
        if (/serie entera/i.test(b.descripcion) || b.temporada === "entera") {
            return "Serie entera";
        }
        return b.descripcion; // usar literal
    });

    return { id, nombre, precio: Number(precio), portada, bloques, episodios };
}

// 🔹 Normalización: guarda directamente TamanoFormateado y Portada
function normalizeGame(j) {
    const id = j.Id ?? j.id;
    const nombre = j.Nombre ?? j.nombre;
    const precio = j.Precio ?? j.precio ?? 0;
    const tamanoFormateado = j.TamanoFormateado ?? j.tamanoFormateado;
    const portada = j.Portada ?? j.portada;

    return { id, nombre, precio: Number(precio), tamanoFormateado, portada };
}