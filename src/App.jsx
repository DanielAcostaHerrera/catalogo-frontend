import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";

/* 🔹 JUEGOS */
import JuegoDetalles from "./pages/JuegoDetalles";
import EditarJuego from "./pages/EditarJuego";
import InsertarJuego from "./pages/InsertarJuego";
import CatalogoJuegos from "./pages/CatalogoJuegos";

/* 🔹 SERIES */
import CatalogoSeries from "./pages/CatalogoSeries";
import SerieDetalles from "./pages/SerieDetalles";
import EditarSerie from "./pages/EditarSerie";
import InsertarSerie from "./pages/InsertarSerie";

/* 🔹 ANIMADOS */
import CatalogoAnimados from "./pages/CatalogoAnimados";
import AnimadoDetalles from "./pages/AnimadoDetalles";
import EditarAnimado from "./pages/EditarAnimado";
import InsertarAnimado from "./pages/InsertarAnimado";

/* 🔹 ANIMES */
import CatalogoAnimes from "./pages/CatalogoAnimes";
import AnimeDetalles from "./pages/AnimeDetalles";
import EditarAnime from "./pages/EditarAnime";
import InsertarAnime from "./pages/InsertarAnime";

/* 🔹 ÚLTIMOS ESTRENOS */
import UltimosEstrenos from "./pages/UltimosEstrenos";
import UltimosEstrenosSeries from "./pages/UltimosEstrenosSeries";
import UltimosEstrenosAnimados from "./pages/UltimosEstrenosAnimados";
import UltimosEstrenosAnimes from "./pages/UltimosEstrenosAnimes";

/* 🔹 OTROS */
import InfoNegocio from "./pages/InfoNegocio";
import CarritoView from "./pages/CarritoView";
import Bienvenida from "./pages/Bienvenida";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./AuthContext";

/* 🔹 Toastify */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();

  // Función global para mostrar toasts
  const showToast = (msg) => toast(msg);

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#f0f0f0",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <AuthProvider>
        <CartProvider>
          {/* 🔹 Ocultar Header solo en la página de bienvenida */}
          {location.pathname !== "/" && <Header />}

          <main
            style={{
              width: "100%",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <Routes>
              {/* 🔹 JUEGOS */}
              <Route path="/catalogo-juegos" element={<CatalogoJuegos showToast={showToast} />} />
              <Route path="/juego/:id" element={<JuegoDetalles showToast={showToast} />} />
              <Route path="/editar-juego/:id" element={<EditarJuego showToast={showToast} />} />
              <Route path="/insertar-juego" element={<InsertarJuego showToast={showToast} />} />

              {/* 🔹 SERIES */}
              <Route path="/catalogo-series" element={<CatalogoSeries showToast={showToast} />} />
              <Route path="/serie/:id" element={<SerieDetalles showToast={showToast} />} />
              <Route path="/editar-serie/:id" element={<EditarSerie showToast={showToast} />} />
              <Route path="/insertar-serie" element={<InsertarSerie showToast={showToast} />} />

              {/* 🔹 ANIMADOS */}
              <Route path="/catalogo-animados" element={<CatalogoAnimados showToast={showToast} />} />
              <Route path="/animado/:id" element={<AnimadoDetalles showToast={showToast} />} />
              <Route path="/editar-animado/:id" element={<EditarAnimado showToast={showToast} />} />
              <Route path="/insertar-animado" element={<InsertarAnimado showToast={showToast} />} />

              {/* 🔹 ANIMES */}
              <Route path="/catalogo-animes" element={<CatalogoAnimes showToast={showToast} />} />
              <Route path="/anime/:id" element={<AnimeDetalles showToast={showToast} />} />
              <Route path="/editar-anime/:id" element={<EditarAnime showToast={showToast} />} />
              <Route path="/insertar-anime" element={<InsertarAnime showToast={showToast} />} />

              {/* 🔹 ÚLTIMOS ESTRENOS */}
              <Route path="/ultimos-estrenos-juegos" element={<UltimosEstrenos showToast={showToast} />} />
              <Route path="/ultimos-estrenos-series" element={<UltimosEstrenosSeries showToast={showToast} />} />
              <Route path="/ultimos-estrenos-animados" element={<UltimosEstrenosAnimados showToast={showToast} />} />
              <Route path="/ultimos-estrenos-animes" element={<UltimosEstrenosAnimes showToast={showToast} />} />

              {/* 🔹 OTROS */}
              <Route path="/info" element={<InfoNegocio showToast={showToast} />} />
              <Route path="/carrito" element={<CarritoView showToast={showToast} />} />
              <Route path="/" element={<Bienvenida showToast={showToast} />} />
            </Routes>
          </main>

          {/* 🔹 Contenedor de Toasts */}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}