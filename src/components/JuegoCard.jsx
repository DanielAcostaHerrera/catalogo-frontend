import { Link, useNavigate, useLocation } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { useMutation } from "@apollo/client";
import { ELIMINAR_JUEGO } from "../mutations";
import ProductCard from "./ProductCard";
import { authContext } from "../context/authContext";

export default function JuegoCard({ juego, showToast, from }) {
  const navigate = useNavigate();
  const location = useLocation();

  const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Juegos/${juego.Portada}`;

  function handleEdit() {
    navigate(`/editar-juego/${juego.Id}`, {
      state: { from: location.pathname },
    });
  }

  const [eliminarJuego] = useMutation(ELIMINAR_JUEGO);

  const renderAdminSection = () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={handleEdit} className="admin-edit-btn">
        ✏️
      </button>

      <button
        onClick={async () => {
          if (!window.confirm(`¿Eliminar "${juego.Nombre}" del catálogo?`))
            return;

          try {
            const res = await eliminarJuego({
              variables: { id: juego.Id },
              context: authContext(), // 🔥 TOKEN AQUÍ
            });

            if (res.data.eliminarJuego) {
              alert("Juego eliminado correctamente");
              window.location.reload();
            } else {
              alert("No se pudo eliminar el juego");
            }
          } catch (err) {
            console.error(err);

            // ============================
            //  MANEJO ROBUSTO DE PERMISOS
            // ============================
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
            } else {
              alert("Error eliminando el juego");
            }
          }
        }}
        className="admin-delete-btn"
      >
        🗑️
      </button>
    </div>
  );

  const product = {
    id: juego.Id,
    tipo: "juego",
    nombre: juego.Nombre,
    portada: `Portadas Juegos/${juego.Portada}`,
    precio: juego.Precio ?? 0,
    tamanoFormateado: juego.TamanoFormateado ?? "Tamaño desconocido",
  };

  return (
    <ProductCard
      portadaUrl={portadaUrl}
      imageAlt={juego.Nombre}
      titulo={juego.Nombre}
      navigateLink={`/juego/${juego.Id}`}
      navigateState={{ from }}
      product={product}
      showToast={showToast}
      adminButtons={renderAdminSection}
    />
  );
}


