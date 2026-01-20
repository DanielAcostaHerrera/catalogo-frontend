import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import JuegoDetalles from "./pages/JuegoDetalles";
import InfoNegocio from "./pages/InfoNegocio";
import CarritoView from "./pages/CarritoView";
import UltimosEstrenos from "./pages/UltimosEstrenos";   // 🔹 import nuevo
import { CartProvider } from "./context/CartContext";

export default function App() {
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
      <BrowserRouter>
        <CartProvider>
          <Header />
          <main
            style={{
              width: "100%",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <Routes>
              {/* Catálogo principal */}
              <Route path="/" element={<Catalogo />} />

              {/* Últimos Estrenos */}
              <Route path="/ultimos-estrenos" element={<UltimosEstrenos />} />

              {/* Detalles de juego */}
              <Route path="/juego/:id" element={<JuegoDetalles />} />

              {/* Información del negocio */}
              <Route path="/info" element={<InfoNegocio />} />

              {/* Carrito de compras */}
              <Route path="/carrito" element={<CarritoView />} />
            </Routes>
          </main>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}
