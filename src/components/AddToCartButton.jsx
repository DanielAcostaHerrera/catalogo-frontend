import { useCart } from "../context/CartContext";

function AddToCartButton({ item, showToast }) {
  const { addToCart } = useCart();

  const handleClick = () => {
    // 🔹 Forzar que siempre sea serie entera si es serie/anime/animado
    let finalItem = { ...item };
    if (item.tipo === "serie" || item.tipo === "anime" || item.tipo === "animado") {
      finalItem = {
        ...item,
        bloques: [{ descripcion: "Serie entera" }],
      };
    }

    const result = addToCart(finalItem);

    if (showToast) {
      if (result.status === "added") {
        showToast(
          item.tipo === "serie" || item.tipo === "anime" || item.tipo === "animado"
            ? "Serie añadida correctamente"
            : "Juego añadido correctamente"
        );
      } else {
        showToast(
          item.tipo === "serie" || item.tipo === "anime" || item.tipo === "animado"
            ? "Esta serie ya está en el carrito"
            : "Este juego ya está en el carrito"
        );
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