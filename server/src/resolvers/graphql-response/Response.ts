import { Field, InterfaceType, Int, ObjectType } from "type-graphql";
import { Error } from "../../entities/Error";
import { ProjectManagement } from "../../entities/ProjectManagement";
import { Issue } from "../../entities/Issue";
import {
  UserIssue,
  UserProject,
  FormattedIssues,
  OverviewResponse,
  ProjectRes,
  UserRes,
} from "./Objects";

@InterfaceType()
abstract class Response {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];
}

@InterfaceType()
abstract class PaginatedResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => Boolean)
  hasMore?: boolean;
}

/** Response Types */
@ObjectType({ implements: [Response] })
export class ProjectIssueResponse extends Response {
  @Field(() => [UserIssue], { nullable: true })
  response?: UserIssue[];
}

@ObjectType({ implements: [Response] })
export class UserResponse extends Response {
  @Field(() => UserRes, { nullable: true })
  response?: UserRes;
}

@ObjectType({ implements: [PaginatedResponse] })
export class UserOverviewResponse extends PaginatedResponse {
  @Field(() => OverviewResponse, { nullable: true })
  response?: OverviewResponse;
}

@ObjectType({ implements: [Response] })
export class ProjectManagementResponse extends Response {
  @Field(() => ProjectManagement, { nullable: true })
  response?: ProjectManagement;
}

@ObjectType({ implements: [PaginatedResponse] })
export class ProjectUserResponse extends PaginatedResponse {
  @Field(() => [ProjectManagement], { nullable: true })
  response?: ProjectManagement[];
}

@ObjectType({ implements: [Response] })
export class IssueResponse extends Response {
  @Field(() => Issue, { nullable: true })
  response?: Issue;
}

@ObjectType({ implements: [Response] })
export class ProjectResponse extends Response {
  @Field(() => ProjectRes, { nullable: true })
  response?: ProjectRes;
}

@ObjectType({ implements: [Response] })
export class UserProjectResponse extends Response {
  @Field(() => [UserProject], { nullable: true })
  response?: UserProject[];
}

@ObjectType({ implements: [Response] })
export class FormattedIssueResponse extends Response {
  @Field(() => FormattedIssues, { nullable: true })
  response?: FormattedIssues;
}

@ObjectType({ implements: [Response] })
export class DeletionResponse extends Response {
  @Field(() => [Int], { nullable: true })
  response?: number[];
}
