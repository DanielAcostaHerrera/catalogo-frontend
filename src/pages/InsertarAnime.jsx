import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import "../App.css";
import { useState } from "react";
import { CREAR_ANIME } from "../mutations";
import { useAuth, authContext } from "../context/AuthContext";

export default function InsertarAnime() {
    const navigate = useNavigate();
    const auth = useAuth();

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

    const [crearAnime] = useMutation(CREAR_ANIME);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm();
    };

    const handleSubmitForm = async () => {
        const payload = construirPayload();
        if (!payload) return;

        try {
            const res = await crearAnime({
                variables: { data: payload },
                context: authContext(),
            });

            if (res.data.crearAnime) {
                alert("Anime añadido correctamente");
                navigate("/catalogo-animes");
            } else {
                alert("No se pudo añadir el anime");
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

            alert("Error añadiendo el anime");
        }
    };

    if (!auth.isLogged) {
        navigate("/acceso-denegado");
        return null;
    }

    return (
        <>
            <div className="catalogo-container-moderno">
                <div className="catalogo-header-moderno">
                    <h1 className="catalogo-titulo-moderno">🍥 Añadir Nuevo Anime</h1>
                    <p className="catalogo-subtitulo-moderno">
                        Completa los campos para añadir un nuevo anime al catálogo
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="insertar-form-moderno">
                    <div className="detalle-container">
                        <div className="detalle-portada insertar-portada">
                            <label className="insertar-label">Nombre de la portada (archivo):</label>
                            <input
                                className="input-dark"
                                value={Portada}
                                onChange={(e) => setPortada(e.target.value)}
                            />
                        </div>

                        <div className="detalle-info">
                            <label className="insertar-label">Título *</label>
                            <input
                                className="input-dark"
                                value={Titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />

                            <label className="insertar-label">Año de estreno *</label>
                            <input
                                className="input-dark"
                                value={Anno}
                                onChange={(e) => setAnno(e.target.value)}
                                onKeyDown={(e) => soloCuatroDigitos(e, Anno)}
                            />

                            <label className="insertar-label">Temporadas *</label>
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

                    <div className="insertar-botones">
                        <button type="submit" className="btn-dark">
                            Añadir Anime
                        </button>
                        <button
                            type="button"
                            className="btn-dark"
                            onClick={() => navigate("/catalogo-animes")}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}