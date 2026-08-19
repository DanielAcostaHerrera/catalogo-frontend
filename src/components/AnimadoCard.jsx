import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ELIMINAR_ANIMADO } from "../mutations";
import AddToCartButton from "../components/AddToCartButton";
import ProductCard from "./ProductCard";
import { authContext } from "../context/authContext";

export default function AnimadoCard({
  animado,
  from,
  showToast,
  precioPorCapitulo,
}) {
  const navigate = useNavigate();

  const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Animados/${animado.Portada}`;

  function handleEdit() {
    navigate(`/editar-animado/${animado.Id}`, { state: { from } });
  }

  const lineas = (animado.Episodios ?? "")
    .split("\n")
    .filter((l) => l.trim() !== "");
  let bloques = [];

  lineas.forEach((l) => {
    const match = l.match(/(\d+)\s*Episodios?/i);
    if (match) {
      const cantidad = parseInt(match[1], 10);
      bloques.push({
        cantidad,
        descripcion: l.trim(),
      });
    }
  });

  const totalEpisodios = bloques.reduce((acc, b) => acc + b.cantidad, 0);

  if (/serie entera/i.test(animado.Episodios)) {
    bloques = [{ descripcion: "Serie entera" }];
  }

  const precioCalculado = totalEpisodios * Number(precioPorCapitulo);

  const [eliminarAnimado] = useMutation(ELIMINAR_ANIMADO);

  const renderAdminSection = () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={handleEdit} className="admin-edit-btn">
        ✏️
      </button>

      <button
        onClick={async () => {
          if (!window.confirm(`¿Eliminar "${animado.Titulo}" del catálogo?`))
            return;

          try {
            const res = await eliminarAnimado({
              variables: { id: animado.Id },
              context: authContext(),
            });

            if (res.data.eliminarAnimado) {
              alert("Animado eliminado correctamente");
              window.location.reload();
            } else {
              alert("No se pudo eliminar el animado");
            }
          } catch (err) {
            console.error(err);

            // ============================
            //  MANEJO DE PERMISOS
            // ============================
            if (
              err.message.includes("No autorizado") ||
              err.message.includes("Unauthorized") ||
              err.message.includes("Forbidden")
            ) {
              alert("No tienes permisos para realizar esta acción.");
            } else {
              alert("Error eliminando el animado");
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
    id: animado.Id,
    tipo: "animado",
    nombre: animado.Titulo,
    portada: animado.Portada,
    precio: precioCalculado,
    bloques,
    Episodios: animado.Episodios,
  };

  return (
    <ProductCard
      product={product}
      titulo={animado.Titulo}
      imageAlt={animado.Titulo}
      portadaUrl={portadaUrl}
      navigateLink={`/animado/${animado.Id}`}
      navigateState={{ from, precioPorCapitulo }}
      handleEdit={handleEdit}
      adminButtons={renderAdminSection}
      showToast={showToast}
    />
  );
}


