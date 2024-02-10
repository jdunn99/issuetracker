import { ColumnType, Generated, Insertable, Selectable } from "kysely";

export interface Database {}

export interface UserTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
