import "dotenv/config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { User, UserTable } from "./user-model";
import { ProjectTable } from "./project-model";

export interface Database {
  project: ProjectTable;
  user: UserTable;
}

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
