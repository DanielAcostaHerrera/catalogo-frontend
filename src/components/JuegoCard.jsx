import { Link } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";

export default function JuegoCard({ juego, showToast }) {
    const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/${encodeURIComponent(
        juego.Portada
    )}`;

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
                to={`/juego/${juego.Id}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <img
                    src={portadaUrl}
                    alt={juego.Nombre}
                    style={{
                        width: "100%",
                        height: 180,
                        objectFit: "contain",
                        backgroundColor: "#000",
                        transition: "transform 0.2s, boxShadow 0.2s",
                        display: "block",
                    }}
                    loading="lazy"
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                />
                <h3
                    style={{
                        margin: 8,
                        fontSize: 15,
                        color: "#f0f0f0",
                        textAlign: "center",
                    }}
                >
                    {juego.Nombre}
                </h3>
            </Link>

            {/* 🔹 Botón de carrito */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
                <AddToCartButton game={juego} showToast={showToast} />
            </div>
        </div>
    );
}