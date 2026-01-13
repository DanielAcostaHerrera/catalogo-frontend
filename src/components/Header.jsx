import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
    const { cartItems } = useCart();

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
        <header
            style={{
                width: "100%",
                backgroundColor: "#121212",
                borderBottom: "1px solid #2a2a2a",
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                className="header-container"
                style={{
                    width: "100%",
                    padding: "12px 20px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 12,
                    boxSizing: "border-box",
                    position: "relative",
                }}
            >
                {/* 🔹 Logo en su propio div */}
                <div className="logo-box">
                    <img
                        src="/logo.png"
                        alt="PixelPlay Habana"
                        className="logo-img"
                        style={{ height: "60px" }}
                    />
                </div>

                {/* 🔹 Texto en su propio div */}
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

                {/* 🔹 Navegación */}
                <nav
                    className="header-nav"
                    style={{
                        display: "flex",
                        gap: 8,
                        marginLeft: "auto",
                        flexWrap: "wrap",
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
            </div>
        </header>
    );
}