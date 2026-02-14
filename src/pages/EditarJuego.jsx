import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, Mutation } from "react-apollo";
import "../App.css";
import { useState, useEffect } from "react";
import { ACTUALIZAR_JUEGO } from "../mutations";
import { GET_JUEGO } from "../graphql";


export default function EditarJuego() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [Nombre, setNombre] = useState("");
    const [Tamano, setTamano] = useState("");
    const [AnnoAct, setAnnoAct] = useState("");
    const [Sinopsis, setSinopsis] = useState("");
    const [Requisitos, setRequisitos] = useState("");

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

    const normalizarTexto = (txt) => (txt ? txt.replace(/\\n/g, "\n") : "");

    const prepararRequisitos = (txt) => {
        return txt
            .replace(/\r/g, "")
            .replace(/\n\n+/g, "\\n\\n")
            .replace(/\n/g, "\\n");
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

    const { loading, error, data } = useQuery(GET_JUEGO, {
        variables: { id: Number(id) },
    });

    useEffect(() => {
        if (data?.juego) {
            const j = data.juego;
            setNombre(j.Nombre);
            setTamano(j.TamanoFormateado || "");
            setAnnoAct(String(j.AnnoAct));
            setSinopsis(normalizarTexto(j.Sinopsis));
            setRequisitos(normalizarTexto(j.Requisitos));
        }
    }, [data]);

    if (loading) return <p style={{ color: "#ccc" }}>Cargando…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const j = data.juego;
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${j.Portada}`;

    const construirPayload = () => {
        const payload = { Id: j.Id };

        if (Nombre.trim() === "") {
            alert("El nombre es obligatorio");
            return null;
        }
        payload.Nombre = Nombre.trim();

        if (Tamano.trim().toLowerCase() === "variable") {
            if (!Nombre.includes("[online]")) {
                alert("Solo se puede declarar tamaño variable en juegos online");
                return null;
            }
            payload.Tamano = j.Tamano;
        } else {
            const tamanoParseado = parseTamano(Tamano);
            if (tamanoParseado === null) {
                alert("El tamaño debe ser un valor válido (ej: 500, 500 Mb, 2 Gb, Variable)");
                return null;
            }
            payload.Tamano = tamanoParseado;
        }

        if (AnnoAct.trim() === "" || AnnoAct.trim() === "0") {
            payload.AnnoAct = 0;
        } else {
            const annoValido = validarAnno(AnnoAct);
            if (annoValido === null) {
                alert("El año debe ser un número válido entre 1970 y el actual o estar vacío");
                return null;
            }
            payload.AnnoAct = annoValido;
        }

        if (Sinopsis.trim() !== "")
            payload.Sinopsis = Sinopsis.replace(/\n/g, "\\n");

        if (Requisitos.trim() !== "")
            payload.Requisitos = prepararRequisitos(Requisitos);

        return payload;
    };

    return (
        <div className="detalle-wrapper">

            <h2 className="detalle-titulo">Editar {j.Nombre}</h2>

            <div className="detalle-container">

                <div className="detalle-portada">
                    <img
                        src={portadaUrl}
                        alt={j.Nombre}
                        className="detalle-portada-img"
                    />
                </div>

                <div className="detalle-info">

                    <label>Nombre</label>
                    <input
                        className="input-dark"
                        value={Nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                    <label>Tamaño</label>
                    <input
                        className="input-dark"
                        value={Tamano}
                        onChange={(e) => setTamano(e.target.value)}
                    />

                    <label>Año de actualización</label>
                    <input
                        className="input-dark"
                        value={AnnoAct}
                        onChange={(e) => setAnnoAct(e.target.value)}
                        onKeyDown={(e) => soloCuatroDigitos(e, AnnoAct)}
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
                    <strong>Requisitos de Sistema:</strong>
                    <textarea
                        className="input-dark"
                        rows={12}
                        value={Requisitos}
                        onChange={(e) => setRequisitos(e.target.value)}
                        style={{ width: "100%", marginTop: 10 }}
                    />
                </div>
            </div>

            <Mutation mutation={ACTUALIZAR_JUEGO}>
                {(actualizarJuego) => (
                    <button
                        className="btn-guardar"
                        style={{ marginTop: 20 }}
                        onClick={async () => {
                            const payload = construirPayload();
                            if (!payload) return;

                            try {
                                const res = await actualizarJuego({
                                    variables: { data: payload },
                                    refetchQueries: [
                                        { query: GET_JUEGO, variables: { id } }
                                    ],
                                });

                                if (res.data.actualizarJuego) {
                                    alert("Juego actualizado correctamente");
                                    navigate(`/juego/${id}`, {
                                        state: { from: location.state?.from || "/catalogo-juegos" }
                                    });
                                } else {
                                    alert("No se pudo actualizar el juego");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error actualizando el juego");
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