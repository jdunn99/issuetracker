import {
  ColumnType,
  Generated,
  Insertable,
  Nullable,
  Selectable,
  Updateable,
} from "kysely";

export interface WorspaceTable {
  id: Generated<number>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string, Date>;
  name: string;
  description: string;
  url: string;
  image: Nullable<string>;
  creator_id: number;
  project_id: number;
}
export type Workspace = Selectable<WorspaceTable>;
export type NewWorkspace = Insertable<WorspaceTable>;
export type UpdatedWorkspace = Updateable<WorspaceTable>;
