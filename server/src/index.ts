import { ApolloServer } from "@apollo/server";
import "dotenv/config";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import gql from "graphql-tag";
import cors from "cors";
import { readFileSync } from "fs";
import userResolver from "./resolvers/user-resolver";
import ProjectResolver from "./resolvers/project-resolver";

const PORT = 4000;

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const typeDefs = gql(
    readFileSync("./src/models/schema.graphql", { encoding: "utf-8" })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, ProjectResolver],
  });

  await startStandaloneServer(server, {
    listen: {
      port: PORT,
    },
  });
}

main().catch((error) => console.error(error));
