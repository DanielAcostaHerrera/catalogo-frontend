import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import LoginModal from "../components/LoginModal";

export default function Header() {
    const { cartItems } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const auth = useAuth();

    const linkStyle = {
        color: "#e6e6e6",
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: 6,
        transition: "background-color 0.2s, color 0.2s",
    };

    const activeStyle = {
        backgroundColor: "#3a3a3a",
        color: "#ffffff",
    };

    return (
        <header className="site-header">
            <div
                className="header-container"
                style={{
                    width: "100%",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxSizing: "border-box",
                    position: "relative",
                }}
            >
                {/* Logo → lleva a / */}
                <div className="logo-box">
                    <NavLink to="/" style={{ display: "inline-block" }}>
                        <img
                            src="/logo.png"
                            alt="PixelPlay Habana"
                            className="logo-img"
                            style={{ height: "60px", cursor: "pointer" }}
                        />
                    </NavLink>
                </div>

                {/* Título */}
                <div className="title-box">
                    <span
                        className="header-title"
                        style={{
                            fontWeight: 600,
                            color: "#f0f0f0",
                            whiteSpace: "nowrap",
                        }}
                    >
                        PixelPlay Habana
                    </span>
                </div>

                {/* --- BLOQUE DERECHO: Candado + Hamburguesa --- */}

                {/* Candado SIEMPRE visible (PC y móvil) */}
                <button
                    onClick={() => {
                        if (auth.isLogged) auth.logout();
                        else setShowLogin(true);
                    }}
                    className="admin-lock-desktop"
                >
                    {auth.isLogged ? "🔓" : "🔐"}
                </button>

                {/* Botón sándwich (PC y móvil) */}
                <button
                    className="hamburger-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                {/* --- MENÚ MÓVIL --- */}
                {menuOpen && (
                    <nav className="mobile-menu">
                        <NavLink
                            to="/catalogo-juegos"
                            end
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            Juegos
                        </NavLink>

                        <NavLink
                            to="/catalogo-series"
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            Series
                        </NavLink>

                        <NavLink
                            to="/catalogo-animados"
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            Animados
                        </NavLink>

                        <NavLink
                            to="/info"
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            Información del negocio
                        </NavLink>

                        <NavLink
                            to="/carrito"
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            🛒 Carrito ({cartItems.length})
                        </NavLink>
                    </nav>
                )}
            </div>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </header>
    );
}