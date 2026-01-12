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

    // 🔹 Persistencia
    useEffect(() => {
        localStorage.setItem("pph_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // 🔹 Añadir con verificación de duplicado por id
    const addToCart = (game) => {
        const item = normalizeGame(game);

        const exists = cartItems.some((g) => g.id === item.id);
        if (exists) {
            return { status: "duplicate" };
        }

        setCartItems((prev) => [...prev, item]);
        return { status: "added" };
    };

    // 🔹 Quitar por id
    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((g) => g.id !== id));
    };

    // 🔹 Vaciar carrito completo
    const clearCart = () => {
        setCartItems([]);
    };

    // 🔹 Totales seguros
    const totals = useMemo(() => {
        const price = cartItems.reduce((acc, g) => acc + (Number(g.precio) || 0), 0);

        // Convertir MB a GB si hace falta
        const size = cartItems.reduce((acc, g) => {
            if (!g.tamanoFormateado) return acc;
            const str = String(g.tamanoFormateado).toLowerCase();
            const m = str.match(/([\d.,]+)\s*(gb|mb)/);
            if (!m) return acc;
            const num = parseFloat(m[1].replace(",", "."));
            const unit = m[2];
            if (unit === "mb") {
                return acc + num / 1024; // convertir MB a GB
            }
            return acc + num; // ya en GB
        }, 0);

        return { price, size };
    }, [cartItems]);

    const value = { cartItems, addToCart, removeFromCart, clearCart, totals };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
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