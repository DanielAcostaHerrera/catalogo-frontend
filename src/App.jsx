import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Catalogo from "./pages/Catalogo";
import JuegoDetalles from "./pages/JuegoDetalles";
import EditarJuego from "./pages/EditarJuego";
import InsertarJuego from "./pages/InsertarJuego";

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
                <Route path="/" element={<Catalogo />} />
                <Route path="/juego/:id" element={<JuegoDetalles />} />
                <Route path="/editar/:id" element={<EditarJuego />} />
                <Route path="/insertar" element={<InsertarJuego />} />

                {/* 🔹 SERIES */}
                <Route path="/catalogoSeries" element={<CatalogoSeries />} />
                <Route path="/serie/:id" element={<SerieDetalles />} />
                <Route path="/editarSerie/:id" element={<EditarSerie />} />
                <Route path="/insertarSerie" element={<InsertarSerie />} />

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
