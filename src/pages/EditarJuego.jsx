import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import "../App.css";
import { useReducer, useEffect } from "react";
import { ACTUALIZAR_JUEGO } from "../mutations";
import { GET_JUEGO } from "../graphql";
import { useAuth, authContext } from "../context/AuthContext";

const formReducer = (state, action) => {
    switch (action.type) {
        case "SET_FORM":
            return { ...state, ...action.payload };
        case "CHANGE":
            return { ...state, [action.field]: action.value };
        case "RESET":
            return action.payload;
        default:
            return state;
    }
};

export default function EditarJuego() {
    const auth = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, data } = useQuery(GET_JUEGO, {
        variables: { id: Number(id) },
        fetchPolicy: "network-only",
    });

    const [actualizarJuego] = useMutation(ACTUALIZAR_JUEGO);

    const [form, dispatch] = useReducer(formReducer, {
        Nombre: "",
        Tamano: "",
        AnnoAct: "",
        Sinopsis: "",
        Requisitos: "",
    });

    // ============================
    // CARGA DE DATOS
    // ============================
    useEffect(() => {
        if (data?.juego) {
            const j = data.juego;
            dispatch({
                type: "SET_FORM",
                payload: {
                    Nombre: j.Nombre,
                    Tamano: j.TamanoFormateado || "",
                    AnnoAct: String(j.AnnoAct),
                    Sinopsis: j.Sinopsis?.replace(/\\n/g, "\n") || "",
                    Requisitos: j.Requisitos?.replace(/\\n/g, "\n") || "",
                },
            });
        }
    }, [data]);

    // ============================
    // BLOQUEO DE VISTA SI NO LOGEADO
    // ============================
    if (!auth.isLogged) {
        return (
            <div className="detalle-wrapper">
                <h2 className="detalle-titulo" style={{ color: "red" }}>
                    ❌ No tienes permisos para acceder a esta vista
                </h2>
                <p style={{ color: "#ccc", marginTop: 10 }}>
                    Debes iniciar sesión como administrador para editar juegos.
                </p>
            </div>
        );
    }

    // ============================
    // LOADING / ERROR
    // ============================
    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const j = data.juego;
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${j.Portada}`;

    // ============================
    // HANDLERS
    // ============================
    const handleChange = (e) => {
        dispatch({
            type: "CHANGE",
            field: e.target.name,
            value: e.target.value,
        });
    };

    const soloCuatroDigitos = (e, valorActual) => {
        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
            return;
        }
        if (!/[0-9]/.test(e.key)) return;

        const input = e.target;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const seleccion = end - start;

        const longitudActual = valorActual.length;
        const longitudResultante = longitudActual - seleccion + 1;

        if (longitudResultante > 4) {
            e.preventDefault();
        }
    };

    const parseTamano = (valor) => {
        const match = valor.trim().match(/^(\d+(?:[.,]\d+)?)\s*(MB|Mb|mb|GB|Gb|gb)?$/);
        if (!match) return null;

        const num = Number(match[1].replace(",", "."));
        const unit = match[2]?.toLowerCase();

        if (!unit || unit === "mb") return num;
        if (unit === "gb") return num * 1024;
        return null;
    };

    const validarAnno = (valor) => {
        if (valor.trim() === "" || valor.trim() === "0") return "No Disponible";
        if (!/^\d{4}$/.test(valor)) return null;
        const year = Number(valor);
        const currentYear = new Date().getFullYear();
        if (year >= 1970 && year <= currentYear) return year;
        return null;
    };

    const prepararRequisitos = (txt) =>
        txt.replace(/\r/g, "").replace(/\n\n+/g, "\\n\\n").replace(/\n/g, "\\n");

    const construirPayload = () => {
        const payload = { Id: j.Id };

        if (form.Nombre.trim() === "") {
            alert("El nombre es obligatorio");
            return null;
        }
        payload.Nombre = form.Nombre.trim();

        if (form.Tamano.trim().toLowerCase() === "variable") {
            if (!form.Nombre.includes("[online]")) {
                alert("Solo se puede declarar tamaño variable en juegos online");
                return null;
            }
            payload.Tamano = j.Tamano;
        } else {
            const tamanoParseado = parseTamano(form.Tamano);
            if (tamanoParseado === null) {
                alert("El tamaño debe ser un valor válido (ej: 500, 500 Mb, 2 Gb, Variable)");
                return null;
            }
            payload.Tamano = tamanoParseado;
        }

        if (form.AnnoAct.trim() === "" || form.AnnoAct.trim() === "0") {
            payload.AnnoAct = 0;
        } else {
            const annoValido = validarAnno(form.AnnoAct);
            if (annoValido === null) {
                alert("El año debe ser un número válido entre 1970 y el actual o estar vacío");
                return null;
            }
            payload.AnnoAct = annoValido;
        }

        if (form.Sinopsis.trim() !== "")
            payload.Sinopsis = form.Sinopsis.replace(/\n/g, "\\n");

        if (form.Requisitos.trim() !== "")
            payload.Requisitos = prepararRequisitos(form.Requisitos);

        return payload;
    };

    // ============================
    // RENDER NORMAL
    // ============================
    return (
        <div className="detalle-wrapper">
            <h2 className="detalle-titulo">Editar {j.Nombre}</h2>

            <div className="detalle-container">
                <div className="detalle-portada">
                    <img src={portadaUrl} alt={j.Nombre} className="detalle-portada-img" />
                </div>

                <div className="detalle-info">
                    <label>Nombre</label>
                    <input
                        className="input-dark"
                        name="Nombre"
                        value={form.Nombre}
                        onChange={handleChange}
                    />

                    <label>Tamaño</label>
                    <input
                        className="input-dark"
                        name="Tamano"
                        value={form.Tamano}
                        onChange={handleChange}
                    />

                    <label>Año de actualización</label>
                    <input
                        className="input-dark"
                        name="AnnoAct"
                        value={form.AnnoAct}
                        onChange={handleChange}
                        onKeyDown={(e) => soloCuatroDigitos(e, form.AnnoAct)}
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
                    <strong>Requisitos de Sistema:</strong>
                    <textarea
                        className="input-dark"
                        name="Requisitos"
                        rows={12}
                        value={form.Requisitos}
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
                        const res = await actualizarJuego({
                            variables: { data: payload },
                            context: authContext(), // 🔥 TOKEN
                            refetchQueries: [
                                { query: GET_JUEGO, variables: { id: Number(id) } },
                            ],
                        });

                        if (res.data.actualizarJuego) {
                            alert("Juego actualizado correctamente");
                            navigate(`/juego/${id}`, {
                                state: { from: location.state?.from || "/catalogo-juegos" },
                            });
                        } else {
                            alert("No se pudo actualizar el juego");
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

                        alert("Error actualizando el juego");
                    }
                }}
            >
                Guardar Cambios
            </button>
        </div>
    );
}

