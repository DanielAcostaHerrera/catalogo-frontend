import { useQuery } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import {
    GET_ULTIMOS_ESTRENOS,
    GET_ULTIMOS_ESTRENOS_SERIES,
    GET_ULTIMOS_ESTRENOS_ANIMADOS,
    GET_ULTIMOS_ESTRENOS_ANIMES,
} from "../graphql";
import Carrusel from "../components/Carrusel";

export default function Bienvenida() {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: juegosData, loading: juegosLoading, error: juegosError } = useQuery(
        GET_ULTIMOS_ESTRENOS,
        { variables: { limit: 25 } }
    );

    const { data: seriesData, loading: seriesLoading, error: seriesError } = useQuery(
        GET_ULTIMOS_ESTRENOS_SERIES,
        { variables: { limit: 25 } }
    );

    const { data: animadosData, loading: animadosLoading, error: animadosError } = useQuery(
        GET_ULTIMOS_ESTRENOS_ANIMADOS,
        { variables: { limit: 25 } }
    );

    const { data: animesData, loading: animesLoading, error: animesError } = useQuery(
        GET_ULTIMOS_ESTRENOS_ANIMES,
        { variables: { limit: 25 } }
    );

    if (juegosLoading || seriesLoading || animadosLoading || animesLoading)
        return <p style={{ color: "#ccc" }}>Cargando…</p>;

    if (juegosError || seriesError || animadosError || animesError)
        return <p style={{ color: "red" }}>Error al cargar datos.</p>;

    const juegos = juegosData?.ultimosEstrenos?.juegos || [];
    const series = seriesData?.ultimosEstrenosSeries?.series || [];
    const animados = animadosData?.ultimosEstrenosAnimados?.series || [];
    const animes = animesData?.ultimosEstrenosAnimes?.animes || [];

    return (
        <>
            <div className="bienvenida-nuevo">
                <section className="bienvenida-nuevo-hero">
                    <div className="bienvenida-nuevo-hero-content">
                        <h1 className="bienvenida-nuevo-title">
                            <span className="text-purple-neon">PixelPlay Habana</span>
                        </h1>
                        <p className="bienvenida-nuevo-descripcion">
                            PixelPlay Habana es el punto de encuentro para los amantes de los videojuegos de PC y las mejores series.
                            Nuestro catálogo reúne estrenos y clásicos cuidadosamente seleccionados pensados para que encuentres justo
                            lo que buscas. Explora y descubre nuevas aventuras digitales o maratones imperdibles, todo en un solo lugar.
                        </p>
                    </div>

                    <div className="bienvenida-nuevo-categorias">
                        <button
                            className="bienvenida-nuevo-categoria"
                            onClick={() => navigate("/catalogo-juegos", { state: { from: location.pathname } })}
                        >
                            <span className="bienvenida-nuevo-categoria-icon">🎮</span>
                            <span className="bienvenida-nuevo-categoria-nombre">Juegos</span>
                        </button>
                        <button
                            className="bienvenida-nuevo-categoria"
                            onClick={() => navigate("/catalogo-series", { state: { from: location.pathname } })}
                        >
                            <span className="bienvenida-nuevo-categoria-icon">🎬</span>
                            <span className="bienvenida-nuevo-categoria-nombre">Series</span>
                        </button>
                        <button
                            className="bienvenida-nuevo-categoria"
                            onClick={() => navigate("/catalogo-animados", { state: { from: location.pathname } })}
                        >
                            <span className="bienvenida-nuevo-categoria-icon">🐭</span>
                            <span className="bienvenida-nuevo-categoria-nombre">Animados</span>
                        </button>
                        <button
                            className="bienvenida-nuevo-categoria"
                            onClick={() => navigate("/catalogo-animes", { state: { from: location.pathname } })}
                        >
                            <span className="bienvenida-nuevo-categoria-icon">🍥</span>
                            <span className="bienvenida-nuevo-categoria-nombre">Animes</span>
                        </button>
                    </div>
                </section>

                <section className="bienvenida-nuevo-lanzamientos">
                    <h2 className="bienvenida-nuevo-section-title">⚡ Últimos lanzamientos</h2>

                    <div className="bienvenida-nuevo-carruseles">
                        <div className="bienvenida-nuevo-carrusel-wrapper">
                            <div className="bienvenida-nuevo-carrusel-header">
                                <span className="bienvenida-nuevo-carrusel-titulo">🎮 Juegos</span>
                                <button
                                    className="bienvenida-nuevo-carrusel-ver"
                                    onClick={() => navigate("/catalogo-juegos", { state: { from: location.pathname } })}
                                >
                                    Ver todos →
                                </button>
                            </div>
                            <Carrusel
                                items={juegos.map((j) => ({
                                    portada: `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${j.Portada}`,
                                    id: j.Id,
                                    tipo: "juego",
                                }))}
                            />
                        </div>

                        <div className="bienvenida-nuevo-carrusel-wrapper">
                            <div className="bienvenida-nuevo-carrusel-header">
                                <span className="bienvenida-nuevo-carrusel-titulo">🎬 Series</span>
                                <button
                                    className="bienvenida-nuevo-carrusel-ver"
                                    onClick={() => navigate("/catalogo-series", { state: { from: location.pathname } })}
                                >
                                    Ver todas →
                                </button>
                            </div>
                            <Carrusel
                                items={series.map((s) => ({
                                    portada: `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${s.Portada}`,
                                    id: s.Id,
                                    tipo: "serie",
                                }))}
                            />
                        </div>

                        <div className="bienvenida-nuevo-carrusel-wrapper">
                            <div className="bienvenida-nuevo-carrusel-header">
                                <span className="bienvenida-nuevo-carrusel-titulo">🐭 Animados</span>
                                <button
                                    className="bienvenida-nuevo-carrusel-ver"
                                    onClick={() => navigate("/catalogo-animados", { state: { from: location.pathname } })}
                                >
                                    Ver todos →
                                </button>
                            </div>
                            <Carrusel
                                items={animados.map((a) => ({
                                    portada: `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Animados/${a.Portada}`,
                                    id: a.Id,
                                    tipo: "animado",
                                }))}
                            />
                        </div>

                        <div className="bienvenida-nuevo-carrusel-wrapper">
                            <div className="bienvenida-nuevo-carrusel-header">
                                <span className="bienvenida-nuevo-carrusel-titulo">🍥 Animes</span>
                                <button
                                    className="bienvenida-nuevo-carrusel-ver"
                                    onClick={() => navigate("/catalogo-animes", { state: { from: location.pathname } })}
                                >
                                    Ver todos →
                                </button>
                            </div>
                            <Carrusel
                                items={animes.map((an) => ({
                                    portada: `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Anime/${an.Portada}`,
                                    id: an.Id,
                                    tipo: "anime",
                                }))}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}