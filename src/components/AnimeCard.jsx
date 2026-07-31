import { Link, useNavigate } from "react-router-dom";
import { Mutation } from "react-apollo";
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

  const renderAdminSection = () => (
    <Mutation mutation={ELIMINAR_ANIME}>
      {(eliminarAnime) => (
        <>
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
        </>
      )}
    </Mutation>
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
    // <div
    //     style={{
    //         border: "1px solid #2a2a2a",
    //         borderRadius: 6,
    //         overflow: "hidden",
    //         backgroundColor: "#1e1e1e",
    //     }}
    // >
    //     <Link
    //         to={`/anime/${anime.Id}`}
    //         state={{ from, precioPorCapitulo }}
    //         style={{ textDecoration: "none", color: "inherit" }}
    //     >
    //         <img
    //             src={portadaUrl}
    //             alt={anime.Titulo}
    //             style={{
    //                 width: "100%",
    //                 height: 180,
    //                 objectFit: "fill",
    //                 backgroundColor: "#000",
    //                 transition: "transform 0.2s, boxShadow 0.2s",
    //                 display: "block",
    //             }}
    //             loading="lazy"
    //         />

    //         <h3
    //             style={{
    //                 margin: 8,
    //                 fontSize: 15,
    //                 color: "#f0f0f0",
    //                 textAlign: "center",
    //             }}
    //         >
    //             {anime.Titulo}
    //         </h3>
    //     </Link>

    //     <div
    //         style={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             gap: 8,
    //             marginBottom: 8,
    //         }}
    //     >
    //         <AddToCartButton
    //             item={{
    //                 id: anime.Id,
    //                 tipo: "anime",
    //                 nombre: anime.Titulo,
    //                 portada: anime.Portada,
    //                 precio: precioCalculado,
    //                 bloques,
    //                 Episodios: anime.Episodios,
    //             }}
    //             showToast={showToast}
    //         />
    //     </div>
    // </div>
  );
}
