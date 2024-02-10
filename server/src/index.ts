import { ApolloServer } from "@apollo/server";
import express from "express";
import cors from "cors";

const PORT = 4000;

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());
}

main().catch((error) => console.error(error));
