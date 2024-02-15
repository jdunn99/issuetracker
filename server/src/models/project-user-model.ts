import { Insertable, Selectable, Updateable } from "kysely";

export enum Role {
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
  CREATOR = "CREATOR",
}

export interface ProjectUserTable {
  role: Role;
  user_id: number;
  project_id: number;
}
export type ProjectUser = Selectable<ProjectUserTable>;
export type NewProjectUser = Insertable<ProjectUserTable>;
export type UpdateProjectUser = Updateable<ProjectUserTable>;
