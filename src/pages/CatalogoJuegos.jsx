import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATALOGO, GET_CATALOGO_FILTRADO } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Drawer from "@mui/material/Drawer";

export default function CatalogoJuegos({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = useAuth();
    const navigate = useNavigate();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);

    const [openFiltros, setOpenFiltros] = useState(false);

    // 🔥 FILTROS FINALES (los que realmente se aplican)
    const [filtros, setFiltros] = useState({
        nombre: searchParams.get("nombre") || "",
        tamanoMin: searchParams.get("tamanoMin") || "",
        tamanoMax: searchParams.get("tamanoMax") || "",
        annoMin: searchParams.get("annoMin") || "",
        annoMax: searchParams.get("annoMax") || "",
        precioMin: searchParams.get("precioMin") || "",
        precioMax: searchParams.get("precioMax") || "",
    });

    // 🔥 TEMPORALES (inputs sin tiempo real)
    const [nombreTemp, setNombreTemp] = useState(filtros.nombre);
    const [tamanoMinTemp, setTamanoMinTemp] = useState(filtros.tamanoMin);
    const [tamanoMaxTemp, setTamanoMaxTemp] = useState(filtros.tamanoMax);
    const [precioMinTemp, setPrecioMinTemp] = useState(filtros.precioMin);
    const [precioMaxTemp, setPrecioMaxTemp] = useState(filtros.precioMax);
    const [annoMinTemp, setAnnoMinTemp] = useState(filtros.annoMin);
    const [annoMaxTemp, setAnnoMaxTemp] = useState(filtros.annoMax);

    // 🔥 VALIDACIONES DE TECLADO
    const soloAnios = (e) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
    };

    const soloNumeros = (e, permitirDecimal = false) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
        if (permitirDecimal) allowed.push(".");
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
    };

    // 🔥 FUNCIÓN FINAL PARA APLICAR FILTROS
    const aplicarFiltros = () => {
        const p = new URLSearchParams();

        // --- NOMBRE ---
        if (nombreTemp.trim() !== "") {
            p.set("nombre", nombreTemp.trim());
        }

        // --- AÑOS ---
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

        // --- TAMAÑOS ---
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

        // --- PRECIOS ---
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

        // --- PAGE ---
        p.set("page", 1);
        setPage(1);

        // --- ACTUALIZAR FILTROS FINALES ---
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

    // 🔥 REINICIAR FILTROS
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

    // 🔥 DECIDIR QUERY SEGÚN FILTROS FINALES
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

    // 🔥 Apollo
    const { loading, error, data } = useQuery(query, { variables });

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const juegos =
        data?.catalogo?.juegos ||
        data?.catalogoFiltrado?.juegos ||
        [];

    const total =
        data?.catalogo?.total ||
        data?.catalogoFiltrado?.total ||
        0;

    const totalPages = Math.ceil(total / limit);


    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Juegos
            </h2>

            {/* BOTONES SUPERIORES */}
            <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <button className="btn-dark" onClick={() => setOpenFiltros(true)}>
                    Filtros
                </button>

                <button className="btn-dark" onClick={() => navigate("/ultimos-estrenos-juegos")}>
                    Últimos estrenos
                </button>

                {auth.isLogged && (
                    <button
                        className="btn-dark"
                        onClick={() =>
                            navigate("/insertar-juego", { state: { from: location.pathname } })
                        }
                    >
                        Añadir Juego
                    </button>
                )}
            </div>

            {/* DRAWER DE FILTROS */}
            <Drawer anchor="right" open={openFiltros} onClose={() => setOpenFiltros(false)}>
                <h3 className="drawer-filtros-titulo">Filtros</h3>

                <div className="drawer-filtros-contenido">

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

                    {/* Año mínimo */}
                    <div>
                        <label>Año mínimo</label>
                        <input
                            type="text"
                            value={annoMinTemp}
                            onChange={(e) => setAnnoMinTemp(e.target.value)}
                            onKeyDown={soloAnios}
                            className="filtro-input"
                        />
                    </div>

                    {/* Año máximo */}
                    <div>
                        <label>Año máximo</label>
                        <input
                            type="text"
                            value={annoMaxTemp}
                            onChange={(e) => setAnnoMaxTemp(e.target.value)}
                            onKeyDown={soloAnios}
                            className="filtro-input"
                        />
                    </div>

                    {/* Tamaño mínimo */}
                    <div>
                        <label>Tamaño mínimo (Gb)</label>
                        <input
                            type="text"
                            value={tamanoMinTemp}
                            onChange={(e) => setTamanoMinTemp(e.target.value.replace(",", "."))}
                            onKeyDown={(e) => soloNumeros(e, true)}
                            className="filtro-input"
                        />
                    </div>

                    {/* Tamaño máximo */}
                    <div>
                        <label>Tamaño máximo (Gb)</label>
                        <input
                            type="text"
                            value={tamanoMaxTemp}
                            onChange={(e) => setTamanoMaxTemp(e.target.value.replace(",", "."))}
                            onKeyDown={(e) => soloNumeros(e, true)}
                            className="filtro-input"
                        />
                    </div>

                    {/* Precio mínimo */}
                    <div>
                        <label>Precio mínimo (CUP)</label>
                        <input
                            type="text"
                            value={precioMinTemp}
                            onChange={(e) => setPrecioMinTemp(e.target.value)}
                            onKeyDown={(e) => soloNumeros(e, false)}
                            className="filtro-input"
                        />
                    </div>

                    {/* Precio máximo */}
                    <div>
                        <label>Precio máximo (CUP)</label>
                        <input
                            type="text"
                            value={precioMaxTemp}
                            onChange={(e) => setPrecioMaxTemp(e.target.value)}
                            onKeyDown={(e) => soloNumeros(e, false)}
                            className="filtro-input"
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="drawer-filtros-botones">
                        <button className="btn-dark" onClick={aplicarFiltros}>
                            Aplicar filtros
                        </button>

                        <button className="btn-dark" onClick={reiniciarCatalogo}>
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </Drawer>


            {/* GRID DE JUEGOS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                }}
            >
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
    );
}