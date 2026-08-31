import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ULTIMOS_ESTRENOS } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams } from "react-router-dom";

export default function UltimosEstrenos({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limitInput, setLimitInput] = useState(searchParams.get("limit") || "10");
    const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
    const [tempLimit, setTempLimit] = useState(limitInput);

    const variables = { page: 1, limit };

    const soloNumeros = (e) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const num = parseInt(tempLimit);
        if (!isNaN(num) && num > 0) {
            setLimit(num);
            setLimitInput(tempLimit);
            setPage(1);
            setSearchParams({ page: 1, limit: num });
        } else {
            setTempLimit(limitInput);
        }
    };

    const PAGE_SIZE = 100;

    const { loading, error, data } = useQuery(GET_ULTIMOS_ESTRENOS, {
        variables,
        fetchPolicy: "network-only",
    });

    if (loading) {
        return (
            <div className="catalogo-container-moderno">
                <p className="catalogo-status">Cargando…</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="catalogo-container-moderno">
                <p className="catalogo-status catalogo-status--error">Error: {error.message}</p>
            </div>
        );
    }

    const juegos = data?.ultimosEstrenos?.juegos || [];
    const totalPages = Math.max(1, Math.ceil(limit / PAGE_SIZE));
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const juegosPagina = juegos.slice(startIndex, endIndex);

    return (
        <div className="catalogo-container-moderno">
            <div className="catalogo-header-moderno">
                <p className="store-kicker">Juegos</p>
                <h1 className="catalogo-titulo-moderno">Últimos estrenos</h1>
                <p className="catalogo-subtitulo-moderno">
                    Los juegos más recientes añadidos al catálogo
                </p>
            </div>

            <form onSubmit={handleSubmit} className="ultimos-estrenos-form">
                <label className="ultimos-estrenos-label">
                    Mostrar:
                </label>
                <input
                    type="text"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(e.target.value)}
                    onKeyDown={soloNumeros}
                    className="ultimos-estrenos-input"
                />
                <button type="submit" className="btn-dark">
                    Actualizar
                </button>
            </form>

            <div className="catalogo-grid-moderno">
                {juegosPagina.map((j) => (
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
                    const params = { page: p, limit };
                    setSearchParams(params);
                }}
            />
        </div>
    );
}
