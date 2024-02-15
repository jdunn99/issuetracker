import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { Connection, Edge, Payload } from "./types";

export interface UserTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  username: string;
  password: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdatedUser = Updateable<UserTable>;

export type UserEdge = Edge<User>;
export type UserConnection = Connection<UserEdge>;

export interface UserPayload extends Payload {
  user: User | null;
}
