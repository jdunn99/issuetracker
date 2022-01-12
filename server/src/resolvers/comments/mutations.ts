import { PubSubEngine } from "apollo-server-express";
import { Issue } from "../../entities/Issue";
import { User } from "../../entities/User";
import { Error } from "../../entities/Error";
import { Comment } from "../../entities/Comment";
import { getRepository, getConnection } from "typeorm";
import {
  notAuthorized,
  notFound,
  notLoggedIn,
} from "../graphql-response/ErrorFunctions";
import { Feed } from "../../entities/Feed";
import { FeedType } from "../../types";
import { DeletionResponse } from "../graphql-response/Response";

/**
 * Creates a Comment and stores it on the proper Issue
 * @param issueId the ID of the issue being written to
 * @param content the actual content of the comment (the text)
 * @param userId the User who posts the comment
 * @param pubsub PubSub for being sent via websocket
 * @returns
 */
export const createCommentMutation = async (
  issueId: number,
  content: string,
  userId: number | null,
  pubsub: PubSubEngine
): Promise<Error[] | null> => {
  // We need the User to save the comment to
  if (!userId) return notLoggedIn().errors;
  const user = await getRepository(User).findOne({ id: userId });

  if (!user) return notFound("user").errors;

  if (content.length === 0)
    return [
      {
        field: "content",
        message: "Invalid comment. Comment should not be empty",
      },
    ];

  // Insert into issue
  const issue = await getRepository(Issue)
    .createQueryBuilder("issue")
    .leftJoinAndSelect("issue.project", "project")
    .leftJoinAndSelect("project.projectManagement", "projectManagement")
    .leftJoinAndSelect("projectManagement.user", "user")
    .where("issue.id = :issueId", { issueId })
    .getOne();

  if (!issue) return notFound("issue").errors;

  const connection = getConnection();
  const newComment = new Comment();

  newComment.comment = content;
  newComment.issue = issue;
  newComment.postedBy = user;
  await connection.manager.save(newComment);

  await pubsub.publish("COMMENT", newComment);

  // Publish feed
  issue.project.projectManagement.forEach(async ({ user: temp }) => {
    if (user.id === temp.id) return;
    const feed = new Feed();
    feed.title = `${issue.project.name} - ${user.name} posted a comment`;
    feed.desc = content;
    feed.subheading = issue.name;
    feed.type = FeedType.Comment;
    feed.user = temp;

    await connection.manager.save(feed);
    await pubsub.publish("FEED", feed);
  });

  return null;
};

/**
 * Delete a comment given the ID
 * @param commentId the ID of the comment being deleted
 * @param userId the ID of the user deleting the comment
 * @returns {Promise<DeletionResponse>}
 */
export const deleteCommentMutation = async (
  commentId: number,
  userId: number | null
): Promise<DeletionResponse> => {
  if (!userId) return notLoggedIn();

  const comment = await getRepository(Comment).findOne({ id: commentId });
  if (!comment) return notFound("comment");

  // Check auth
  if (comment.postedBy.id !== userId) return notAuthorized();

  const connection = getConnection();
  await connection.manager.delete(Comment, comment);

  return { response: [commentId] };
};
