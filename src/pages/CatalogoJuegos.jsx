import { useState } from "react";
import { Query } from "react-apollo";
import { GET_CATALOGO, GET_CATALOGO_FILTRADO } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useRef } from "react";
import Toast from "../components/Toast";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function CatalogoJuegos() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = useAuth();
    const navigate = useNavigate();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);

    const [annoMinTemp, setAnnoMinTemp] = useState(searchParams.get("annoMin") || "");
    const [annoMaxTemp, setAnnoMaxTemp] = useState(searchParams.get("annoMax") || "");

    const [filtros, setFiltros] = useState({
        nombre: searchParams.get("nombre") || "",
        tamanoMin: searchParams.get("tamanoMin") || "",
        tamanoMax: searchParams.get("tamanoMax") || "",
        annoMin: searchParams.get("annoMin") || "",
        annoMax: searchParams.get("annoMax") || "",
        precioMin: searchParams.get("precioMin") || "",
        precioMax: searchParams.get("precioMax") || "",
    });

    const toastRef = useRef();
    const showToast = (msg) => {
        if (toastRef.current) toastRef.current.showToast(msg);
    };

    useEffect(() => {
        const newPage = Number(searchParams.get("page")) || 1;
        if (newPage !== page) setPage(newPage);

        const newAnnoMin = searchParams.get("annoMin") || "";
        if (newAnnoMin !== annoMinTemp) setAnnoMinTemp(newAnnoMin);

        const newAnnoMax = searchParams.get("annoMax") || "";
        if (newAnnoMax !== annoMaxTemp) setAnnoMaxTemp(newAnnoMax);

        const newFiltros = {
            nombre: searchParams.get("nombre") || "",
            tamanoMin: searchParams.get("tamanoMin") || "",
            tamanoMax: searchParams.get("tamanoMax") || "",
            annoMin: newAnnoMin,
            annoMax: newAnnoMax,
            precioMin: searchParams.get("precioMin") || "",
            precioMax: searchParams.get("precioMax") || "",
        };

        if (JSON.stringify(newFiltros) !== JSON.stringify(filtros)) {
            setFiltros(newFiltros);
        }
    }, [searchParams]);

    const actualizarFiltro = (campo, valor) => {
        const newFiltros = { ...filtros, [campo]: valor };
        setFiltros(newFiltros);

        setPage(1);

        const newParams = new URLSearchParams(searchParams);
        if (valor) {
            newParams.set(campo, valor);
        } else {
            newParams.delete(campo);
        }

        newParams.set("page", 1);

        const estabaVacio = !searchParams.get(campo);
        if (estabaVacio && valor) {
            setSearchParams(newParams);
        } else {
            setSearchParams(newParams, { replace: true });
        }
    };

    const validarRango = (campoMin, campoMax, tipo) => {
        const min = filtros[campoMin];
        const max = filtros[campoMax];

        if (min !== "" && max !== "") {
            const minVal = tipo === "decimal" ? parseFloat(min) : parseInt(min);
            const maxVal = tipo === "decimal" ? parseFloat(max) : parseInt(max);

            if (!isNaN(minVal) && !isNaN(maxVal)) {
                if (minVal > maxVal) {
                    alert(
                        `El ${campoMax.includes("tamano") ? "tamaño máximo" :
                            campoMax.includes("anno") ? "año máximo" :
                                "precio máximo"} debe ser mayor o igual al ${campoMin.includes("tamano") ? "tamaño mínimo" :
                                    campoMin.includes("anno") ? "año mínimo" :
                                        "precio mínimo"}`
                    );
                    setFiltros((prev) => ({ ...prev, [campoMax]: "" }));
                }
            }
        }
    };

    const validarAnno = (campo, valor) => {
        if (valor === "") return;
        const year = parseInt(valor);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1970 || year > currentYear) {
            alert(`Debe ingresar un año válido entre 1970 y ${currentYear}`);
            actualizarFiltro(campo, "");
        }
    };

    const soloAnios = (e) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    const manejarAnno = (campo, valor, setTemp) => {
        if (valor === "") {
            setTemp("");
            setFiltros((prev) => ({ ...prev, [campo]: "" }));
            const p = new URLSearchParams(searchParams);
            p.delete(campo);
            p.set("page", 1);
            setSearchParams(p, { replace: true });
            return;
        }

        if (valor.length > 4) return;
        setTemp(valor);

        if (valor.length < 4) return;

        const year = parseInt(valor);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1970 || year > currentYear) {
            alert(`Debe ingresar un año válido entre 1970 y ${currentYear}`);
            setTemp("");
            setFiltros((prev) => ({ ...prev, [campo]: "" }));
            const newParams = new URLSearchParams(searchParams);
            newParams.delete(campo);
            newParams.set("page", 1);
            setSearchParams(newParams, { replace: true });
            return;
        }

        const yearStr = year.toString();
        setFiltros((prev) => ({ ...prev, [campo]: yearStr }));
        setPage(1);

        const newParams = new URLSearchParams(searchParams);
        newParams.set(campo, yearStr);
        newParams.set("page", 1);
        setSearchParams(newParams, { replace: true });

        const otroCampo = campo === "annoMin" ? "annoMax" : "annoMin";
        const otroTemp = otroCampo === "annoMin" ? annoMinTemp : annoMaxTemp;
        if (otroTemp && otroTemp.length === 4) {
            const otroYear = parseInt(otroTemp);
            if (campo === "annoMin" && year > otroYear) {
                alert("El año mínimo debe ser menor o igual al año máximo");
                setAnnoMinTemp("");
                setFiltros((prev) => ({ ...prev, annoMin: "" }));
                const p = new URLSearchParams(searchParams);
                p.delete("annoMin");
                p.set("page", 1);
                setSearchParams(p, { replace: true });
            }
            if (campo === "annoMax" && year < otroYear) {
                alert("El año máximo debe ser mayor o igual al año mínimo");
                setAnnoMaxTemp("");
                setFiltros((prev) => ({ ...prev, annoMax: "" }));
                const p = new URLSearchParams(searchParams);
                p.delete("annoMax");
                p.set("page", 1);
                setSearchParams(p, { replace: true });
            }
        }
    };

    const soloNumeros = (e, permitirDecimal = false) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
        if (permitirDecimal) allowed.push(".");
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    const query =
        filtros.nombre ||
            filtros.tamanoMin ||
            filtros.tamanoMax ||
            filtros.annoMin ||
            filtros.annoMax ||
            filtros.precioMin ||
            filtros.precioMax
            ? GET_CATALOGO_FILTRADO
            : GET_CATALOGO;

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

        setAnnoMinTemp("");
        setAnnoMaxTemp("");
        setPage(1);

        setSearchParams({ page: 1 });
    };

    return (
        <div className="catalogo-container">
            <Toast ref={toastRef} />

            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Juegos
            </h2>

            {auth.isLogged && (
                <button
                    className="btn-dark"
                    style={{ marginBottom: 15 }}
                    onClick={() => navigate("/insertar-juego", { state: { from: location.pathname } })}
                >
                    Añadir Juego
                </button>
            )}

            <div className="filtros-grid">

                <div className="filtro-nombre">
                    <label style={{ color: "#f0f0f0" }}>Nombre</label>
                    <input
                        type="text"
                        value={filtros.nombre}
                        onChange={(e) => actualizarFiltro("nombre", e.target.value)}
                        className="filtro-input"
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Año mínimo</label>
                    <input
                        type="text"
                        value={annoMinTemp}
                        onChange={(e) => manejarAnno("annoMin", e.target.value, setAnnoMinTemp)}
                        onKeyDown={soloAnios}
                        className="filtro-input"
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Año máximo</label>
                    <input
                        type="text"
                        value={annoMaxTemp}
                        onChange={(e) => manejarAnno("annoMax", e.target.value, setAnnoMaxTemp)}
                        onKeyDown={soloAnios}
                        className="filtro-input"
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Tamaño mínimo</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            value={filtros.tamanoMin}
                            onChange={(e) => {
                                const next = e.target.value.replace(",", ".");
                                actualizarFiltro("tamanoMin", next);
                            }}
                            onBlur={() => {
                                if (filtros.tamanoMin !== "" && filtros.tamanoMax !== "") {
                                    const minVal = parseFloat(filtros.tamanoMin);
                                    const maxVal = parseFloat(filtros.tamanoMax);
                                    if (minVal > maxVal) {
                                        alert("El tamaño mínimo debe ser menor o igual al tamaño máximo");
                                        setFiltros((prev) => ({ ...prev, tamanoMin: "" }));
                                        const p = new URLSearchParams(searchParams);
                                        p.delete("tamanoMin");
                                        p.set("page", 1);
                                        setSearchParams(p, { replace: true });
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, true)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">GB</span>
                    </div>
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Tamaño máximo</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            value={filtros.tamanoMax}
                            onChange={(e) => {
                                const next = e.target.value.replace(",", ".");
                                actualizarFiltro("tamanoMax", next);
                            }}
                            onBlur={() => {
                                if (filtros.tamanoMin !== "" && filtros.tamanoMax !== "") {
                                    const minVal = parseFloat(filtros.tamanoMin);
                                    const maxVal = parseFloat(filtros.tamanoMax);
                                    if (maxVal < minVal) {
                                        alert("El tamaño máximo debe ser mayor o igual al tamaño mínimo");
                                        setFiltros((prev) => ({ ...prev, tamanoMax: "" }));
                                        const p = new URLSearchParams(searchParams);
                                        p.delete("tamanoMax");
                                        p.set("page", 1);
                                        setSearchParams(p, { replace: true });
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, true)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">GB</span>
                    </div>
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Precio mínimo</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            value={filtros.precioMin}
                            onChange={(e) => actualizarFiltro("precioMin", e.target.value)}
                            onBlur={() => {
                                if (filtros.precioMin !== "" && filtros.precioMax !== "") {
                                    const minVal = parseInt(filtros.precioMin);
                                    const maxVal = parseInt(filtros.precioMax);
                                    if (minVal > maxVal) {
                                        alert("El precio mínimo debe ser menor o igual al precio máximo");
                                        setFiltros((prev) => ({ ...prev, precioMin: "" }));
                                        const p = new URLSearchParams(searchParams);
                                        p.delete("precioMin");
                                        p.set("page", 1);
                                        setSearchParams(p, { replace: true });
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, false)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">CUP</span>
                    </div>
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Precio máximo</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            value={filtros.precioMax}
                            onChange={(e) => actualizarFiltro("precioMax", e.target.value)}
                            onBlur={() => {
                                if (filtros.precioMin !== "" && filtros.precioMax !== "") {
                                    const minVal = parseInt(filtros.precioMin);
                                    const maxVal = parseInt(filtros.precioMax);
                                    if (maxVal < minVal) {
                                        alert("El precio máximo debe ser mayor o igual al precio mínimo");
                                        setFiltros((prev) => ({ ...prev, precioMax: "" }));
                                        const p = new URLSearchParams(searchParams);
                                        p.delete("precioMax");
                                        p.set("page", 1);
                                        setSearchParams(p, { replace: true });
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, false)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">CUP</span>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <button
                    className="btn-dark"
                    onClick={reiniciarCatalogo}
                >
                    Limpiar Filtros
                </button>
            </div>

            <Query query={query} variables={variables}>
                {({ loading, error, data }) => {
                    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                    const juegos = data?.catalogo?.juegos || data?.catalogoFiltrado?.juegos || [];
                    const total = data?.catalogo?.total || data?.catalogoFiltrado?.total || 0;
                    const totalPages = Math.ceil(total / limit);

                    return (
                        <>
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
                        </>
                    );
                }}
            </Query>
        </div>
    );
}

