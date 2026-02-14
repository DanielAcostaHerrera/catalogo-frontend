import { useNavigate } from "react-router-dom";
import { Mutation } from "react-apollo";
import "../App.css";
import { useState } from "react";
import { CREAR_JUEGO } from "../mutations";
import { useLocation } from "react-router-dom";

export default function InsertarJuego() {
    const navigate = useNavigate();
    const location = useLocation();

    const [Nombre, setNombre] = useState("");
    const [Tamano, setTamano] = useState("");
    const [AnnoAct, setAnnoAct] = useState("");
    const [Portada, setPortada] = useState("");
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
        if (valor.trim() === "") return "No Disponible";
        if (!/^\d{4}$/.test(valor)) return null;
        const year = Number(valor);
        const currentYear = new Date().getFullYear();
        if (year >= 1970 && year <= currentYear) return year;
        return null;
    };

    const construirPayload = () => {
        const payload = {};

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
            payload.Tamano = 0;
        } else {
            const tamanoParseado = parseTamano(Tamano);
            if (tamanoParseado === null) {
                alert("El tamaño debe ser un valor válido (ej: 500, 500 Mb, 2 Gb, Variable)");
                return null;
            }
            payload.Tamano = tamanoParseado;
        }

        if (AnnoAct.trim() !== "") {
            const annoValido = validarAnno(AnnoAct);
            if (annoValido === null) {
                alert("El año debe ser un número válido entre 1970 y el actual o estar vacío");
                return null;
            }
            payload.AnnoAct = annoValido;
        } else {
            payload.AnnoAct = 0;
        }

        if (Portada.trim() !== "") {
            let portada = Portada.trim();

            if (portada.includes(".")) {
                if (!portada.toLowerCase().endsWith(".png")) {
                    alert("La portada debe terminar en .png");
                    return null;
                }
            } else {
                portada = portada + ".png";
            }

            payload.Portada = portada;
        }

        if (Sinopsis.trim() !== "")
            payload.Sinopsis = Sinopsis.replace(/\n/g, "\\n");

        if (Requisitos.trim() !== "")
            payload.Requisitos = prepararRequisitos(Requisitos);

        return payload;
    };

    return (
        <div className="detalle-wrapper">

            <h2 className="detalle-titulo">Añadir Nuevo Juego</h2>

            <div className="detalle-container">

                <div className="detalle-portada insertar-portada">
                    <label>Nombre de la portada (archivo):</label>
                    <input
                        className="input-dark"
                        value={Portada}
                        onChange={(e) => setPortada(e.target.value)}
                    />
                </div>

                <div className="detalle-info">

                    <label>Nombre *</label>
                    <input
                        className="input-dark"
                        value={Nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                    <label>Tamaño *</label>
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

            <Mutation mutation={CREAR_JUEGO}>
                {(crearJuego) => (
                    <button
                        className="btn-guardar"
                        onClick={async () => {
                            const payload = construirPayload();
                            if (!payload) return;

                            try {
                                const res = await crearJuego({
                                    variables: { data: payload },
                                });

                                if (res.data.crearJuego) {
                                    alert("Juego añadido correctamente");
                                    navigate("/catalogo-juegos");
                                } else {
                                    alert("No se pudo añadir el juego");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error añadiendo el juego");
                            }
                        }}
                    >
                        Añadir Juego
                    </button>
                )}
            </Mutation>
        </div>
    );
}