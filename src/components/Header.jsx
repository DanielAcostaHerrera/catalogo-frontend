import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

export default function Header() {
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useAuth();

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <header className="site-header">
      <div className="header-container">
        
        {/* 🔹 Bloque izquierdo: menú hamburguesa */}
        <div className="left-contents">
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* 🔹 Bloque central: logo + título */}
        <div className="center-contents">
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

        {/* 🔹 Bloque derecho: carrito + avatar */}
        <div className="right-contents">
          <NavLink to="/carrito" style={{ textDecoration: "none", color: "inherit" }}>
            <Badge badgeContent={cartItems.length} color="secondary">
              <ShoppingCartIcon style={{ color: "#e6e6e6", cursor: "pointer" }} />
            </Badge>
          </NavLink>

          <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
            <Avatar
              alt="Usuario"
              src={auth.isLogged ? "/user-foto.png" : ""}
              sx={{ width: 40, height: 40, bgcolor: "#1e1e1e"  }}
            >
              {!auth.isLogged && <AccountCircleIcon />}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {auth.isLogged ? (
              <MenuItem
                onClick={() => {
                  auth.logout();
                  handleMenuClose();
                }}
              >
                Cerrar sesión
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  setShowLogin(true);
                  handleMenuClose();
                }}
              >
                Iniciar sesión
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>

      {/* 🔹 Menú hamburguesa como Drawer desde la izquierda */}
      <SwipeableDrawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpen={() => setMenuOpen(true)}
        disableDiscovery={true}
        disableSwipeToOpen={true}
      >
        <div className="drawer-menu-contenido">
          {/* Logo en el menú */}
          <div className="drawer-menu-header">
            <img
              src="/logo.png"
              alt="PixelPlay Habana"
              className="drawer-menu-logo"
            />
            <span className="drawer-menu-titulo">PixelPlay Habana</span>
            <div className="drawer-menu-line"></div>
          </div>

          {/* Enlaces del menú */}
          <nav className="drawer-menu-nav">
            <NavLink to="/catalogo-juegos" end onClick={() => setMenuOpen(false)} className="drawer-menu-item">
              🎮 Juegos
            </NavLink>
            <NavLink to="/catalogo-series" onClick={() => setMenuOpen(false)} className="drawer-menu-item">
              🎬 Series
            </NavLink>
            <NavLink to="/catalogo-animados" onClick={() => setMenuOpen(false)} className="drawer-menu-item">
              🐭 Animados
            </NavLink>
            <NavLink to="/catalogo-animes" onClick={() => setMenuOpen(false)} className="drawer-menu-item">
              🍥 Animes
            </NavLink>
          </nav>

          {/* Separador */}
          <div className="drawer-menu-divider"></div>

          {/* Información del negocio */}
          <NavLink to="/info" onClick={() => setMenuOpen(false)} className="drawer-menu-item">
            ❓ Información del negocio
          </NavLink>
        </div>
      </SwipeableDrawer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}





