import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ELIMINAR_SERIE } from "../mutations";
import AddToCartButton from "../components/AddToCartButton";
import ProductCard from "./ProductCard";

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

  // 🔥 Apollo moderno: reemplazo de <Mutation>
  const [eliminarSerie] = useMutation(ELIMINAR_SERIE);

  const renderAdminSection = () => (
    <>
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
            });

            if (res.data.eliminarSerie) {
              alert("Serie eliminada correctamente");
              window.location.reload();
            } else {
              alert("No se pudo eliminar la serie");
            }
          } catch (err) {
            console.error(err);
            alert("Error eliminando la serie");
          }
        }}
        className="admin-delete-btn"
      >
        🗑️
      </button>
    </>
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

