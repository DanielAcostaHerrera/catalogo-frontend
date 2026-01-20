import { useState, useRef } from "react";
import { Query } from "react-apollo";
import { GET_ULTIMOS_ESTRENOS } from "../graphql";
import JuegoCard from "../components/JuegoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import Toast from "../components/Toast";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function UltimosEstrenos() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // 🔹 Página desde la URL (o 1 si no existe)
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

    // 🔹 Estado visible (input) y estado real (backend)
    const [limitInput, setLimitInput] = useState(searchParams.get("limit") || "10");
    const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);

    // 🔹 Toast
    const toastRef = useRef();
    const showToast = (msg) => {
        if (toastRef.current) toastRef.current.showToast(msg);
    };

    // 🔹 Variables para GraphQL (siempre con valor válido)
    const variables = { page, limit };

    // 🔹 Solo permitir números en el input
    const soloNumeros = (e) => {
        const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
        }
    };

    // 🔹 Manejo en tiempo real
    const manejarLimitInput = (valor) => {
        setLimitInput(valor);

        if (valor === "") {
            // input vacío → backend usa 10 por defecto
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

    return (
        <div className="catalogo-container">
            <Toast ref={toastRef} />

            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Últimos Estrenos PixelPlay Habana
            </h2>

            {/* Input para cantidad */}
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

            {/* Query */}
            <Query query={GET_ULTIMOS_ESTRENOS} variables={variables}>
                {({ loading, error, data }) => {
                    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                    const juegos = data?.ultimosEstrenos?.juegos || [];
                    // 🔹 El total de páginas depende de lo que realmente se muestra
                    const totalPages = Math.max(1, Math.ceil(juegos.length / limit));

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
