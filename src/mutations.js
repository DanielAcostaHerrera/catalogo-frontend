import gql from "graphql-tag";

// ============================================================
//  CREAR JUEGO
// ============================================================
export const CREAR_JUEGO = gql`
  mutation CrearJuego($data: CrearJuegoInput!) {
    crearJuego(data: $data) {
      Id
      Nombre
      Tamano
      Portada
      AnnoAct
      Requisitos
    }
  }
`;

// ============================================================
//  ACTUALIZAR JUEGO
// ============================================================
export const ACTUALIZAR_JUEGO = gql`
  mutation ActualizarJuego($data: ActualizarJuegoInput!) {
    actualizarJuego(data: $data) {
      Id
      Nombre
      Tamano
      Portada
      AnnoAct
      Requisitos
    }
  }
`;

// ============================================================
//  ELIMINAR JUEGO
// ============================================================
export const ELIMINAR_JUEGO = gql`
  mutation EliminarJuego($id: Int!) {
    eliminarJuego(id: $id)
  }
`;

// ============================================================
//  CREAR SERIE
// ============================================================
export const CREAR_SERIE = gql`
  mutation CrearSerie($data: CreateSeriesInput!) {
    crearSerie(data: $data) {
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
//  ACTUALIZAR SERIE
// ============================================================
export const ACTUALIZAR_SERIE = gql`
  mutation ActualizarSerie($data: UpdateSeriesInput!) {
    actualizarSerie(data: $data) {
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
//  ELIMINAR SERIE
// ============================================================
export const ELIMINAR_SERIE = gql`
  mutation EliminarSerie($id: Int!) {
    eliminarSerie(id: $id)
  }
`;

// ============================================================
//  CREAR ANIMADO
// ============================================================
export const CREAR_ANIMADO = gql`
  mutation CrearAnimado($data: CreateAnimadoInput!) {
    crearAnimado(data: $data) {
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
//  ACTUALIZAR ANIMADO
// ============================================================
export const ACTUALIZAR_ANIMADO = gql`
  mutation ActualizarAnimado($data: UpdateAnimadoInput!) {
    actualizarAnimado(data: $data) {
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
//  ELIMINAR ANIMADO
// ============================================================
export const ELIMINAR_ANIMADO = gql`
  mutation EliminarAnimado($id: Int!) {
    eliminarAnimado(id: $id)
  }
`;

// ============================================================
//  CREAR ANIME
// ============================================================
export const CREAR_ANIME = gql`
  mutation CrearAnime($data: CreateAnimeInput!) {
    crearAnime(data: $data) {
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
//  ACTUALIZAR ANIME
// ============================================================
export const ACTUALIZAR_ANIME = gql`
  mutation ActualizarAnime($data: UpdateAnimeInput!) {
    actualizarAnime(data: $data) {
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
//  ELIMINAR ANIME
// ============================================================
export const ELIMINAR_ANIME = gql`
  mutation EliminarAnime($id: Int!) {
    eliminarAnime(id: $id)
  }
`;
