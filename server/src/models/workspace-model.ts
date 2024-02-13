import {
  ColumnType,
  Generated,
  Insertable,
  Nullable,
  Selectable,
  Updateable,
} from "kysely";

export interface WorkspaceTable {
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
export type Workspace = Selectable<WorkspaceTable>;
export type NewWorkspace = Insertable<WorkspaceTable>;
export type UpdatedWorkspace = Updateable<WorkspaceTable>;
