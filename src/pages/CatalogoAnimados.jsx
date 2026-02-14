import { useState, useEffect } from "react";
import { Query } from "react-apollo";
import { GET_CATALOGO_ANIMADOS, GET_CATALOGO_ANIMADOS_FILTRADO } from "../graphql";
import AnimadoCard from "../components/AnimadoCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function CatalogoAnimados({ showToast }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);
    const [nombre, setNombre] = useState(searchParams.get("nombre") || "");
    const [precios, setPrecios] = useState(null);

    useEffect(() => {
        const newPage = Number(searchParams.get("page")) || 1;
        if (newPage !== page) setPage(newPage);

        const newNombre = searchParams.get("nombre") || "";
        if (newNombre !== nombre) setNombre(newNombre);
    }, [searchParams]);

    useEffect(() => {
        fetch("https://catalogo-backend-f4sk.onrender.com/precios")
            .then(res => res.json())
            .then(setPrecios)
            .catch(err => console.error("Error cargando precios:", err));
    }, []);

    if (!precios) return <p style={{ color: "#ccc" }}>Cargando precios…</p>;

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
        setPage(1);
        setSearchParams({});
    };

    const query = nombre ? GET_CATALOGO_ANIMADOS_FILTRADO : GET_CATALOGO_ANIMADOS;
    const variables = { page, limit, titulo: nombre || null };

    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Animados
            </h2>

            <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <button
                    className="btn-dark"
                    onClick={() => navigate("/ultimos-estrenos-animados")}
                >
                    Últimos estrenos
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
                        Añadir Animado
                    </button>
                )}
            </div>

            <div className="filtros-grid">
                <div className="filtro-nombre">
                    <label style={{ color: "#f0f0f0" }}>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => actualizarFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <button className="btn-dark" onClick={reiniciarCatalogo}>
                    Limpiar Filtros
                </button>
            </div>

            <Query query={query} variables={variables}>
                {({ loading, error, data }) => {
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

                    return (
                        <>
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
                        </>
                    );
                }}
            </Query>
        </div>
    );
}