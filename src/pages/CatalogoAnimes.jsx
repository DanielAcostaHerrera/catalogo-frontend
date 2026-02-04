import { useState, useEffect } from "react";
import { Query } from "react-apollo";
import { GET_CATALOGO_ANIMES, GET_CATALOGO_ANIMES_FILTRADO } from "../graphql";
import AnimeCard from "../components/AnimeCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function CatalogoAnimes() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [limit] = useState(100);
    const [nombre, setNombre] = useState(searchParams.get("nombre") || "");

    useEffect(() => {
        const newPage = Number(searchParams.get("page")) || 1;
        if (newPage !== page) setPage(newPage);

        const newNombre = searchParams.get("nombre") || "";
        if (newNombre !== nombre) setNombre(newNombre);
    }, [searchParams]);

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

    const query = nombre ? GET_CATALOGO_ANIMES_FILTRADO : GET_CATALOGO_ANIMES;
    const variables = { page, limit, titulo: nombre || null };

    return (
        <div className="catalogo-container">
            <h2 style={{ color: "#f0f0f0", marginBottom: "20px" }}>
                Catálogo de Animes
            </h2>

            <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <button
                    className="btn-dark"
                    onClick={() => navigate("/ultimos-estrenos-animes")}
                >
                    Últimos estrenos
                </button>

                {auth.isLogged && (
                    <button
                        className="btn-dark"
                        onClick={() =>
                            navigate("/insertar-anime", {
                                state: { from: location.pathname + location.search }
                            })
                        }
                    >
                        Añadir Anime
                    </button>
                )}
            </div>

            {/* Filtro por nombre */}
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

            {/* Botón de reinicio */}
            <div style={{ marginBottom: "20px" }}>
                <button className="btn-dark" onClick={reiniciarCatalogo}>
                    Limpiar Filtros
                </button>
            </div>

            {/* Query */}
            <Query query={query} variables={variables}>
                {({ loading, error, data }) => {
                    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
                    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

                    const animes =
                        data?.catalogoAnimes?.animes ||
                        data?.catalogoAnimesFiltrado?.animes ||
                        [];
                    const total =
                        data?.catalogoAnimes?.total ||
                        data?.catalogoAnimesFiltrado?.total ||
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
                                {animes.map((a) => (
                                    <AnimeCard
                                        key={a.Id}
                                        anime={a}
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