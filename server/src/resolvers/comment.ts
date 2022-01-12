import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Comment } from "../entities/Comment";
import { Context } from "../types";
import { Error } from "../entities/Error";
import { PubSubEngine } from "apollo-server-express";
import { getCommentsQuery } from "./comments/queries";
import {
  createCommentMutation,
  deleteCommentMutation,
} from "./comments/mutations";
import { DeletionResponse } from "./graphql-response/Response";

/**
 * GraphQL Resolver for Comments
 */
@Resolver(() => Comment)
export class CommentResolver {
  /** Queries */
  @Query(() => [Comment])
  getCommentsForIssue(@Arg("id") id: number): Promise<Comment[]> {
    return getCommentsQuery(id);
  }
  /** Mutations */

  @Mutation(() => [Error], { nullable: true })
  createComment(
    @Arg("content") content: string,
    @Arg("issueId") issueId: number,
    @PubSub() pubsub: PubSubEngine,
    @Ctx() { req }: Context
  ): Promise<Error[] | null> {
    return createCommentMutation(issueId, content, req.session.userId, pubsub);
  }

  @Mutation(() => Boolean)
  deleteComment(
    @Ctx() { req }: Context,
    @Arg("id") id: number
  ): Promise<DeletionResponse> {
    return deleteCommentMutation(id, req.session.userId);
  }

  /** Subscriptions */

  @Subscription(() => Comment, {
    topics: "COMMENT",
    filter: ({ payload, args }) => payload.issue.id === args.id,
  })
  async sendComment(
    @Root() payload: Comment,
    @Arg("id") _: number
  ): Promise<Comment> {
    return {
      ...payload,
    } as Comment;
  }
}
