import { useNavigate, useLocation } from "react-router-dom";
import { Mutation } from "react-apollo";
import "../App.css";
import { useState, useEffect } from "react";
import { CREAR_SERIE } from "../mutations";

export default function InsertarSerie() {
    const navigate = useNavigate();
    const location = useLocation();

    const [Titulo, setTitulo] = useState("");
    const [Anno, setAnno] = useState("");
    const [Temporadas, setTemporadas] = useState("");
    const [Portada, setPortada] = useState("");
    const [Sinopsis, setSinopsis] = useState("");
    const [Episodios, setEpisodios] = useState("");

    // ============================================================
    //  AUTOGENERAR EPISODIOS AL CAMBIAR TEMPORADAS
    // ============================================================
    useEffect(() => {
        const n = Number(Temporadas);
        if (!n || n <= 0) return;

        let texto = "";
        for (let i = 1; i <= n; i++) {
            texto += `Temporada ${i} - X episodios\n`;
        }

        setEpisodios(texto.trim());
    }, [Temporadas]);

    // Validación: solo 4 dígitos
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

    // Normalizar saltos de línea
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

    // Construir payload
    const construirPayload = () => {
        const payload = {};

        // Título requerido
        if (Titulo.trim() === "") {
            alert("El título es obligatorio");
            return null;
        }
        payload.Titulo = Titulo.trim();

        // Año requerido
        const annoValido = validarAnno(Anno);
        if (annoValido === null) {
            alert("El año debe ser un número válido entre 1970 y el actual");
            return null;
        }
        payload.Anno = annoValido;

        // Temporadas requeridas
        if (Temporadas.trim() === "" || isNaN(Number(Temporadas))) {
            alert("Las temporadas deben ser un número válido");
            return null;
        }
        payload.Temporadas = Number(Temporadas);

        // Portada opcional con validación .png
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

        // Sinopsis opcional
        if (Sinopsis.trim() !== "")
            payload.Sinopsis = prepararTexto(Sinopsis);

        // Episodios opcional
        if (Episodios.trim() !== "")
            payload.Episodios = prepararTexto(Episodios);

        return payload;
    };

    return (
        <div className="detalle-wrapper">

            <h2 className="detalle-titulo">Añadir Nueva Serie</h2>

            {/* BLOQUE SUPERIOR */}
            <div className="detalle-container">

                {/* IZQUIERDA: Portada */}
                <div className="detalle-portada insertar-portada">
                    <label>Nombre de la portada (archivo):</label>
                    <input
                        className="input-dark"
                        value={Portada}
                        onChange={(e) => setPortada(e.target.value)}
                    />
                </div>

                {/* DERECHA: Campos */}
                <div className="detalle-info">

                    <label>Título *</label>
                    <input
                        className="input-dark"
                        value={Titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <label>Año de estreno *</label>
                    <input
                        className="input-dark"
                        value={Anno}
                        onChange={(e) => setAnno(e.target.value)}
                        onKeyDown={(e) => soloCuatroDigitos(e, Anno)}
                    />

                    <label>Temporadas *</label>
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
            <Mutation mutation={CREAR_SERIE}>
                {(crearSerie) => (
                    <button
                        className="btn-guardar"
                        onClick={async () => {
                            const payload = construirPayload();
                            if (!payload) return;

                            try {
                                const res = await crearSerie({
                                    variables: { data: payload },
                                });

                                if (res.data.crearSerie) {
                                    alert("Serie añadida correctamente");
                                    navigate("/catalogo-series");
                                } else {
                                    alert("No se pudo añadir la serie");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error añadiendo la serie");
                            }
                        }}
                    >
                        Añadir Serie
                    </button>
                )}
            </Mutation>
        </div>
    );
}