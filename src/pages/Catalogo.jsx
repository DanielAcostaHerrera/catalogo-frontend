import { useState } from "react";
import { Query } from "react-apollo";
import { GET_CATALOGO, GET_CATALOGO_FILTRADO } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";

export default function Catalogo() {
    const [page, setPage] = useState(1);
    const [limit] = useState(100);
    const [annoMinTemp, setAnnoMinTemp] = useState("");
    const [annoMaxTemp, setAnnoMaxTemp] = useState("");

    const [filtros, setFiltros] = useState({
        nombre: "",
        tamanoMin: "",
        tamanoMax: "",
        annoMin: "",
        annoMax: "",
        precioMin: "",
        precioMax: "",
    });

    const actualizarFiltro = (campo, valor) => {
        setFiltros({ ...filtros, [campo]: valor });
        setPage(1);
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
                    // limpiar el último campo escrito
                    setFiltros((prev) => ({ ...prev, [campoMax]: "" }));
                }
            }
        }
    };

    // 🔹 Validación de año solo si hay algo escrito
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
        if (valor.length > 4) return;
        setTemp(valor); // siempre actualiza el input visible

        // 🔹 si aún no hay 4 dígitos, no aplicar filtro ni validar
        if (valor.length < 4) {
            setFiltros((prev) => ({ ...prev, [campo]: "" }));
            return;
        }

        // 🔹 al llegar a 4 dígitos, validar rango permitido
        const year = parseInt(valor);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1970 || year > currentYear) {
            alert(`Debe ingresar un año válido entre 1970 y ${currentYear}`);
            setTemp("");
            setFiltros((prev) => ({ ...prev, [campo]: "" }));
            return;
        }

        // 🔹 aplicar filtro real
        setFiltros((prev) => ({ ...prev, [campo]: year.toString() }));
        setPage(1);

        // 🔹 validación cruzada SOLO después de aplicar filtro real
        const otroCampo = campo === "annoMin" ? "annoMax" : "annoMin";
        const otroTemp = otroCampo === "annoMin" ? annoMinTemp : annoMaxTemp;

        if (otroTemp && otroTemp.length === 4) {
            const otroYear = parseInt(otroTemp);
            if (campo === "annoMin" && year > otroYear) {
                alert("El año mínimo debe ser menor o igual al año máximo");
                setAnnoMinTemp("");
                setFiltros((prev) => ({ ...prev, annoMin: "" }));
            }
            if (campo === "annoMax" && year < otroYear) {
                alert("El año máximo debe ser mayor o igual al año mínimo");
                setAnnoMaxTemp("");
                setFiltros((prev) => ({ ...prev, annoMax: "" }));
            }
        }
    };

    // 🔹 Bloquear letras en inputs numéricos
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
        // Resetear filtros reales
        setFiltros({
            nombre: "",
            tamanoMin: "",
            tamanoMax: "",
            annoMin: "",
            annoMax: "",
            precioMin: "",
            precioMax: "",
        });

        // Resetear estados temporales de año
        setAnnoMinTemp("");
        setAnnoMaxTemp("");

        // Resetear paginación
        setPage(1);
    };

    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Juegos PixelPlay Habana
            </h2>

            {/* 🔹 Bloque de filtros */}
            <div className="filtros-grid">
                {/* Nombre */}
                <div className="filtro-nombre">
                    <label style={{ color: "#f0f0f0" }}>Nombre</label>
                    <input
                        type="text"
                        placeholder="Buscar por nombre…"
                        value={filtros.nombre}
                        onChange={(e) => actualizarFiltro("nombre", e.target.value)}
                        className="filtro-input"
                    />
                </div>

                {/* Año mínimo */}
                <div>
                    <label style={{ color: "#f0f0f0" }}>Año mínimo</label>
                    <input
                        type="text"
                        value={annoMinTemp}
                        onChange={(e) => manejarAnno("annoMin", e.target.value, setAnnoMinTemp)}
                        onBlur={() => {
                            if (annoMinTemp.length === 4 && annoMaxTemp.length === 4) {
                                const minVal = parseInt(annoMinTemp);
                                const maxVal = parseInt(annoMaxTemp);
                                if (minVal > maxVal) {
                                    alert("El año mínimo debe ser menor o igual al año máximo");
                                    setAnnoMinTemp("");
                                    setFiltros((prev) => ({ ...prev, annoMin: "" }));
                                }
                            }
                        }}
                        onKeyDown={soloAnios}
                        className="filtro-input"
                    />
                </div>

                {/* Año máximo */}
                <div>
                    <label style={{ color: "#f0f0f0" }}>Año máximo</label>
                    <input
                        type="text"
                        value={annoMaxTemp}
                        onChange={(e) => manejarAnno("annoMax", e.target.value, setAnnoMaxTemp)}
                        onBlur={() => {
                            if (annoMinTemp.length === 4 && annoMaxTemp.length === 4) {
                                const minVal = parseInt(annoMinTemp);
                                const maxVal = parseInt(annoMaxTemp);
                                if (maxVal < minVal) {
                                    alert("El año máximo debe ser mayor o igual al año mínimo");
                                    setAnnoMaxTemp("");
                                    setFiltros((prev) => ({ ...prev, annoMax: "" }));
                                }
                            }
                        }}
                        onKeyDown={soloAnios}
                        className="filtro-input"
                    />
                </div>

                {/* Tamaño mínimo */}
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
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, true)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">GB</span>
                    </div>
                </div>

                {/* Tamaño máximo */}
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
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, true)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">GB</span>
                    </div>
                </div>

                {/* Precio mínimo */}
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
                                    }
                                }
                            }}
                            onKeyDown={(e) => soloNumeros(e, false)}
                            className="filtro-input"
                        />
                        <span className="filtro-sufijo">CUP</span>
                    </div>
                </div>

                {/* Precio máximo */}
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

            {/* Botón de reinicio */}
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={reiniciarCatalogo}
                    style={{
                        padding: "8px 12px",
                        backgroundColor: "#444",
                        color: "#f0f0f0",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* Query */}
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
                                    <JuegoCard key={j.Id} juego={j} />
                                ))}
                            </div>

                            <Paginacion
                                page={page}
                                totalPages={totalPages}
                                onPageChange={(p) => setPage(p)}
                            />
                        </>
                    );
                }}
            </Query>
        </div>
    );
}
