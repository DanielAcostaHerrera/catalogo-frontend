import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddToCartButton from "../components/AddToCartButton";

export default function ProductCard({
  portadaUrl,
  navigateLink,
  navigateState,
  imageAlt,
  titulo,
  meta,
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
        {meta ? <p className="ProductCardMeta">{meta}</p> : null}
      </Link>

      <div className="ProductCardFooter">
        <div className="botones-wrapper">
          <AddToCartButton item={product} showToast={showToast} />
          {auth.isLogged && adminButtons()}
        </div>
      </div>
    </div>
  );
}
