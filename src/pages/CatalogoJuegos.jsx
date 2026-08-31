import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATALOGO, GET_CATALOGO_FILTRADO } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";
import UpdateIcon from "@mui/icons-material/Update";
import AddIcon from "@mui/icons-material/Add";

export default function CatalogoJuegos({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = useAuth();
    const navigate = useNavigate();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);

    const [openFiltros, setOpenFiltros] = useState(false);

    const [filtros, setFiltros] = useState({
        nombre: searchParams.get("nombre") || "",
        tamanoMin: searchParams.get("tamanoMin") || "",
        tamanoMax: searchParams.get("tamanoMax") || "",
        annoMin: searchParams.get("annoMin") || "",
        annoMax: searchParams.get("annoMax") || "",
        precioMin: searchParams.get("precioMin") || "",
        precioMax: searchParams.get("precioMax") || "",
    });

    const [nombreTemp, setNombreTemp] = useState(filtros.nombre);
    const [tamanoMinTemp, setTamanoMinTemp] = useState(filtros.tamanoMin);
    const [tamanoMaxTemp, setTamanoMaxTemp] = useState(filtros.tamanoMax);
    const [precioMinTemp, setPrecioMinTemp] = useState(filtros.precioMin);
    const [precioMaxTemp, setPrecioMaxTemp] = useState(filtros.precioMax);
    const [annoMinTemp, setAnnoMinTemp] = useState(filtros.annoMin);
    const [annoMaxTemp, setAnnoMaxTemp] = useState(filtros.annoMax);

    const soloAnios = (e) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    const soloNumeros = (e, permitirDecimal = false) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter"];
        if (permitirDecimal) allowed.push(".");
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    const aplicarFiltros = () => {
        const p = new URLSearchParams();

        if (nombreTemp.trim() !== "") {
            p.set("nombre", nombreTemp.trim());
        }

        const currentYear = new Date().getFullYear();

        if (annoMinTemp !== "") {
            const y = parseInt(annoMinTemp);
            if (isNaN(y) || y < 1970 || y > currentYear) {
                alert(`Año mínimo inválido. Debe estar entre 1970 y ${currentYear}`);
                return;
            }
            p.set("annoMin", y.toString());
        }

        if (annoMaxTemp !== "") {
            const y = parseInt(annoMaxTemp);
            if (isNaN(y) || y < 1970 || y > currentYear) {
                alert(`Año máximo inválido. Debe estar entre 1970 y ${currentYear}`);
                return;
            }
            p.set("annoMax", y.toString());
        }

        if (annoMinTemp !== "" && annoMaxTemp !== "") {
            if (parseInt(annoMinTemp) > parseInt(annoMaxTemp)) {
                alert("El año mínimo no puede ser mayor que el año máximo");
                return;
            }
        }

        if (tamanoMinTemp !== "") {
            const min = parseFloat(tamanoMinTemp);
            if (isNaN(min) || min < 0) {
                alert("Tamaño mínimo inválido");
                return;
            }
            p.set("tamanoMin", min.toString());
        }

        if (tamanoMaxTemp !== "") {
            const max = parseFloat(tamanoMaxTemp);
            if (isNaN(max) || max < 0) {
                alert("Tamaño máximo inválido");
                return;
            }
            p.set("tamanoMax", max.toString());
        }

        if (tamanoMinTemp !== "" && tamanoMaxTemp !== "") {
            if (parseFloat(tamanoMinTemp) > parseFloat(tamanoMaxTemp)) {
                alert("El tamaño mínimo no puede ser mayor que el tamaño máximo");
                return;
            }
        }

        if (precioMinTemp !== "") {
            const min = parseInt(precioMinTemp);
            if (isNaN(min) || min < 0) {
                alert("Precio mínimo inválido");
                return;
            }
            p.set("precioMin", min.toString());
        }

        if (precioMaxTemp !== "") {
            const max = parseInt(precioMaxTemp);
            if (isNaN(max) || max < 0) {
                alert("Precio máximo inválido");
                return;
            }
            p.set("precioMax", max.toString());
        }

        if (precioMinTemp !== "" && precioMaxTemp !== "") {
            if (parseInt(precioMinTemp) > parseInt(precioMaxTemp)) {
                alert("El precio mínimo no puede ser mayor que el precio máximo");
                return;
            }
        }

        p.set("page", 1);
        setPage(1);

        setFiltros({
            nombre: p.get("nombre") || "",
            tamanoMin: p.get("tamanoMin") || "",
            tamanoMax: p.get("tamanoMax") || "",
            annoMin: p.get("annoMin") || "",
            annoMax: p.get("annoMax") || "",
            precioMin: p.get("precioMin") || "",
            precioMax: p.get("precioMax") || "",
        });

        setSearchParams(p);
        setOpenFiltros(false);
    };

    const reiniciarCatalogo = () => {
        setFiltros({
            nombre: "",
            tamanoMin: "",
            tamanoMax: "",
            annoMin: "",
            annoMax: "",
            precioMin: "",
            precioMax: "",
        });

        setNombreTemp("");
        setTamanoMinTemp("");
        setTamanoMaxTemp("");
        setPrecioMinTemp("");
        setPrecioMaxTemp("");
        setAnnoMinTemp("");
        setAnnoMaxTemp("");

        setPage(1);
        setSearchParams({ page: 1 });
        setOpenFiltros(false);
    };

    const hayFiltros =
        filtros.nombre ||
        filtros.tamanoMin ||
        filtros.tamanoMax ||
        filtros.annoMin ||
        filtros.annoMax ||
        filtros.precioMin ||
        filtros.precioMax;

    const query = hayFiltros ? GET_CATALOGO_FILTRADO : GET_CATALOGO;

    const variables = {
        page,
        limit,
        nombre: filtros.nombre || null,
        tamanoMin: filtros.tamanoMin !== "" ? parseFloat(filtros.tamanoMin) : undefined,
        tamanoMax: filtros.tamanoMax !== "" ? parseFloat(filtros.tamanoMax) : undefined,
        annoMin: filtros.annoMin !== "" ? parseInt(filtros.annoMin) : undefined,
        annoMax: filtros.annoMax !== "" ? parseInt(filtros.annoMax) : undefined,
        precioMin: filtros.precioMin !== "" ? parseInt(filtros.precioMin) : undefined,
        precioMax: filtros.precioMax !== "" ? parseInt(filtros.precioMax) : undefined,
    };

    const { loading, error, data } = useQuery(query, {
        variables,
        fetchPolicy: "network-only",
    });

    if (loading) return <p className="catalogo-status">Cargando…</p>;
    if (error) return <p className="catalogo-status catalogo-status--error">Error: {error.message}</p>;

    const juegos =
        data?.catalogo?.juegos ||
        data?.catalogoFiltrado?.juegos ||
        [];

    const total =
        data?.catalogo?.total ||
        data?.catalogoFiltrado?.total ||
        0;

    const totalPages = Math.ceil(total / limit);

    const handleSubmit = (e) => {
        e.preventDefault();
        aplicarFiltros();
    };

    return (
        <>
            <div className="catalogo-container-moderno">
                {/* HEADER DEL CATÁLOGO */}
                <div className="catalogo-header-moderno">
                    <h1 className="catalogo-titulo-moderno">🎮 Catálogo de Juegos</h1>
                    <p className="catalogo-subtitulo-moderno">
                        Explora nuestra colección de juegos para PC
                    </p>
                </div>

                {/* BOTONES SUPERIORES */}
                <div className="catalogo-top-buttons-moderno">
                    <button className="btn-dark" onClick={() => setOpenFiltros(true)}>
                        <span className="btn-text">Filtros</span>
                        <span className="btn-icon"><FilterListIcon /></span>
                    </button>

                    {hayFiltros && (
                        <button className="btn-dark" onClick={reiniciarCatalogo}>
                            <span className="btn-icon">✕</span>
                            <span className="btn-text">Limpiar filtros</span>
                        </button>
                    )}

                    <button className="btn-dark" onClick={() => navigate("/ultimos-estrenos-juegos")}>
                        <span className="btn-text">Últimos estrenos</span>
                        <span className="btn-icon"><UpdateIcon /></span>
                    </button>

                    {auth.isLogged && (
                        <button
                            className="btn-dark"
                            onClick={() =>
                                navigate("/insertar-juego", { state: { from: location.pathname } })
                            }
                        >
                            <span className="btn-text">Añadir juego</span>
                            <span className="btn-icon"><AddIcon /></span>
                        </button>
                    )}
                </div>

                {/* DRAWER DE FILTROS */}
                <SwipeableDrawer
                    anchor="right"
                    open={openFiltros}
                    onClose={() => setOpenFiltros(false)}
                    onOpen={() => setOpenFiltros(true)}
                    disableDiscovery={true}
                    disableSwipeToOpen={true}
                >
                    <form className="drawer-filtros-contenido" onSubmit={handleSubmit}>
                        <h3 className="drawer-filtros-titulo">Filtros</h3>

                        <div className="filtro-nombre">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                value={nombreTemp}
                                onChange={(e) => setNombreTemp(e.target.value)}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-nombre">
                            <label htmlFor="annoMin">Año mínimo</label>
                            <input
                                id="annoMin"
                                type="text"
                                value={annoMinTemp}
                                onChange={(e) => setAnnoMinTemp(e.target.value)}
                                onKeyDown={soloAnios}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-nombre">
                            <label htmlFor="annoMax">Año máximo</label>
                            <input
                                id="annoMax"
                                type="text"
                                value={annoMaxTemp}
                                onChange={(e) => setAnnoMaxTemp(e.target.value)}
                                onKeyDown={soloAnios}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-nombre">
                            <label htmlFor="tamanoMin">Tamaño mínimo (Gb)</label>
                            <input
                                id="tamanoMin"
                                type="text"
                                value={tamanoMinTemp}
                                onChange={(e) => setTamanoMinTemp(e.target.value.replace(",", "."))}
                                onKeyDown={(e) => soloNumeros(e, true)}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-nombre">
                            <label htmlFor="tamanoMax">Tamaño máximo (Gb)</label>
                            <input
                                id="tamanoMax"
                                type="text"
                                value={tamanoMaxTemp}
                                onChange={(e) => setTamanoMaxTemp(e.target.value.replace(",", "."))}
                                onKeyDown={(e) => soloNumeros(e, true)}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-nombre">
                            <label htmlFor="precioMin">Precio mínimo (CUP)</label>
                            <input
                                id="precioMin"
                                type="text"
                                value={precioMinTemp}
                                onChange={(e) => setPrecioMinTemp(e.target.value)}
                                onKeyDown={(e) => soloNumeros(e, false)}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-nombre">
                            <label htmlFor="precioMax">Precio máximo (CUP)</label>
                            <input
                                id="precioMax"
                                type="text"
                                value={precioMaxTemp}
                                onChange={(e) => setPrecioMaxTemp(e.target.value)}
                                onKeyDown={(e) => soloNumeros(e, false)}
                                className="filtro-input"
                            />
                        </div>

                        <div className="drawer-filtros-botones">
                            <button type="submit" className="btn-dark">
                                Aplicar filtros
                            </button>
                            <button
                                type="button"
                                className="btn-dark"
                                onClick={reiniciarCatalogo}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </form>
                </SwipeableDrawer>

                {/* GRID DE JUEGOS */}
                <div className="catalogo-grid-moderno">
                    {juegos.map((j) => (
                        <JuegoCard
                            key={j.Id}
                            juego={j}
                            showToast={showToast}
                            from={location.pathname + location.search}
                        />
                    ))}
                </div>

                {/* PAGINACIÓN */}
                <Paginacion
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                        setPage(p);
                        const params = {
                            ...Object.fromEntries(searchParams.entries()),
                            page: p,
                        };
                        setSearchParams(params);
                    }}
                />
            </div>
        </>
    );
}