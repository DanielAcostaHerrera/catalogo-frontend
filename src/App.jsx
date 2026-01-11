import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Catalogo from './pages/Catalogo';
import JuegoDetalles from './pages/JuegoDetalles';
import InfoNegocio from './pages/InfoNegocio';

export default function App() {
  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      color: '#f0f0f0',
      minHeight: '100vh',
      width: '100%',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <BrowserRouter>
        <Header />
        <main style={{
          width: '100%',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/juego/:id" element={<JuegoDetalles />} />
            <Route path="/info" element={<InfoNegocio />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
