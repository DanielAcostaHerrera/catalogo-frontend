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

    //Validaciones para el campo año
    const soloCuatroDigitos = (e, valorActual) => {
        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

        // Bloquear letras y símbolos
        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
            return;
        }

        // Si no es número, dejamos pasar (teclas de control)
        if (!/[0-9]/.test(e.key)) return;

        const input = e.target;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const seleccion = end - start;

        // Longitud resultante si se escribe este dígito
        const longitudActual = valorActual.length;
        const longitudResultante = longitudActual - seleccion + 1;

        if (longitudResultante > 4) {
            e.preventDefault();
        }
    };

    // Convierte saltos reales → \n y \n\n para BD
    const prepararRequisitos = (txt) => {
        return txt
            .replace(/\r/g, "")
            .replace(/\n\n+/g, "\\n\\n")
            .replace(/\n/g, "\\n");
    };

    // Parsear tamaño (ej: "123 Mb", "10 Gb", "7.3 Gb" "500")
    const parseTamano = (valor) => {
        // acepta enteros o decimales con punto o coma
        const match = valor.trim().match(/^(\d+(?:[.,]\d+)?)\s*(MB|Mb|mb|GB|Gb|gb)?$/);
        if (!match) return null;

        // normaliza coma a punto
        const num = Number(match[1].replace(",", "."));
        const unit = match[2]?.toLowerCase();

        if (!unit || unit === "mb") return num;
        if (unit === "gb") return num * 1024;
        return null;
    };

    // Validar año
    const validarAnno = (valor) => {
        if (valor.trim() === "") return "No Disponible";
        if (!/^\d{4}$/.test(valor)) return null;
        const year = Number(valor);
        const currentYear = new Date().getFullYear();
        if (year >= 1970 && year <= currentYear) return year;
        return null;
    };

    // Construye payload solo con campos válidos
    const construirPayload = () => {
        const payload = {};

        // Nombre requerido
        if (Nombre.trim() === "") {
            alert("El nombre es obligatorio");
            return null;
        }
        payload.Nombre = Nombre.trim();

        // Tamaño requerido
        const tamanoParseado = parseTamano(Tamano);
        if (tamanoParseado === null) {
            alert("El tamaño debe ser un número válido (ej: 500, 500 Mb, 2 Gb)");
            return null;
        }
        payload.Tamano = Math.round(tamanoParseado); // 🔹 siempre entero

        // Año opcional
        if (AnnoAct.trim() !== "") {
            const annoValido = validarAnno(AnnoAct);
            if (annoValido === null) {
                alert("El año debe ser un número válido entre 1970 y el actual o estar vacío");
                return null;
            }
            payload.AnnoAct = annoValido;
        } else {
            payload.AnnoAct = 0; // 🔹 backend recibe 0, frontend lo muestra como "No disponible"
        }

        // Portada opcional con validación y autocompletado .png
        if (Portada.trim() !== "") {
            let portada = Portada.trim();

            // Si tiene extensión pero NO es .png → error
            if (portada.includes(".")) {
                if (!portada.toLowerCase().endsWith(".png")) {
                    alert("La portada debe terminar en .png");
                    return null;
                }
            } else {
                // Si no tiene extensión → añadir .png
                portada = portada + ".png";
            }

            payload.Portada = portada;
        }


        // Sinopsis opcional
        if (Sinopsis.trim() !== "")
            payload.Sinopsis = Sinopsis.replace(/\n/g, "\\n");

        // Requisitos opcional
        if (Requisitos.trim() !== "")
            payload.Requisitos = prepararRequisitos(Requisitos);

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
                        navigate("/catalogo-juegos");
                    }
                }}
            >
                ← Volver
            </button>

            <h2 className="detalle-titulo">Añadir Nuevo Juego</h2>

            {/* BLOQUE SUPERIOR: Portada (input) + Campos básicos */}
            <div className="detalle-container">

                {/* IZQUIERDA: Campo portada */}
                <div className="detalle-portada insertar-portada">
                    <label>Nombre de la portada (archivo):</label>
                    <input
                        className="input-dark"
                        value={Portada}
                        onChange={(e) => setPortada(e.target.value)}
                    />
                </div>

                {/* DERECHA: FORMULARIO BÁSICO */}
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

            {/* BLOQUE INFERIOR: Sinopsis + Requisitos (full width) */}
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

            {/* GUARDAR */}
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