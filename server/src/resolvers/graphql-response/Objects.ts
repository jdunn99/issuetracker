import { Feed } from "../../entities/Feed";
import { Project } from "../../entities/Project";
import { ProjectManagement } from "../../entities/ProjectManagement";
import { User } from "../../entities/User";
import { Role, Severity, Status } from "../../types";
import { Field, ObjectType, Int } from "type-graphql";

/** Helper/Handler Types */

/** Helper/Handler Types */

// Exported for Type definitions in resolver.
@ObjectType()
export class UserIssue {
  @Field()
  name: string;

  @Field(() => Int)
  id: number;

  @Field()
  createdAt: string;

  @Field(() => Severity)
  severity: Severity;

  @Field(() => Status)
  status: Status;

  @Field()
  projectName: string;

  @Field()
  projectId: number;

  @Field()
  desc: String;
}

@ObjectType()
export class FormattedIssues {
  @Field(() => [UserIssue])
  TODO: UserIssue[];

  @Field(() => [UserIssue])
  PROGRESS: UserIssue[];

  @Field(() => [UserIssue])
  REVIEW: UserIssue[];

  @Field(() => [UserIssue])
  RESOLVED: UserIssue[];
}

@ObjectType()
export class UserRes {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ProjectManagement], { nullable: true })
  projectManagement?: ProjectManagement[];
}

@ObjectType()
export class OverviewResponse {
  @Field(() => [Feed])
  feed: Feed[];

  @Field(() => Int)
  created: number;

  @Field(() => Int)
  posted: number;

  @Field(() => Int)
  owned: number;

  @Field(() => Int)
  projects: number;
}

@ObjectType()
export class ProjectRes {
  @Field(() => Project)
  project: Project;

  @Field(() => Role)
  canEdit: Role;
}

@ObjectType()
export class UserProject {
  @Field()
  name: string;

  @Field()
  createdAt: string;

  @Field(() => Int)
  issues: number;

  @Field()
  owner: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Int)
  id: number;
}

@ObjectType()
export class ProjectPayload {
  @Field(() => [Int])
  deleted: number[];

  @Field(() => [Int])
  subscribers: number;
}
