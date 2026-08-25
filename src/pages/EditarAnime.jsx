import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import "../App.css";
import { useReducer, useEffect } from "react";
import { ACTUALIZAR_ANIME } from "../mutations";
import { GET_ANIME } from "../graphql";
import { useAuth, authContext } from "../context/AuthContext";

const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FORM':
            return { ...state, ...action.payload };
        case 'CHANGE':
            return { ...state, [action.field]: action.value };
        case 'RESET':
            return action.payload;
        default:
            return state;
    }
};

export default function EditarAnime() {
    const auth = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

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

    const { loading, error, data } = useQuery(GET_ANIME, {
        variables: { id: Number(id) },
        fetchPolicy: "network-only",
    });

    const [actualizarAnime] = useMutation(ACTUALIZAR_ANIME);

    const [form, dispatch] = useReducer(formReducer, {
        Titulo: "",
        Anno: "",
        Temporadas: "",
        Sinopsis: "",
        Episodios: "",
    });

    useEffect(() => {
        if (data?.anime) {
            const a = data.anime;
            dispatch({
                type: 'SET_FORM',
                payload: {
                    Titulo: a.Titulo,
                    Anno: String(a.Anno),
                    Temporadas: String(a.Temporadas),
                    Sinopsis: normalizarTexto(a.Sinopsis),
                    Episodios: normalizarTexto(a.Episodios),
                }
            });
        }
    }, [data]);

    if (!auth.isLogged) {
        navigate("/acceso-denegado");
        return null;
    }

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const a = data.anime;
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Anime/${a.Portada}`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({
            type: 'CHANGE',
            field: name,
            value: value
        });
    };

    const construirPayload = () => {
        const payload = { Id: a.Id };

        if (form.Titulo.trim() === "") {
            alert("El título es obligatorio");
            return null;
        }
        payload.Titulo = form.Titulo.trim();

        const annoValido = validarAnno(form.Anno);
        if (annoValido === null) {
            alert("El año debe ser un número válido entre 1970 y el actual");
            return null;
        }
        payload.Anno = annoValido;

        if (form.Temporadas.trim() === "" || isNaN(Number(form.Temporadas))) {
            alert("Las temporadas deben ser un número válido");
            return null;
        }
        payload.Temporadas = Number(form.Temporadas);

        if (form.Sinopsis.trim() !== "")
            payload.Sinopsis = prepararTexto(form.Sinopsis);

        if (form.Episodios.trim() !== "")
            payload.Episodios = prepararTexto(form.Episodios);

        return payload;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm();
    };

    const handleSubmitForm = async () => {
        const payload = construirPayload();
        if (!payload) return;

        try {
            const res = await actualizarAnime({
                variables: { data: payload },
                context: authContext(),
                refetchQueries: [
                    { query: GET_ANIME, variables: { id: Number(id) } }
                ],
            });

            if (res.data.actualizarAnime) {
                alert("Anime actualizado correctamente");
                navigate(`/anime/${id}`, {
                    state: { from: location.state?.from || "/catalogo-animes" }
                });
            } else {
                alert("No se pudo actualizar el anime");
            }
        } catch (err) {
            console.error(err);

            const msg =
                err?.message ||
                err?.graphQLErrors?.[0]?.message ||
                err?.networkError?.result?.errors?.[0]?.message ||
                "";

            if (
                msg.includes("No autorizado") ||
                msg.includes("Unauthorized") ||
                msg.includes("Forbidden")
            ) {
                alert("No tienes permisos para realizar esta acción.");
                return;
            }

            alert("Error actualizando el anime");
        }
    };

    return (
        <>
            <div className="catalogo-container-moderno">
                <div className="catalogo-header-moderno">
                    <h1 className="catalogo-titulo-moderno">✏️ Editar {a.Titulo}</h1>
                    <p className="catalogo-subtitulo-moderno">
                        Modifica los campos del anime
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="insertar-form-moderno">
                    <div className="detalle-container">
                        <div className="detalle-portada">
                            <img
                                src={portadaUrl}
                                alt={a.Titulo}
                                className="detalle-portada-img"
                            />
                        </div>

                        <div className="detalle-info">
                            <label className="insertar-label">Título</label>
                            <input
                                className="input-dark"
                                name="Titulo"
                                value={form.Titulo}
                                onChange={handleChange}
                            />

                            <label className="insertar-label">Año de estreno</label>
                            <input
                                className="input-dark"
                                name="Anno"
                                value={form.Anno}
                                onChange={handleChange}
                            />

                            <label className="insertar-label">Temporadas</label>
                            <input
                                className="input-dark"
                                name="Temporadas"
                                value={form.Temporadas}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="detalle-extra">
                        <div className="detalle-card">
                            <strong>Sinopsis:</strong>
                            <textarea
                                className="input-dark"
                                name="Sinopsis"
                                rows={8}
                                value={form.Sinopsis}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    marginTop: 10,
                                    whiteSpace: "pre-wrap"
                                }}
                            />
                        </div>

                        <div className="detalle-card">
                            <strong>Episodios:</strong>
                            <textarea
                                className="input-dark"
                                name="Episodios"
                                rows={12}
                                value={form.Episodios}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    marginTop: 10,
                                    whiteSpace: "pre-wrap"
                                }}
                            />
                        </div>
                    </div>

                    <div className="insertar-botones">
                        <button type="submit" className="btn-dark">
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            className="btn-dark"
                            onClick={() => navigate(`/anime/${id}`)}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
