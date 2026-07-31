import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Mutation } from "react-apollo";
import { ELIMINAR_ANIMADO } from "../mutations";
import AddToCartButton from "../components/AddToCartButton";

import "../styles/ProductCard.css";

export default function ProductCard({
  portadaUrl,
  navigateLink,
  navigateState,
  imageAlt,
  titulo,
  product,
  handleEdit,
  adminButtons,
  showToast,
}) {
  const auth = useAuth();

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
        to={navigateLink}
        state={navigateState}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={portadaUrl}
          alt={imageAlt}
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
          {titulo}
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
        <AddToCartButton item={product} showToast={showToast} />

        {auth.isLogged && <div className="admin-section">adminButtons</div>}
      </div>
    </div>
  );
}
