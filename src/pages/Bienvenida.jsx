import { useQuery } from "@apollo/react-hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { GET_ULTIMOS_ESTRENOS, GET_ULTIMOS_ESTRENOS_SERIES } from "../graphql";
import Carrusel from "../components/Carrusel"; // 🔹 nuestro carrusel reutilizable

export default function Bienvenida() {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: juegosData, loading: juegosLoading, error: juegosError } = useQuery(GET_ULTIMOS_ESTRENOS, {
        variables: { limit: 25 },
    });

    const { data: seriesData, loading: seriesLoading, error: seriesError } = useQuery(GET_ULTIMOS_ESTRENOS_SERIES, {
        variables: { limit: 25 },
    });

    if (juegosLoading || seriesLoading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (juegosError || seriesError) return <p style={{ color: "red" }}>Error al cargar datos.</p>;

    const juegos = juegosData?.ultimosEstrenos?.juegos || [];
    const series = seriesData?.ultimosEstrenosSeries?.series || [];

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#1c1c1c",
                color: "#f0f0f0",
                padding: "20px",
            }}
        >
            {/* Logo + Título */}
            <div className="brand-box">
                <img src="/logo.png" alt="PixelPlay Habana" />
                <h1>PixelPlay Habana</h1>
            </div>

            {/* Descripción */}
            <p
                style={{
                    textAlign: "justify",
                    fontSize: "1.2rem",
                    marginBottom: "20px",
                    color: "#ccc",
                    lineHeight: "1.6",
                    width: "100%",
                }}
            >
                PixelPlay Habana es un punto de encuentro para los amantes de los videojuegos de PC y las mejores series.
                Nuestro catálogo reúne estrenos y clásicos cuidadosamente seleccionados pensados para que encuentres justo
                lo que buscas. Explora y descubre nuevas aventuras digitales o maratones imperdibles, todo en un solo lugar.
            </p>

            {/* Botón Preguntas Frecuentes */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <button
                    className="btn-dark"
                    style={{ marginBottom: 15 }}
                    onClick={() => navigate("/info", { state: { from: location.pathname } })}
                >
                    ❓ Preguntas Frecuentes
                </button>
            </div>

            <hr style={{ border: "0", height: "1px", background: "#444", margin: "30px 0" }} />

            {/* Últimos Juegos */}
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🎮 Últimos Juegos</h2>
            <Carrusel
                items={juegos.map((j) => ({
                    portada: `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${j.Portada}`,
                    id: j.Id,   // 🔹 usa el campo correcto
                    tipo: "juego",
                }))}
            />
            <div style={{ textAlign: "center", marginTop: 15 }}>
                <button
                    className="btn-dark"
                    style={{ marginBottom: 15 }}
                    onClick={() => navigate("/catalogo-juegos", { state: { from: location.pathname } })}
                >
                    Ver Catálogo de Juegos
                </button>
            </div>

            {/* Últimas Series */}
            <h2 style={{ textAlign: "center", margin: "40px 0 20px" }}>🎬 Últimas Series</h2>
            <Carrusel
                items={series.map((s) => ({
                    portada: `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${s.Portada}`,
                    id: s.Id,   // 🔹 usa el campo correcto
                    tipo: "serie",
                }))}
            />
            <div style={{ textAlign: "center", marginTop: 15 }}>
                <button
                    className="btn-dark"
                    style={{ marginBottom: 15 }}
                    onClick={() => navigate("/catalogo-series", { state: { from: location.pathname } })}
                >
                    Ver Catálogo de Series
                </button>
            </div>
        </div>
    );
}