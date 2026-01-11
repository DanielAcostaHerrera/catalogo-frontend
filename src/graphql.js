import gql from "graphql-tag";

export const GET_CATALOGO = gql`
  query Catalogo($page: Int!, $limit: Int!) {
    catalogo(page: $page, limit: $limit) {
      Id
      Nombre
      Portada
      Tamano
      AnnoAct
    }
  }
`;

export const GET_CATALOGO_FILTRADO = gql`
  query CatalogoFiltrado(
    $page: Int!,
    $limit: Int!,
    $nombre: String,
    $tamanoMin: Float,
    $tamanoMax: Float,
    $annoMin: Int,
    $annoMax: Int
  ) {
    catalogoFiltrado(
      page: $page,
      limit: $limit,
      nombre: $nombre,
      tamanoMin: $tamanoMin,
      tamanoMax: $tamanoMax,
      annoMin: $annoMin,
      annoMax: $annoMax
    ) {
      Id
      Nombre
      Portada
      Tamano
      AnnoAct
    }
  }
`;

export const GET_JUEGO = gql`
  query Juego($id: Int!) {
    juego(id: $id) {
      Id
      Nombre
      Portada
      Tamano
      Precio
      AnnoAct
      Sinopsis
    }
  }
`;
