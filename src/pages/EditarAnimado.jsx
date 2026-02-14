import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, Mutation } from "react-apollo";
import "../App.css";
import { useState, useEffect } from "react";
import { ACTUALIZAR_ANIMADO } from "../mutations";
import { GET_ANIMADO } from "../graphql";

export default function EditarAnimado() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [Titulo, setTitulo] = useState("");
    const [Anno, setAnno] = useState("");
    const [Temporadas, setTemporadas] = useState("");
    const [Sinopsis, setSinopsis] = useState("");
    const [Episodios, setEpisodios] = useState("");

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");
    const prepararTexto = (txt) =>
        txt.replace(/\r/g, "").replace(/\n/g, "\\n");

    const validarAnno = (valor) => {
        if (!/^\d{4}$/.test(valor)) return null;
        const year = Number(valor);
        const currentYear = new Date().getFullYear();
        if (year >= 1970 && year <= currentYear) return year;
        return null;
    };

    const { loading, error, data } = useQuery(GET_ANIMADO, {
        variables: { id: Number(id) },
    });

    useEffect(() => {
        if (data?.animado) {
            const a = data.animado;
            setTitulo(a.Titulo);
            setAnno(String(a.Anno));
            setTemporadas(String(a.Temporadas));
            setSinopsis(normalizarTexto(a.Sinopsis));
            setEpisodios(normalizarTexto(a.Episodios));
        }
    }, [data]);

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const a = data.animado;
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Animados/${a.Portada}`;

    const construirPayload = () => {
        const payload = { Id: a.Id };

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

            <h2 className="detalle-titulo">Editar {a.Titulo}</h2>

            <div className="detalle-container">

                <div className="detalle-portada">
                    <img
                        src={portadaUrl}
                        alt={a.Titulo}
                        className="detalle-portada-img"
                    />
                </div>

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

            <Mutation mutation={ACTUALIZAR_ANIMADO}>
                {(actualizarAnimado) => (
                    <button
                        className="btn-guardar"
                        style={{ marginTop: 20 }}
                        onClick={async () => {
                            const payload = construirPayload();
                            if (!payload) return;

                            try {
                                const res = await actualizarAnimado({
                                    variables: { data: payload },
                                    refetchQueries: [
                                        { query: GET_ANIMADO, variables: { id } }
                                    ],
                                });

                                if (res.data.actualizarAnimado) {
                                    alert("Animado actualizado correctamente");
                                    navigate(`/animado/${id}`, {
                                        state: { from: location.state?.from || "/catalogo-animados" }
                                    });
                                } else {
                                    alert("No se pudo actualizar el animado");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error actualizando el animado");
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