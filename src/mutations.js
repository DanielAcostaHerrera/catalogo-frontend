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