import { useCart } from "../context/CartContext";

function AddToCartButton({ game, showToast }) {
  const { addToCart } = useCart();

  const handleClick = () => {
    const result = addToCart(game);
    if (showToast) {
      if (result.status === "added") {
        showToast("Añadido correctamente");
      } else {
        showToast("Este juego ya está en el carrito");
      }
    }
  };

  return (
    <button onClick={handleClick} className="btn-add">
      🛒 Añadir
    </button>

  );
}

export default AddToCartButton;