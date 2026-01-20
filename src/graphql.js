import gql from "graphql-tag";

// ============================================================
//  CATÁLOGO NORMAL (SIN FILTROS)
// ============================================================
export const GET_CATALOGO = gql`
  query Catalogo($page: Int!, $limit: Int!) {
    catalogo(page: $page, limit: $limit) {
      juegos {
        Id
        Nombre
        Portada
        TamanoFormateado
        Precio
        AnnoAct
        Requisitos   # 🔹 añadido
      }
      total
    }
  }
`;

// ============================================================
//  CATÁLOGO FILTRADO (BÚSQUEDA + FILTROS)
// ============================================================
export const GET_CATALOGO_FILTRADO = gql`
  query CatalogoFiltrado(
    $page: Int!
    $limit: Int!
    $nombre: String
    $tamanoMin: Float
    $tamanoMax: Float
    $annoMin: Int
    $annoMax: Int
    $precioMin: Int
    $precioMax: Int
  ) {
    catalogoFiltrado(
      page: $page
      limit: $limit
      nombre: $nombre
      tamanoMin: $tamanoMin
      tamanoMax: $tamanoMax
      annoMin: $annoMin
      annoMax: $annoMax
      precioMin: $precioMin
      precioMax: $precioMax
    ) {
      juegos {
        Id
        Nombre
        Portada
        TamanoFormateado
        Precio
        AnnoAct
        Requisitos
      }
      total
    }
  }
`;

// ============================================================
//  DETALLES DE UN JUEGO
// ============================================================
export const GET_JUEGO = gql`
  query Juego($id: Int!) {
    juego(id: $id) {
      Id
      Nombre
      Portada
      TamanoFormateado
      Precio
      AnnoAct
      Sinopsis
      Requisitos
    }
  }
`;

// ============================================================
//  ÚLTIMOS ESTRENOS (AÑO ACTUAL, SIN ONLINE)
// ============================================================
export const GET_ULTIMOS_ESTRENOS = gql`
  query UltimosEstrenos($limit: Int!) {
    ultimosEstrenos(limit: $limit) {
      juegos {
        Id
        Nombre
        Portada
        TamanoFormateado
        Precio
        AnnoAct
        Requisitos
      }
      total
    }
  }
`;
