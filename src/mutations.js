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