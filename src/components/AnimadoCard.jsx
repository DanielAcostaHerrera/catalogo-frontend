import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Mutation } from "react-apollo";
import { ELIMINAR_ANIMADO } from "../mutations";
import AddToCartButton from "../components/AddToCartButton";

export default function AnimadoCard({ animado, from, showToast }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Animados/${animado.Portada}`;

    function handleEdit() {
        navigate(`/editar-animado/${animado.Id}`, { state: { from } });
    }

    const lineas = (animado.Episodios ?? "").split("\n").filter(l => l.trim() !== "");
    let bloques = [];

    lineas.forEach((l) => {
        const match = l.match(/(\d+)\s*Episodios?/i);
        if (match) {
            const cantidad = parseInt(match[1], 10);
            bloques.push({
                cantidad,
                descripcion: l.trim(), // usar el texto original como descripción
            });
        }
    });

    const totalEpisodios = bloques.reduce((acc, b) => acc + b.cantidad, 0);

    // 🔹 Si el texto incluye "Serie entera", mostrar solo eso
    if (/serie entera/i.test(animado.Episodios)) {
        bloques = [{ descripcion: "Serie entera" }];
    }

    const precioCalculado = totalEpisodios * 10;

    return (
        <div
            style={{
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                overflow: "hidden",
                backgroundColor: "#1e1e1e",
            }}
        >
            <Link
                to={`/animado/${animado.Id}`}
                state={{ from }}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <img
                    src={portadaUrl}
                    alt={animado.Titulo}
                    style={{
                        width: "100%",
                        height: 180,
                        objectFit: "fill",
                        backgroundColor: "#000",
                        transition: "transform 0.2s, boxShadow 0.2s",
                        display: "block",
                    }}
                    loading="lazy"
                />

                <h3
                    style={{
                        margin: 8,
                        fontSize: 15,
                        color: "#f0f0f0",
                        textAlign: "center",
                    }}
                >
                    {animado.Titulo}
                </h3>
            </Link>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                }}
            >
                <AddToCartButton
                    item={{
                        id: animado.Id,
                        tipo: "animado",
                        nombre: animado.Titulo,
                        portada: animado.Portada, // solo nombre del archivo
                        precio: precioCalculado,
                        bloques,
                        Episodios: animado.Episodios,
                    }}
                    showToast={showToast}
                />

                {auth.isLogged && (
                    <Mutation mutation={ELIMINAR_ANIMADO}>
                        {(eliminarAnimado) => (
                            <>
                                <button onClick={handleEdit} className="admin-edit-btn">
                                    ✏️
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!window.confirm(`¿Eliminar "${animado.Titulo}" del catálogo?`)) return;

                                        try {
                                            const res = await eliminarAnimado({ variables: { id: animado.Id } });
                                            if (res.data.eliminarAnimado) {
                                                alert("Animado eliminado correctamente");
                                                window.location.reload();
                                            } else {
                                                alert("No se pudo eliminar el animado");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Error eliminando el animado");
                                        }
                                    }}
                                    className="admin-delete-btn"
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </Mutation>
                )}
            </div>
        </div>
    );
}