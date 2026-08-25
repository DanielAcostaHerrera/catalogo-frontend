import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddToCartButton from "../components/AddToCartButton";

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
        className="ProductCardLink"
      >
        <div className="ProductCardImageWrapper">
          <img
            className="ProductCardImage"
            src={portadaUrl}
            alt={imageAlt}
            loading="lazy"
          />
        </div>

        <h3 className="ProductCardTitulo">
          {titulo}
        </h3>
      </Link>

      <div className="ProductCardFooter">
        <AddToCartButton item={product} showToast={showToast} />

        {auth.isLogged && (
          <div className="ProductCardAdmin">
            {adminButtons()}
          </div>
        )}
      </div>
    </div>
  );
}