import { Issue } from "../../entities/Issue";
import { Comment } from "../../entities/Comment";
import { getRepository } from "typeorm";

export const getCommentsQuery = async (issueId: number): Promise<Comment[]> => {
  const issue = await getRepository(Issue)
    .createQueryBuilder("issue")
    .leftJoinAndSelect("issue.comments", "comments")
    .leftJoinAndSelect("comments.postedBy", "postedBy")
    .where("issue.id = :issueId", { issueId })
    .getOne();

  if (!issue) throw new Error();

  return issue.comments;
};
