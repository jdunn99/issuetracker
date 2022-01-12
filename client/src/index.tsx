import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
  uri: `wss://api.jackdunn.info/graphql`,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: "https://api.jackdunn.info/graphql",
  credentials: "include",
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getUsersForProject: {
            keyArgs: ["type", "id"],
            merge(
              existing = { response: [], errors: [], hasMore: true },
              incoming
            ) {
              let result = {
                errors: existing.errors,
                response: existing.response,
                hasMore: incoming.hasMore,
                __typename: "ProjectUserResponse",
              };

              result.response = [...result.response, ...incoming.response];

              return result;
            },
          },
          getUserOverview: {
            keyArgs: false,
            merge(
              existing = {
                response: {
                  feed: [],
                  created: 0,
                  owned: 0,
                  posted: 0,
                  projects: 0,
                },
                errors: [],
                hasMore: false,
              },
              incoming
            ) {
              let result = {
                errors: existing.errors,
                response: existing.response,
                hasMore: incoming.hasMore,
                __typename: "UserOverview",
              };

              if (incoming.errors && incoming.errors.length > 0) {
                result.errors = [...result.errors, ...incoming.errors];
                return result;
              }

              return {
                ...incoming,
                response: {
                  ...incoming.response,
                  feed: [...existing.response.feed, ...incoming.response.feed],
                },
              };
            },
          },
        },
      },
    },
  }),
  credentials: "include",
});

ReactDOM.render(
  <ChakraProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
