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
      <div className="header-container">
        <div className="left-contents">
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

          <div className="title-box">
            <span className="header-title">PixelPlay Habana</span>
          </div>
        </div>

        <div className="right-contents">
          <button
            onClick={() => {
              if (auth.isLogged) auth.logout();
              else setShowLogin(true);
            }}
            className="admin-lock"
          >
            {auth.isLogged ? "🔓" : "🔐"}
          </button>

          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

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
            to="/catalogo-animes"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Animes
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

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}
