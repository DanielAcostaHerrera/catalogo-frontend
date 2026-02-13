import { useState } from "react";
import { Query } from "react-apollo";
import { GET_ULTIMOS_ESTRENOS_SERIES } from "../graphql";
import SerieCard from "../components/SerieCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams } from "react-router-dom";

export default function UltimosEstrenosSeries({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limitInput, setLimitInput] = useState(searchParams.get("limit") || "10");
    const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);

    const variables = { page: 1, limit };

    const soloNumeros = (e) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    const manejarLimitInput = (valor) => {
        setLimitInput(valor);

        if (valor === "") {
            setLimit(10);
            setPage(1);
            setSearchParams({ page: 1, limit: 10 });
            return;
        }

        const num = parseInt(valor);
        if (!isNaN(num) && num > 0) {
            setLimit(num);
            setPage(1);
            setSearchParams({ page: 1, limit: num });
        }
    };

    const PAGE_SIZE = 100;

    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Últimos Estrenos (Series)
            </h2>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#f0f0f0", marginRight: "10px" }}>
                    Mostrar:
                </label>
                <input
                    type="text"
                    value={limitInput}
                    onChange={(e) => manejarLimitInput(e.target.value)}
                    onKeyDown={soloNumeros}
                    className="filtro-input"
                    style={{ width: "80px", textAlign: "center" }}
                />
            </div>

            <Query query={GET_ULTIMOS_ESTRENOS_SERIES} variables={variables}>
                {({ loading, error, data }) => {
                    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                    const series = data?.ultimosEstrenosSeries?.series || [];

                    const totalPages = Math.max(1, Math.ceil(limit / PAGE_SIZE));

                    const startIndex = (page - 1) * PAGE_SIZE;
                    const endIndex = startIndex + PAGE_SIZE;
                    const seriesPagina = series.slice(startIndex, endIndex);

                    return (
                        <>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {seriesPagina.map((s) => (
                                    <SerieCard
                                        key={s.Id}
                                        serie={s}
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
                        </>
                    );
                }}
            </Query>
        </div>
    );
}