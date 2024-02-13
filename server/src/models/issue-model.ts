import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH";
export type IssueStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "TESTING"
  | "CLOSED";

export interface IssueTable {
  id: Generated<number>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string, Date>;
  name: string;
  url: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  creator_id: number;
  workspace_id: number;
  project_id: number;
}

export type Issue = Selectable<IssueTable>;
export type NewIssue = Insertable<IssueTable>;
export type UpdatedIssue = Updateable<IssueTable>;
