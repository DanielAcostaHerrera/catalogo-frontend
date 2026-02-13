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
//  ÚLTIMOS ESTRENOS JUEGOS (SIN ONLINE)
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

// ============================================================
//  CATÁLOGO DE SERIES (SIN FILTROS)
// ============================================================
export const GET_CATALOGO_SERIES = gql`
  query CatalogoSeries($page: Int!, $limit: Int!) {
    catalogoSeries(page: $page, limit: $limit) {
      series {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  CATÁLOGO DE SERIES FILTRADO (POR NOMBRE)
// ============================================================
export const GET_CATALOGO_SERIES_FILTRADO = gql`
  query CatalogoSeriesFiltrado($page: Int!, $limit: Int!, $titulo: String) {
    catalogoSeriesFiltrado(page: $page, limit: $limit, titulo: $titulo) {
      series {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  ÚLTIMOS ESTRENOS DE SERIES (ORDENADOS POR Id DESC)
// ============================================================
export const GET_ULTIMOS_ESTRENOS_SERIES = gql`
  query UltimosEstrenosSeries($limit: Int!) {
    ultimosEstrenosSeries(limit: $limit) {
      series {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  DETALLES DE UNA SERIE
// ============================================================
export const GET_SERIE = gql`
  query Serie($id: Int!) {
    serie(id: $id) {
      Id
      Titulo
      Portada
      Anno
      Temporadas
      Sinopsis
      Episodios
    }
  }
`;

// ============================================================
//  CATÁLOGO DE ANIMADOS (SIN FILTROS)
// ============================================================
export const GET_CATALOGO_ANIMADOS = gql`
  query CatalogoAnimados($page: Int!, $limit: Int!) {
    catalogoAnimados(page: $page, limit: $limit) {
      series {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  CATÁLOGO DE ANIMADOS FILTRADO (POR TÍTULO)
// ============================================================
export const GET_CATALOGO_ANIMADOS_FILTRADO = gql`
  query CatalogoAnimadosFiltrado($page: Int!, $limit: Int!, $titulo: String) {
    catalogoAnimadosFiltrado(page: $page, limit: $limit, titulo: $titulo) {
      series {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  ÚLTIMOS ESTRENOS DE ANIMADOS (ORDENADOS POR Id DESC)
// ============================================================
export const GET_ULTIMOS_ESTRENOS_ANIMADOS = gql`
  query UltimosEstrenosAnimados($limit: Int!) {
    ultimosEstrenosAnimados(limit: $limit) {
      series {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  DETALLES DE UN ANIMADO
// ============================================================
export const GET_ANIMADO = gql`
  query Animado($id: Int!) {
    animado(id: $id) {
      Id
      Titulo
      Portada
      Anno
      Temporadas
      Sinopsis
      Episodios
    }
  }
`;

// ============================================================
//  CATÁLOGO DE ANIMES (SIN FILTROS)
// ============================================================
export const GET_CATALOGO_ANIMES = gql`
  query CatalogoAnimes($page: Int!, $limit: Int!) {
    catalogoAnimes(page: $page, limit: $limit) {
      animes {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  CATÁLOGO DE ANIMES FILTRADO (POR TÍTULO)
// ============================================================
export const GET_CATALOGO_ANIMES_FILTRADO = gql`
  query CatalogoAnimesFiltrado($page: Int!, $limit: Int!, $titulo: String) {
    catalogoAnimesFiltrado(page: $page, limit: $limit, titulo: $titulo) {
      animes {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  ÚLTIMOS ESTRENOS DE ANIMES (ORDENADOS POR Id DESC)
// ============================================================
export const GET_ULTIMOS_ESTRENOS_ANIMES = gql`
  query UltimosEstrenosAnimes($limit: Int!) {
    ultimosEstrenosAnimes(limit: $limit) {
      animes {
        Id
        Titulo
        Portada
        Anno
        Temporadas
        Episodios
      }
      total
    }
  }
`;

// ============================================================
//  DETALLES DE UN ANIME
// ============================================================
export const GET_ANIME = gql`
  query Anime($id: Int!) {
    anime(id: $id) {
      Id
      Titulo
      Portada
      Anno
      Temporadas
      Sinopsis
      Episodios
    }
  }
`;