import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import JuegoDetalles from "./pages/JuegoDetalles";
import InfoNegocio from "./pages/InfoNegocio";
import CarritoView from "./pages/CarritoView";
import UltimosEstrenos from "./pages/UltimosEstrenos";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./AuthContext";
import EditarJuego from "./pages/EditarJuego";
import InsertarJuego from "./pages/InsertarJuego";

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
                <Route path="/" element={<Catalogo />} />
                <Route path="/ultimos-estrenos" element={<UltimosEstrenos />} />
                <Route path="/juego/:id" element={<JuegoDetalles />} />
                <Route path="/editar/:id" element={<EditarJuego />} />
                <Route path="/insertar" element={<InsertarJuego />} />
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
