import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATALOGO_ANIMES, GET_CATALOGO_ANIMES_FILTRADO } from "../graphql";
import AnimeCard from "../components/AnimeCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";
import UpdateIcon from "@mui/icons-material/Update";
import AddIcon from "@mui/icons-material/Add";

export default function CatalogoAnimes({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);

    // 🔥 FILTROS FINALES (los que realmente se aplican)
    const [filtros, setFiltros] = useState({
        nombre: searchParams.get("nombre") || "",
    });

    // 🔥 TEMPORALES (inputs sin tiempo real)
    const [nombreTemp, setNombreTemp] = useState(filtros.nombre);

    const [openFiltros, setOpenFiltros] = useState(false);
    const [precios, setPrecios] = useState(null);

    // 🔥 Cargar precios (solo una vez)
    useEffect(() => {
        fetch("https://catalogo-backend-f4sk.onrender.com/precios")
            .then(res => res.json())
            .then(setPrecios)
            .catch(err => console.error("Error cargando precios:", err));
    }, []);

    // 🔥 FUNCIÓN FINAL PARA APLICAR FILTROS
    const aplicarFiltros = () => {
        const p = new URLSearchParams();

        // --- NOMBRE ---
        if (nombreTemp.trim() !== "") {
            p.set("nombre", nombreTemp.trim());
        }

        // --- PAGE ---
        p.set("page", 1);
        setPage(1);

        // --- ACTUALIZAR FILTROS FINALES ---
        setFiltros({
            nombre: p.get("nombre") || "",
        });

        setSearchParams(p);
        setOpenFiltros(false);
    };

    // 🔥 REINICIAR FILTROS
    const reiniciarCatalogo = () => {
        setFiltros({ nombre: "" });
        setNombreTemp("");
        setPage(1);
        setSearchParams({ page: 1 });
        setOpenFiltros(false);
    };

    // 🔥 DECIDIR QUERY SEGÚN FILTROS FINALES
    const hayFiltros = filtros.nombre !== "";

    const query = hayFiltros ? GET_CATALOGO_ANIMES_FILTRADO : GET_CATALOGO_ANIMES;
    const variables = {
        page,
        limit,
        titulo: filtros.nombre || null,
    };

    // 🔥 Apollo
    const { loading, error, data } = useQuery(query, { variables });

    if (!precios) return <p style={{ color: "#ccc" }}>Cargando precios…</p>;
    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const animes =
        data?.catalogoAnimes?.animes ||
        data?.catalogoAnimesFiltrado?.animes ||
        [];

    const total =
        data?.catalogoAnimes?.total ||
        data?.catalogoAnimesFiltrado?.total ||
        0;

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Animes
            </h2>

            {/* BOTONES SUPERIORES */}
            <div className="catalogo-top-buttons">
                <button className="btn-dark" onClick={() => setOpenFiltros(true)}>
                    <span className="btn-icon"><FilterListIcon /></span>
                    <span className="btn-text">Filtros</span>
                </button>

                {/* 🔥 BOTÓN LIMPIAR FILTROS (solo visible si hay filtro aplicado) */}
                {hayFiltros && (
                    <button
                        className="btn-dark"
                        onClick={reiniciarCatalogo}
                    >
                        <span className="btn-icon">✕</span>
                        <span className="btn-text">Limpiar filtros</span>
                    </button>
                )}

                <button
                    className="btn-dark"
                    onClick={() => navigate("/ultimos-estrenos-animes")}
                >
                    <span className="btn-icon"><UpdateIcon /></span>
                    <span className="btn-text">Últimos estrenos</span>
                </button>

                {auth.isLogged && (
                    <button
                        className="btn-dark"
                        onClick={() =>
                            navigate("/insertar-anime", {
                                state: { from: location.pathname + location.search }
                            })
                        }
                    >
                        <span className="btn-icon"><AddIcon /></span>
                        <span className="btn-text">Añadir Anime</span>
                    </button>
                )}
            </div>

            {/* SWIPEABLE DRAWER DE FILTROS */}
            <SwipeableDrawer
                anchor="right"
                open={openFiltros}
                onClose={() => setOpenFiltros(false)}
                onOpen={() => setOpenFiltros(true)}
                disableDiscovery={true}
                disableSwipeToOpen={true}
            >
                <div
                    className="drawer-filtros-contenido"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            aplicarFiltros();
                        }
                    }}
                >
                    <h3 className="drawer-filtros-titulo">Filtros</h3>

                    {/* Nombre */}
                    <div className="filtro-nombre">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={nombreTemp}
                            onChange={(e) => setNombreTemp(e.target.value)}
                            className="filtro-input"
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="drawer-filtros-botones">
                        <button
                            className="btn-dark"
                            onClick={aplicarFiltros}
                        >
                            Aplicar filtros
                        </button>

                        <button
                            className="btn-dark"
                            onClick={() => {
                                setNombreTemp("");
                                reiniciarCatalogo();
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </SwipeableDrawer>

            {/* GRID DE ANIMES */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                }}
            >
                {animes.map((a) => (
                    <AnimeCard
                        key={a.Id}
                        anime={a}
                        from={location.pathname + location.search}
                        showToast={showToast}
                        precioPorCapitulo={Number(precios.series.precioPorCapitulo)}
                    />
                ))}
            </div>

            <Paginacion
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                    setPage(p);
                    const params = {
                        ...Object.fromEntries(searchParams.entries()),
                        page: p
                    };
                    setSearchParams(params);
                }}
            />
        </div>
    );
}
