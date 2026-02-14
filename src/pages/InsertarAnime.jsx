import { useNavigate, useLocation } from "react-router-dom";
import { Mutation } from "react-apollo";
import "../App.css";
import { useState } from "react";
import { CREAR_ANIME } from "../mutations";

export default function InsertarAnime() {
    const navigate = useNavigate();
    const location = useLocation();

    const [Titulo, setTitulo] = useState("");
    const [Anno, setAnno] = useState("");
    const [Temporadas, setTemporadas] = useState("");
    const [Portada, setPortada] = useState("");
    const [Sinopsis, setSinopsis] = useState("");
    const [Episodios, setEpisodios] = useState("");

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

    const prepararTexto = (txt) =>
        txt.replace(/\r/g, "").replace(/\n/g, "\\n");

    const validarAnno = (valor) => {
        if (!/^\d{4}$/.test(valor)) return null;
        const year = Number(valor);
        const currentYear = new Date().getFullYear();
        if (year >= 1970 && year <= currentYear) return year;
        return null;
    };

    const construirPayload = () => {
        const payload = {};

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
            payload.Sinopsis = prepararTexto(Sinopsis);

        if (Episodios.trim() !== "")
            payload.Episodios = prepararTexto(Episodios);

        return payload;
    };

    return (
        <div className="detalle-wrapper">

            <h2 className="detalle-titulo">Añadir Nuevo Anime</h2>

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

            <div className="detalle-extra">

                <div className="detalle-card">
                    <strong>Sinopsis:</strong>
                    <textarea
                        className="input-dark"
                        rows={8}
                        value={Sinopsis}
                        onChange={(e) => setSinopsis(e.target.value)}
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
                        rows={12}
                        value={Episodios}
                        onChange={(e) => setEpisodios(e.target.value)}
                        style={{
                            width: "100%",
                            marginTop: 10,
                            whiteSpace: "pre-wrap"
                        }}
                    />
                </div>
            </div>

            <Mutation mutation={CREAR_ANIME}>
                {(crearAnime) => (
                    <button
                        className="btn-guardar"
                        onClick={async () => {
                            const payload = construirPayload();
                            if (!payload) return;

                            try {
                                const res = await crearAnime({
                                    variables: { data: payload },
                                });

                                if (res.data.crearAnime) {
                                    alert("Anime añadido correctamente");
                                    navigate("/catalogo-animes");
                                } else {
                                    alert("No se pudo añadir el anime");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error añadiendo el anime");
                            }
                        }}
                    >
                        Añadir Anime
                    </button>
                )}
            </Mutation>
        </div>
    );
}