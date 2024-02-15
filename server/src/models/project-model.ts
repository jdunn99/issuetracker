import {
  ColumnType,
  Generated,
  Insertable,
  Nullable,
  Selectable,
  Updateable,
} from "kysely";
import { Connection, Edge, Payload } from "./types";

export interface ProjectTable {
  id: Generated<number>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string, Date>;
  creator_id: number;
  description: string;
  name: string;
  url: string;
  image: Nullable<string>;
}
export type Project = Selectable<ProjectTable>;
export type NewProject = Insertable<ProjectTable>;
export type UpdatedProject = Updateable<ProjectTable>;

export type ProjectEdge = Edge<Project>;
export type ProjectConnection = Connection<ProjectEdge>;

export interface ProjectPayload extends Payload {
  project: Project | null;
}
