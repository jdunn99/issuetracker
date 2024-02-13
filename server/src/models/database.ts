import "dotenv/config";
import { Expression, Kysely, PostgresDialect, expressionBuilder } from "kysely";
import { Pool } from "pg";
import { User, UserTable } from "./user-model";
import { ProjectTable } from "./project-model";
import { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import { ConnectionArgs } from "./types";

export interface Database {
  project: ProjectTable;
  user: UserTable;
}

export type Context = StandaloneServerContextFunctionArgument;

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "postgres",
    host: "localhost",
    user: "postgres",
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

/**
 * @function
 * Typesafe function for implementing SQL query of pagination
 * @param key - The table we are selecting from
 * @returns
 */
export function getPaginatedResult(
  key: keyof Database,
  { first, after }: ConnectionArgs
) {
  return db
    .selectFrom(key)
    .selectAll()
    .orderBy("id")
    .$if(typeof first !== "undefined", (qb) => qb.limit(first))
    .$if(typeof after !== "undefined", (qb) =>
      qb.where("id", ">", parseInt(after))
    );
}
