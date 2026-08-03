import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ELIMINAR_ANIME } from "../mutations";
import AddToCartButton from "../components/AddToCartButton";
import ProductCard from "./ProductCard";

export default function AnimeCard({
  anime,
  from,
  showToast,
  precioPorCapitulo,
}) {
  const navigate = useNavigate();

  const portadaUrl = `https://catalogo-backend-f4sk.onrender.com/portadas/Portadas Anime/${anime.Portada}`;

  function handleEdit() {
    navigate(`/editar-anime/${anime.Id}`, { state: { from } });
  }

  const lineas = (anime.Episodios ?? "")
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

  if (/serie entera/i.test(anime.Episodios)) {
    bloques = [{ descripcion: "Serie entera" }];
  }

  const precioCalculado = totalEpisodios * Number(precioPorCapitulo);

  const [eliminarAnime] = useMutation(ELIMINAR_ANIME);

  const renderAdminSection = () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={handleEdit} className="admin-edit-btn">
        ✏️
      </button>

      <button
        onClick={async () => {
          if (!window.confirm(`¿Eliminar "${anime.Titulo}" del catálogo?`))
            return;

          try {
            const res = await eliminarAnime({
              variables: { id: anime.Id },
            });

            if (res.data.eliminarAnime) {
              alert("Anime eliminado correctamente");
              window.location.reload();
            } else {
              alert("No se pudo eliminar el anime");
            }
          } catch (err) {
            console.error(err);
            alert("Error eliminando el anime");
          }
        }}
        className="admin-delete-btn"
      >
        🗑️
      </button>
    </div>
  );

  const product = {
    id: anime.Id,
    tipo: "anime",
    nombre: anime.Titulo,
    portada: anime.Portada,
    precio: precioCalculado,
    bloques,
    Episodios: anime.Episodios,
  };

  return (
    <ProductCard
      portadaUrl={portadaUrl}
      showToast={showToast}
      handleEdit={handleEdit}
      product={product}
      navigateLink={`/anime/${anime.Id}`}
      navigateState={{ from, precioPorCapitulo }}
      titulo={anime.Titulo}
      imageAlt={anime.Titulo}
      adminButtons={renderAdminSection}
    />
  );
}

