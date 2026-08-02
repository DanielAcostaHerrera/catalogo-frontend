import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AddToCartButton from "../components/AddToCartButton";

import "../styles/ProductCard.css";

export default function ProductCard({
  portadaUrl,
  navigateLink,
  navigateState,
  imageAlt,
  titulo,
  product,
  showToast,
  adminButtons,
}) {
  const auth = useAuth();

  return (
    <div className="ProductCardContainer">
      <Link
        to={navigateLink}
        state={navigateState}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          className="ProductCardImage"
          src={portadaUrl}
          alt={imageAlt}
          loading="lazy"
          width={"100%"}
          height={180}
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

        {auth.isLogged && <div className="admin-section">{adminButtons()}</div>}
      </div>
    </div>
  );
}
