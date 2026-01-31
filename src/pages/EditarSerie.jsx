import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, Mutation } from "react-apollo";
import "../App.css";
import { useState, useEffect } from "react";
import { ACTUALIZAR_SERIE } from "../mutations";
import { GET_SERIE } from "../graphql";

export default function EditarSerie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [Titulo, setTitulo] = useState("");
    const [Anno, setAnno] = useState("");
    const [Temporadas, setTemporadas] = useState("");
    const [Sinopsis, setSinopsis] = useState("");
    const [Episodios, setEpisodios] = useState("");

    // Normalizar saltos de línea
    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");
    const prepararTexto = (txt) =>
        txt.replace(/\r/g, "").replace(/\n/g, "\\n");

    // Validar año
    const validarAnno = (valor) => {
        if (!/^\d{4}$/.test(valor)) return null;
        const year = Number(valor);
        const currentYear = new Date().getFullYear();
        if (year >= 1970 && year <= currentYear) return year;
        return null;
    };

    // Obtener datos de la serie
    const { loading, error, data } = useQuery(GET_SERIE, {
        variables: { id: Number(id) },
    });

    // Inicializar campos
    useEffect(() => {
        if (data?.serie) {
            const s = data.serie;
            setTitulo(s.Titulo);
            setAnno(String(s.Anno));
            setTemporadas(String(s.Temporadas));
            setSinopsis(normalizarTexto(s.Sinopsis));
            setEpisodios(normalizarTexto(s.Episodios));
        }
    }, [data]);

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const s = data.serie;
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${s.Portada}`;

    // Construir payload
    const construirPayload = () => {
        const payload = { Id: s.Id };

        if (Titulo.trim() === "") {
            alert("El título es obligatorio");
            return null;
        }
        payload.Titulo = Titulo.trim();

        const annoValido = validarAnno(Anno);
        if (annoValido === null) {
            alert("El año debe ser un número válido entre 1970 y el actual");
            return null;
        }
        payload.Anno = annoValido;

        if (Temporadas.trim() === "" || isNaN(Number(Temporadas))) {
            alert("Las temporadas deben ser un número válido");
            return null;
        }
        payload.Temporadas = Number(Temporadas);

        if (Sinopsis.trim() !== "")
            payload.Sinopsis = prepararTexto(Sinopsis);

        if (Episodios.trim() !== "")
            payload.Episodios = prepararTexto(Episodios);

        return payload;
    };

    return (
        <div className="detalle-wrapper">

            {/* VOLVER */}
            <button
                className="btn-volver"
                onClick={() => {
                    if (location.state?.from) {
                        navigate(location.state.from);
                    } else {
                        navigate("/catalogoSeries");
                    }
                }}
            >
                ← Volver
            </button>

            {/* TÍTULO ARRIBA, CENTRADO */}
            <h2 className="detalle-titulo">Editar {s.Titulo}</h2>

            {/* BLOQUE SUPERIOR */}
            <div className="detalle-container">

                {/* IZQUIERDA: PORTADA */}
                <div className="detalle-portada">
                    <img
                        src={portadaUrl}
                        alt={s.Titulo}
                        className="detalle-portada-img"
                    />
                </div>

                {/* DERECHA: CAMPOS */}
                <div className="detalle-info">

                    <label>Título</label>
                    <input
                        className="input-dark"
                        value={Titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <label>Año de estreno</label>
                    <input
                        className="input-dark"
                        value={Anno}
                        onChange={(e) => setAnno(e.target.value)}
                    />

                    <label>Temporadas</label>
                    <input
                        className="input-dark"
                        value={Temporadas}
                        onChange={(e) => setTemporadas(e.target.value)}
                    />
                </div>
            </div>

            {/* BLOQUE INFERIOR */}
            <div className="detalle-extra">

                <div className="detalle-card">
                    <strong>Sinopsis:</strong>
                    <textarea
                        className="input-dark"
                        rows={8}
                        value={Sinopsis}
                        onChange={(e) => setSinopsis(e.target.value)}
                        style={{ width: "100%", marginTop: 10 }}
                    />
                </div>

                <div className="detalle-card">
                    <strong>Episodios:</strong>
                    <textarea
                        className="input-dark"
                        rows={12}
                        value={Episodios}
                        onChange={(e) => setEpisodios(e.target.value)}
                        style={{ width: "100%", marginTop: 10 }}
                    />
                </div>
            </div>

            {/* GUARDAR */}
            <Mutation mutation={ACTUALIZAR_SERIE}>
                {(actualizarSerie) => (
                    <button
                        className="btn-guardar"
                        style={{ marginTop: 20 }}
                        onClick={async () => {
                            const payload = construirPayload();
                            if (!payload) return;

                            try {
                                const res = await actualizarSerie({
                                    variables: { data: payload },
                                    refetchQueries: [
                                        { query: GET_SERIE, variables: { id } }
                                    ],
                                });

                                if (res.data.actualizarSerie) {
                                    alert("Serie actualizada correctamente");
                                    navigate(`/serie/${id}`, {
                                        state: { from: location.state?.from || "/catalogoSeries" }
                                    });
                                } else {
                                    alert("No se pudo actualizar la serie");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error actualizando la serie");
                            }
                        }}
                    >
                        Guardar Cambios
                    </button>
                )}
            </Mutation>
        </div>
    );
}