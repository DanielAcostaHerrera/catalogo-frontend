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
                        marginLeft: "auto",
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
                        to="/ultimos-estrenos"
                        style={({ isActive }) =>
                            isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                        }
                    >
                        Últimos Estrenos
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

                {/* Candado PC (fuera del menú para que no desaparezca en móvil) */}
                <button
                    onClick={() => {
                        if (auth.isLogged) auth.logout();
                        else setShowLogin(true);
                    }}
                    className="admin-lock-desktop"
                    style={{
                        marginLeft: 10,
                        background: "transparent",
                        border: "none",
                        color: "#e6e6e6",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                >
                    {auth.isLogged ? "🔓" : "🔐"}
                </button>

                {/* Navegación móvil */}
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
                            to="/ultimos-estrenos"
                            style={({ isActive }) =>
                                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                            }
                        >
                            Últimos Estrenos
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

                        {/* Candado móvil (debajo del carrito) */}
                        <button
                            onClick={() => {
                                if (auth.isLogged) auth.logout();
                                else setShowLogin(true);
                            }}
                            className="admin-lock-mobile"
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#e6e6e6",
                                fontSize: "20px",
                                padding: "10px 14px",
                                textAlign: "left",
                                width: "100%",
                                cursor: "pointer",
                            }}
                        >
                            {auth.isLogged ? "🔓" : "🔐"}
                        </button>
                    </nav>
                )}
            </div>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </header>
    );
}