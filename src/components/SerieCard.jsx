import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ELIMINAR_SERIE } from "../mutations";
import AddToCartButton from "../components/AddToCartButton";
import ProductCard from "./ProductCard";
import { authContext } from "../context/AuthContext";

export default function SerieCard({
  serie,
  from,
  showToast,
  precioPorCapitulo,
}) {
  const navigate = useNavigate();

  const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Series/${serie.Portada}`;

  function handleEdit() {
    navigate(`/editar-serie/${serie.Id}`, { state: { from } });
  }

  const lineas = (serie.Episodios ?? "")
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

  if (/serie entera/i.test(serie.Episodios)) {
    bloques = [{ descripcion: "Serie entera" }];
  }

  const precioCalculado = totalEpisodios * Number(precioPorCapitulo);

  const [eliminarSerie] = useMutation(ELIMINAR_SERIE);

  const renderAdminSection = () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={handleEdit} className="admin-edit-btn">
        ✏️
      </button>

      <button
        onClick={async () => {
          if (!window.confirm(`¿Eliminar "${serie.Titulo}" del catálogo?`))
            return;

          try {
            const res = await eliminarSerie({
              variables: { id: serie.Id },
              context: authContext(),
            });

            if (res.data.eliminarSerie) {
              alert("Serie eliminada correctamente");
              window.location.reload();
            } else {
              alert("No se pudo eliminar la serie");
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
              alert("Error eliminando la serie");
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
    id: serie.Id,
    tipo: "serie",
    nombre: serie.Titulo,
    portada: serie.Portada,
    precio: precioCalculado,
    bloques,
    Episodios: serie.Episodios,
  };

  return (
    <ProductCard
      portadaUrl={portadaUrl}
      imageAlt={serie.Titulo}
      navigateLink={`/serie/${serie.Id}`}
      navigateState={{ from, precioPorCapitulo }}
      product={product}
      showToast={showToast}
      titulo={serie.Titulo}
      adminButtons={renderAdminSection}
    />
  );
}


