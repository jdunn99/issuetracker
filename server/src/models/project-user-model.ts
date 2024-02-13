import { Generated, Insertable, Selectable, Updateable } from "kysely";

enum Role {
  VIEWER,
  EDITOR,
  ADMIN,
  CREATOR,
}

export interface ProjectUserTable {
  role: Role;
  user_id: number;
  project_id: number;
}
export type ProjectUser = Selectable<ProjectUserTable>;
export type NewProjectUser = Insertable<ProjectUserTable>;
export type UpdateProjectUser = Updateable<ProjectUserTable>;
