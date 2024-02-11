import {
  ColumnType,
  Generated,
  Insertable,
  Nullable,
  Selectable,
  Updateable,
} from "kysely";

export interface ProjectTable {
  id: Generated<number>;
  name: string;
  url: string;
  creator_id: number;
  description: string;
  image: Nullable<string>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string, Date>;
}
export type Project = Selectable<ProjectTable>;
export type NewProject = Insertable<ProjectTable>;
export type UpdatedProject = Updateable<ProjectTable>;
