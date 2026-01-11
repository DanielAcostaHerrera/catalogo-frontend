import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://catalogo-backend-f4sk.onrender.com/graphql",
    cache: new InMemoryCache(),
});

export default client;

