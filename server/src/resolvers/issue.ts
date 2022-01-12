import { Severity, Status, Context } from "../types";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Root,
  Subscription,
  PubSub,
} from "type-graphql";
import { Issue } from "../entities/Issue";
import { PubSubEngine } from "apollo-server-express";
import {
  IssueResponse,
  ProjectIssueResponse,
} from "./graphql-response/Response";
import { getIssuesQuery } from "./issue/queries";
import { createIssueMutation, updateIssueMutation } from "./issue/mutations";

/**
 * GraphQL Resolver for Issue entity.
 */
@Resolver(() => Issue)
export class IssueResolver {
  /************** QUERIES **************/

  @Query(() => ProjectIssueResponse)
  getIssuesFromProject(
    @Arg("id") id: number,
    @Ctx() { req }: Context
  ): Promise<ProjectIssueResponse> {
    return getIssuesQuery(id, req.session.userId);
  }

  /************** MUTATIONS **************/

  @Mutation(() => IssueResponse, { nullable: true })
  createIssue(
    @Arg("name") name: string,
    @Arg("projectId") projectId: number,
    @Arg("desc") desc: string,
    @Arg("severity") severity: Severity,
    @PubSub() pubsub: PubSubEngine,
    @Ctx() { req }: Context
  ): Promise<IssueResponse> {
    return createIssueMutation(
      name,
      projectId,
      desc,
      severity,
      req.session.userId,
      pubsub
    );
  }

  @Mutation(() => IssueResponse)
  updateIssue(
    @Ctx() { req }: Context,
    @Arg("id") id: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("desc", { nullable: true }) desc?: string,
    @Arg("status", { nullable: true }) status?: Status,
    @Arg("severity", { nullable: true }) severity?: Severity
  ): Promise<IssueResponse> {
    return updateIssueMutation(id, req.session.userId, {
      name,
      desc,
      status,
      severity,
    });
  }

  /************** SUBSCRIPTIONS **************/

  @Subscription(() => Issue, {
    topics: "ISSUE",
  })
  async sendIssue(@Root() payload: Issue): Promise<Issue> {
    return {
      ...payload,
    } as Issue;
  }
}
