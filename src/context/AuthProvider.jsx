import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useApolloClient, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($usuario: String!, $password: String!) {
    login(usuario: $usuario, password: $password)
  }
`;

// Decodificar el JWT sin librerías externas
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Error decodificando token:", err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodeJWT(token);
  });

  const [isLogged, setIsLogged] = useState(() => !!localStorage.getItem("token"));
  const client = useApolloClient();

  async function login(usuario, password) {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { usuario, password },
      });

      const token = data.login;
      localStorage.setItem("token", token);

      // Decodificar el token para obtener id, usuario y rol
      const payload = decodeJWT(token);
      setUser(payload);
      setIsLogged(true);

      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  }

  async function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsLogged(false);
    await client.clearStore();
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}



