import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Header() {
    const { cartItems } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);

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
                {/* Logo */}
                <div className="logo-box">
                    <img
                        src="/logo.png"
                        alt="PixelPlay Habana"
                        className="logo-img"
                        style={{ height: "60px" }}
                    />
                </div>

                {/* Botón sándwich (solo móvil) */}
                <button
                    className="hamburger-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

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

                {/* Navegación PC */}
                <nav
                    className="header-nav desktop-nav"
                    style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginLeft: "auto", // 🔹 Alinea a la derecha en PC
                    }}
                >
                    <NavLink
                        to="/"
                        end
                        style={({ isActive }) =>
                            isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                        }
                    >
                        Catálogo
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

                {/* Navegación móvil desplegable */}
                {menuOpen && (
                    <nav className="mobile-menu">
                        <NavLink
                            to="/"
                            end
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            Catálogo
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
        </header>
    );
}