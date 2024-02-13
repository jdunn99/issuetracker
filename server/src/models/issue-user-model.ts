import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface IssueUserTable {
  id: Generated<number>;
  user_id: number;
  issue_id: number;
}
export type ProjectUser = Selectable<IssueUserTable>;
export type NewProjectUser = Insertable<IssueUserTable>;
export type UpdateProjectUser = Updateable<IssueUserTable>;
