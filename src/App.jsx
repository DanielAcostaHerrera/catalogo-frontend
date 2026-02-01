import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import JuegoDetalles from "./pages/JuegoDetalles";
import EditarJuego from "./pages/EditarJuego";
import InsertarJuego from "./pages/InsertarJuego";
import CatalogoJuegos from "./pages/CatalogoJuegos";
import CatalogoSeries from "./pages/CatalogoSeries";
import SerieDetalles from "./pages/SerieDetalles";
import EditarSerie from "./pages/EditarSerie";
import InsertarSerie from "./pages/InsertarSerie";

import InfoNegocio from "./pages/InfoNegocio";
import CarritoView from "./pages/CarritoView";
import UltimosEstrenos from "./pages/UltimosEstrenos";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./AuthContext";


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
        <AuthProvider>
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
                {/* 🔹 JUEGOS */}
                <Route path="/" element={<CatalogoJuegos />} />
                <Route path="/juego/:id" element={<JuegoDetalles />} />
                <Route path="/editar-juego/:id" element={<EditarJuego />} />
                <Route path="/insertar-juego" element={<InsertarJuego />} />

                {/* 🔹 SERIES */}
                <Route path="/catalogo-series" element={<CatalogoSeries />} />
                <Route path="/serie/:id" element={<SerieDetalles />} />
                <Route path="/editar-serie/:id" element={<EditarSerie />} />
                <Route path="/insertar-serie" element={<InsertarSerie />} />

                {/* 🔹 OTROS */}
                <Route path="/ultimos-estrenos" element={<UltimosEstrenos />} />
                <Route path="/info" element={<InfoNegocio />} />
                <Route path="/carrito" element={<CarritoView />} />
              </Routes>
            </main>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}