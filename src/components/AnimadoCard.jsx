import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ELIMINAR_ANIMADO } from "../mutations";
import ProductCard from "./ProductCard";
import { authContext } from "../context/AuthContext";

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
    <>
      <button onClick={handleEdit} className="btn-add" data-variant="edit">
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
              alert("Error eliminando el animado");
            }
          }
        }}
        className="btn-add"
        data-variant="delete"
      >
        🗑️
      </button>
    </>
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
      meta={[animado.Anno, animado.Temporadas != null ? `${animado.Temporadas} temp.` : null].filter(Boolean).join(" · ")}
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


