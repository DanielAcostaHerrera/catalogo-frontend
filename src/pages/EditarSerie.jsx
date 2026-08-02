import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import "../App.css";
import { useReducer, useEffect } from "react";
import { ACTUALIZAR_SERIE } from "../mutations";
import { GET_SERIE } from "../graphql";

// 🔥 REDUCER para manejar el formulario
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

export default function EditarSerie() {
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

    // ✅ PRIMERO: useQuery
    const { loading, error, data } = useQuery(GET_SERIE, {
        variables: { id: Number(id) },
    });

    // ✅ SEGUNDO: useMutation
    const [actualizarSerie] = useMutation(ACTUALIZAR_SERIE);

    // 🔥 REDUCER EN LUGAR DE useState
    const [form, dispatch] = useReducer(formReducer, {
        Titulo: "",
        Anno: "",
        Temporadas: "",
        Sinopsis: "",
        Episodios: "",
    });

    // ✅ Cargar datos cuando estén disponibles
    useEffect(() => {
        if (data?.serie) {
            const s = data.serie;
            dispatch({
                type: 'SET_FORM',
                payload: {
                    Titulo: s.Titulo,
                    Anno: String(s.Anno),
                    Temporadas: String(s.Temporadas),
                    Sinopsis: normalizarTexto(s.Sinopsis),
                    Episodios: normalizarTexto(s.Episodios),
                }
            });
        }
    }, [data]);

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const s = data.serie;
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${s.Portada}`;

    // ✅ MANEJADOR DE CAMBIOS
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({
            type: 'CHANGE',
            field: name,
            value: value
        });
    };

    const construirPayload = () => {
        const payload = { Id: s.Id };

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

    return (
        <div className="detalle-wrapper">
            <h2 className="detalle-titulo">Editar {s.Titulo}</h2>

            <div className="detalle-container">
                <div className="detalle-portada">
                    <img
                        src={portadaUrl}
                        alt={s.Titulo}
                        className="detalle-portada-img"
                    />
                </div>

                <div className="detalle-info">
                    <label>Título</label>
                    <input
                        className="input-dark"
                        name="Titulo"
                        value={form.Titulo}
                        onChange={handleChange}
                    />

                    <label>Año de estreno</label>
                    <input
                        className="input-dark"
                        name="Anno"
                        value={form.Anno}
                        onChange={handleChange}
                    />

                    <label>Temporadas</label>
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
                        style={{ width: "100%", marginTop: 10 }}
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
                        style={{ width: "100%", marginTop: 10 }}
                    />
                </div>
            </div>

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
                                { query: GET_SERIE, variables: { id: Number(id) } }
                            ],
                        });

                        if (res.data.actualizarSerie) {
                            alert("Serie actualizada correctamente");
                            navigate(`/serie/${id}`, {
                                state: { from: location.state?.from || "/catalogo-series" }
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
        </div>
    );
}