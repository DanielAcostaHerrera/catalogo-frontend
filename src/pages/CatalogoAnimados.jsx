import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATALOGO_ANIMADOS, GET_CATALOGO_ANIMADOS_FILTRADO } from "../graphql";
import AnimadoCard from "../components/AnimadoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";
import UpdateIcon from "@mui/icons-material/Update";
import AddIcon from "@mui/icons-material/Add";

export default function CatalogoAnimados({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);

    const [nombre, setNombre] = useState(searchParams.get("nombre") || "");
    const [nombreTemp, setNombreTemp] = useState(nombre);

    const [openFiltros, setOpenFiltros] = useState(false);
    const [precios, setPrecios] = useState(null);

    useEffect(() => {
        const newPage = Number(searchParams.get("page")) || 1;
        if (newPage !== page) setPage(newPage);

        const newNombre = searchParams.get("nombre") || "";
        if (newNombre !== nombre) {
            setNombre(newNombre);
            setNombreTemp(newNombre);
        }
    }, [searchParams]);

    useEffect(() => {
        fetch("https://catalogo-backend-f4sk.onrender.com/precios")
            .then(res => res.json())
            .then(setPrecios)
            .catch(err => console.error("Error cargando precios:", err));
    }, []);

    const query = nombre ? GET_CATALOGO_ANIMADOS_FILTRADO : GET_CATALOGO_ANIMADOS;
    const variables = { page, limit, titulo: nombre || null };

    const { loading, error, data } = useQuery(query, { variables });

    if (!precios) return <p style={{ color: "#ccc" }}>Cargando precios…</p>;
    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const animados =
        data?.catalogoAnimados?.series ||
        data?.catalogoAnimadosFiltrado?.series ||
        [];

    const total =
        data?.catalogoAnimados?.total ||
        data?.catalogoAnimadosFiltrado?.total ||
        0;

    const totalPages = Math.ceil(total / limit);

    const actualizarFiltro = (valor) => {
        setNombre(valor);
        setPage(1);

        const newParams = new URLSearchParams(searchParams);
        if (valor) {
            newParams.set("nombre", valor);
        } else {
            newParams.delete("nombre");
        }
        newParams.set("page", 1);

        setSearchParams(newParams, { replace: true });
    };

    const reiniciarCatalogo = () => {
        setNombre("");
        setNombreTemp("");
        setPage(1);
        setSearchParams({});
    };

    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Animados
            </h2>

            {/* BOTONES SUPERIORES */}
            <div className="catalogo-top-buttons">
                <button className="btn-dark" onClick={() => setOpenFiltros(true)}>
                    <span className="btn-icon"><FilterListIcon /></span>
                    <span className="btn-text">Filtros</span>
                </button>

                <button
                    className="btn-dark"
                    onClick={() => navigate("/ultimos-estrenos-animados")}
                >
                    <span className="btn-icon"><UpdateIcon /></span>
                    <span className="btn-text">Últimos estrenos</span>
                </button>

                {auth.isLogged && (
                    <button
                        className="btn-dark"
                        onClick={() =>
                            navigate("/insertar-animado", {
                                state: { from: location.pathname + location.search }
                            })
                        }
                    >
                        <span className="btn-icon"><AddIcon /></span>
                        <span className="btn-text">Añadir Animado</span>
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
                <div className="drawer-filtros-contenido">
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
                            onClick={() => {
                                actualizarFiltro(nombreTemp);
                                setOpenFiltros(false);
                            }}
                        >
                            Aplicar filtros
                        </button>

                        <button
                            className="btn-dark"
                            onClick={() => {
                                reiniciarCatalogo();
                                setOpenFiltros(false);
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </SwipeableDrawer>

            {/* GRID DE ANIMADOS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                }}
            >
                {animados.map((a) => (
                    <AnimadoCard
                        key={a.Id}
                        animado={a}
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



