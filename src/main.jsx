import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import App from "./App";
import "./index.css";

// Configuración del cliente Apollo (v2.x)
const client = new ApolloClient({
  link: new HttpLink({ uri: "https://catalogo-backend-f4sk.onrender.com/graphql" }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);



