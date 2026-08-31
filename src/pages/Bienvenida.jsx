import { useEffect, useRef, useReducer } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import {
    GET_ULTIMOS_ESTRENOS,
    GET_ULTIMOS_ESTRENOS_SERIES,
    GET_ULTIMOS_ESTRENOS_ANIMADOS,
    GET_ULTIMOS_ESTRENOS_ANIMES,
} from "../graphql";
import Carrusel from "../components/Carrusel";
import { tamanoAMb } from "../utils/FormatoJuego";

const PORTADAS_BASE = "https://catalogo-backend-f4sk.onrender.com/portadas";

const CATEGORIAS = [
    { ruta: "/catalogo-juegos", icon: "🎮", nombre: "Juegos" },
    { ruta: "/catalogo-series", icon: "🎬", nombre: "Series" },
    { ruta: "/catalogo-animados", icon: "🐭", nombre: "Animados" },
    { ruta: "/catalogo-animes", icon: "🍥", nombre: "Animes" },
];

function coverUrl(folder, fileName) {
    return `${PORTADAS_BASE}/${folder}/${fileName}`;
}

function mapJuegos(juegos) {
    return juegos.map((j) => ({
        portada: coverUrl("Portadas Juegos", j.Portada),
        id: j.Id,
        tipo: "juego",
        titulo: j.Nombre,
        meta: [j.AnnoAct, j.TamanoFormateado].filter(Boolean).join(" · "),
    }));
}

function mapSeriesLike(items, folder, tipo) {
    return items.map((s) => ({
        portada: coverUrl(folder, s.Portada),
        id: s.Id,
        tipo,
        titulo: s.Titulo,
        meta: [s.Anno, s.Temporadas != null ? `${s.Temporadas} temp.` : null]
            .filter(Boolean)
            .join(" · "),
    }));
}

function CarruselSkeleton() {
    return (
        <div className="carousel-skeleton" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="carousel-skeleton-card" />
            ))}
        </div>
    );
}

function FilaCarrusel({ titulo, verLabel, onVer, loading, error, items }) {
    return (
        <div className="bienvenida-nuevo-carrusel-wrapper">
            <div className="bienvenida-nuevo-carrusel-header">
                <h3 className="bienvenida-nuevo-carrusel-titulo">{titulo}</h3>
                <button type="button" className="bienvenida-nuevo-carrusel-ver" onClick={onVer}>
                    {verLabel}
                </button>
            </div>
            {loading && <CarruselSkeleton />}
            {error && <p className="bienvenida-nuevo-error">No se pudo cargar esta sección.</p>}
            {!loading && !error && <Carrusel items={items} />}
        </div>
    );
}

// ============================================================
// REDUCER para manejar el índice de los destacados
// ============================================================
function featuredReducer(state, action) {
    switch (action.type) {
        case "SET_INDEX":
            return { ...state, index: action.payload };
        case "NEXT":
            return {
                ...state,
                index: state.total > 0 ? (state.index + 1) % state.total : 0,
            };
        case "SET_TOTAL":
            return {
                ...state,
                total: action.payload,
                // Si el índice actual es mayor o igual al nuevo total, lo reiniciamos
                index: state.index >= action.payload ? 0 : state.index,
            };
        default:
            return state;
    }
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Bienvenida() {
    const navigate = useNavigate();
    const location = useLocation();
    const go = (path) => navigate(path, { state: { from: location.pathname } });

    const pauseFeaturedRef = useRef(false);

    // -------- QUERIES --------
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

    // -------- DATOS --------
    const juegos = juegosData?.ultimosEstrenos?.juegos || [];
    const series = seriesData?.ultimosEstrenosSeries?.series || [];
    const animados = animadosData?.ultimosEstrenosAnimados?.series || [];
    const animes = animesData?.ultimosEstrenosAnimes?.animes || [];

    // -------- DESTACADOS: Los 5 juegos más grandes de los últimos 25 --------
    const destacados = [...juegos]
        .sort((a, b) => tamanoAMb(b.TamanoFormateado) - tamanoAMb(a.TamanoFormateado))
        .slice(0, 5);

    // -------- useReducer para el índice de destacados --------
    const [featuredState, dispatchFeatured] = useReducer(featuredReducer, {
        index: 0,
        total: destacados.length,
    });

    const featuredIndex = featuredState.index;
    const featured = destacados[featuredIndex] || destacados[0];

    // -------- Sincronizar el total cuando cambian los destacados --------
    useEffect(() => {
        dispatchFeatured({ type: "SET_TOTAL", payload: destacados.length });
    }, [destacados.length]);

    // -------- Auto-play de destacados (cada 5 segundos) --------
    useEffect(() => {
        if (destacados.length < 2) return undefined;

        const id = setInterval(() => {
            if (pauseFeaturedRef.current) return;
            dispatchFeatured({ type: "NEXT" });
        }, 5000);

        return () => clearInterval(id);
    }, [destacados.length]);

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="bienvenida-nuevo">
            {/* ====== HERO ====== */}
            <section className="bienvenida-nuevo-hero">
                <p className="bienvenida-nuevo-kicker">Catálogo digital</p>
                <h1 className="bienvenida-nuevo-title">PixelPlay Habana</h1>
                <p className="bienvenida-nuevo-descripcion">
                    El punto de encuentro para los amantes de los videojuegos de PC y las mejores series.
                    Estrenos y clásicos seleccionados para que encuentres justo lo que buscas.
                </p>

                <div className="bienvenida-nuevo-categorias">
                    {CATEGORIAS.map((cat) => (
                        <button
                            key={cat.ruta}
                            type="button"
                            className="bienvenida-nuevo-categoria"
                            onClick={() => go(cat.ruta)}
                        >
                            <span className="bienvenida-nuevo-categoria-icon">{cat.icon}</span>
                            <span className="bienvenida-nuevo-categoria-nombre">{cat.nombre}</span>
                            <span className="bienvenida-nuevo-categoria-hint">{cat.hint}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* ====== DESTACADOS ====== */}
            <section className="store-featured" aria-label="Destacados">
                {juegosLoading && <div className="store-featured-skeleton" />}
                {juegosError && (
                    <p className="bienvenida-nuevo-error">No se pudieron cargar los destacados.</p>
                )}
                {!juegosLoading && !juegosError && featured && (
                    <div
                        className="store-featured-layout"
                        onMouseEnter={() => {
                            pauseFeaturedRef.current = true;
                        }}
                        onMouseLeave={() => {
                            pauseFeaturedRef.current = false;
                        }}
                    >
                        <button
                            type="button"
                            className="store-featured-main"
                            onClick={() => go(`/juego/${featured.Id}`)}
                        >
                            <img
                                key={featured.Id}
                                src={coverUrl("Portadas Juegos", featured.Portada)}
                                alt={featured.Nombre}
                            />
                        </button>

                        <div className="store-featured-side">
                            <div className="store-featured-info">
                                <span className="store-featured-badge">Destacado en la tienda</span>
                                <h2>{featured.Nombre}</h2>
                                <p>
                                    {[featured.AnnoAct, featured.TamanoFormateado]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>
                            </div>

                            <div className="store-featured-thumbs">
                                {destacados.map((juego, index) => (
                                    <button
                                        type="button"
                                        key={juego.Id}
                                        className={`store-featured-thumb${
                                            index === featuredIndex ? " is-active" : ""
                                        }`}
                                        onMouseEnter={() =>
                                            dispatchFeatured({
                                                type: "SET_INDEX",
                                                payload: index,
                                            })
                                        }
                                        onFocus={() =>
                                            dispatchFeatured({
                                                type: "SET_INDEX",
                                                payload: index,
                                            })
                                        }
                                        onClick={() => go(`/juego/${juego.Id}`)}
                                    >
                                        <img
                                            src={coverUrl("Portadas Juegos", juego.Portada)}
                                            alt=""
                                        />
                                        <span>{juego.Nombre}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ====== CARRUSELES ====== */}
            <section className="bienvenida-nuevo-lanzamientos">
                <div className="bienvenida-nuevo-section-head">
                    <h2 className="bienvenida-nuevo-section-title">Últimos lanzamientos</h2>
                    <p className="bienvenida-nuevo-section-sub">Lo más reciente de cada catálogo</p>
                </div>

                <div className="bienvenida-nuevo-carruseles">
                    <FilaCarrusel
                        titulo="Juegos"
                        verLabel="Ver todos"
                        onVer={() => go("/catalogo-juegos")}
                        loading={juegosLoading}
                        error={juegosError}
                        items={mapJuegos(juegos)}
                    />
                    <FilaCarrusel
                        titulo="Series"
                        verLabel="Ver todas"
                        onVer={() => go("/catalogo-series")}
                        loading={seriesLoading}
                        error={seriesError}
                        items={mapSeriesLike(series, "Portadas Series", "serie")}
                    />
                    <FilaCarrusel
                        titulo="Animados"
                        verLabel="Ver todos"
                        onVer={() => go("/catalogo-animados")}
                        loading={animadosLoading}
                        error={animadosError}
                        items={mapSeriesLike(animados, "Portadas Animados", "animado")}
                    />
                    <FilaCarrusel
                        titulo="Animes"
                        verLabel="Ver todos"
                        onVer={() => go("/catalogo-animes")}
                        loading={animesLoading}
                        error={animesError}
                        items={mapSeriesLike(animes, "Portadas Anime", "anime")}
                    />
                </div>
            </section>
        </div>
    );
}