import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useApolloClient, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($usuario: String!, $password: String!) {
    login(usuario: $usuario, password: $password)
  }
`;

export function AuthProvider({ children }) {
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
      setIsLogged(true);

      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  }

  async function logout() {
    localStorage.removeItem("token");
    setIsLogged(false);
    await client.clearStore();
  }

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}



