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

/* 🔹 ÚLTIMOS ESTRENOS */
import UltimosEstrenos from "./pages/UltimosEstrenos"; // Juegos
import UltimosEstrenosSeries from "./pages/UltimosEstrenosSeries";
import UltimosEstrenosAnimados from "./pages/UltimosEstrenosAnimados";

/* 🔹 OTROS */
import InfoNegocio from "./pages/InfoNegocio";
import CarritoView from "./pages/CarritoView";
import Bienvenida from "./pages/Bienvenida";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./AuthContext";

function AppContent() {
  const location = useLocation();

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
              <Route path="/catalogo-juegos" element={<CatalogoJuegos />} />
              <Route path="/juego/:id" element={<JuegoDetalles />} />
              <Route path="/editar-juego/:id" element={<EditarJuego />} />
              <Route path="/insertar-juego" element={<InsertarJuego />} />

              {/* 🔹 SERIES */}
              <Route path="/catalogo-series" element={<CatalogoSeries />} />
              <Route path="/serie/:id" element={<SerieDetalles />} />
              <Route path="/editar-serie/:id" element={<EditarSerie />} />
              <Route path="/insertar-serie" element={<InsertarSerie />} />

              {/* 🔹 ANIMADOS */}
              <Route path="/catalogo-animados" element={<CatalogoAnimados />} />
              <Route path="/animado/:id" element={<AnimadoDetalles />} />
              <Route path="/editar-animado/:id" element={<EditarAnimado />} />
              <Route path="/insertar-animado" element={<InsertarAnimado />} />

              {/* 🔹 ÚLTIMOS ESTRENOS */}
              <Route path="/ultimos-estrenos-juegos" element={<UltimosEstrenos />} />
              <Route path="/ultimos-estrenos-series" element={<UltimosEstrenosSeries />} />
              <Route path="/ultimos-estrenos-animados" element={<UltimosEstrenosAnimados />} />

              {/* 🔹 OTROS */}
              <Route path="/info" element={<InfoNegocio />} />
              <Route path="/carrito" element={<CarritoView />} />
              <Route path="/" element={<Bienvenida />} />

            </Routes>
          </main>
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