import { useState } from "react";
import { Query } from "react-apollo";
import { GET_CATALOGO, GET_CATALOGO_FILTRADO } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import "../App.css";

export default function Catalogo() {
    const [page, setPage] = useState(1);
    const [limit] = useState(100);

    const [filtros, setFiltros] = useState({
        nombre: "",
        tamanoMin: "",
        tamanoMax: "",
        annoMin: "",
        annoMax: "",
        precioMin: "",
        precioMax: "",
    });

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
        setPage(1);
    };

    return (
        <div style={{ backgroundColor: "#1e1e1e", minHeight: "100vh", padding: "20px" }}>
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Juegos PixelPlay Habana
            </h2>

            {/* 🔹 Bloque de filtros con clase para responsividad */}
            <div className="filtros-grid">
                <div>
                    <label style={{ color: "#f0f0f0" }}>Nombre</label>
                    <input
                        type="text"
                        placeholder="Buscar por nombre…"
                        value={filtros.nombre}
                        onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Año mínimo</label>
                    <input
                        type="number"
                        value={filtros.annoMin}
                        onChange={(e) => setFiltros({ ...filtros, annoMin: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Año máximo</label>
                    <input
                        type="number"
                        value={filtros.annoMax}
                        onChange={(e) => setFiltros({ ...filtros, annoMax: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Tamaño mínimo (GB)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={filtros.tamanoMin}
                        onChange={(e) => setFiltros({ ...filtros, tamanoMin: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Tamaño máximo (GB)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={filtros.tamanoMax}
                        onChange={(e) => setFiltros({ ...filtros, tamanoMax: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Precio mínimo</label>
                    <input
                        type="number"
                        step="100"
                        value={filtros.precioMin}
                        onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>

                <div>
                    <label style={{ color: "#f0f0f0" }}>Precio máximo</label>
                    <input
                        type="number"
                        step="100"
                        value={filtros.precioMax}
                        onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                        style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                </div>
            </div>

            {/* 🔹 Botón de reinicio */}
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

            <Query query={query} variables={variables}>
                {({ loading, error, data }) => {
                    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                    const juegos = data?.catalogo || data?.catalogoFiltrado || [];

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

                            {/* 🔹 Paginación */}
                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{
                                        marginRight: "10px",
                                        padding: "8px 12px",
                                        backgroundColor: "#333",
                                        color: "#f0f0f0",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: page === 1 ? "not-allowed" : "pointer",
                                    }}
                                >
                                    Anterior
                                </button>
                                <span style={{ color: "#f0f0f0" }}>Página {page}</span>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    style={{
                                        marginLeft: "10px",
                                        padding: "8px 12px",
                                        backgroundColor: "#333",
                                        color: "#f0f0f0",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    );
                }}
            </Query>
        </div>
    );
}