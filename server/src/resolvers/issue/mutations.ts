import { Project } from "../../entities/Project";
import { FeedType, Role, Severity, Status } from "../../types";
import { getConnection, getRepository } from "typeorm";
import {
  notAuthorized,
  notFound,
  notLoggedIn,
} from "../graphql-response/ErrorFunctions";
import { Issue } from "../../entities/Issue";
import { PubSubEngine } from "type-graphql";
import { User } from "../../entities/User";
import { Feed } from "../../entities/Feed";
import { IssueResponse } from "../graphql-response/Response";

/**
 * Create a new issue.
 * @param name the name of the issue
 * @param projectId the project the issue belongs to
 * @param desc the description of the issue
 * @param severity the severity of the issue
 * @param userId the id who created the issue
 * @param pubsub PubSubEngine used to publish subscriptions
 * @returns {Promise<IssueResponse>} the created issue
 */
export const createIssueMutation = async (
  name: string,
  projectId: number,
  desc: string,
  severity: Severity,
  userId: number | null,
  pubsub: PubSubEngine
): Promise<IssueResponse> => {
  if (!userId) return notLoggedIn();

  // Get the user
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select()
    .where("user.id = :userId", { userId })
    .getOne();

  if (!user) return notFound("user");

  // Get the project
  const project = await getRepository(Project)
    .createQueryBuilder("project")
    .leftJoinAndSelect("project.projectManagement", "projectManagement")
    .leftJoin("projectManagement.user", "user")
    .addSelect("user.id")
    .where("project.id = :projectId", { projectId })
    .getOne();

  if (!project) return notFound("project");

  const connection = getConnection();
  const newIssue = new Issue();

  // Build the issue
  newIssue.name = name;
  newIssue.project = project;
  newIssue.desc = desc;
  newIssue.severity = severity;
  newIssue.status = Status.TODO;
  newIssue.comments = [];
  newIssue.owner = user;

  const test = connection
    .createQueryBuilder()
    .insert()
    .into(Issue)
    .values({
      name,
      project,
      desc,
      severity,
      status: Status.TODO,
      owner: user,
    })
    .getSql();

  console.log(test);
  await connection.manager.save(newIssue);

  // Publish feed to all members
  project.projectManagement.forEach(async (temp) => {
    console.log(temp);
    if (user.id === temp.user.id) return;
    const feed = new Feed();
    feed.title = `${project.name} - ${user.name} created a new issue`;
    feed.subheading = newIssue.name;
    feed.desc = newIssue.desc;
    feed.type = FeedType.New;
    feed.user = temp.user;

    await connection.manager.save(feed);
    await pubsub.publish("FEED", feed);
  });

  return { response: newIssue };
};

type UpdatePayload = {
  desc?: string;
  status?: Status;
  severity?: Severity;
  name?: string;
};

/**
 * Update an issue given a payload.
 * @param issueId the ID of the issue to be updated.
 * @param userId the user ID making the request to update the issue.
 * @param {UpdatePayload} payload the payload being sent
 * @returns
 */
export const updateIssueMutation = async (
  issueId: number,
  userId: number | null,
  { name, desc, status, severity }: UpdatePayload
): Promise<IssueResponse> => {
  if (!userId) return notLoggedIn();

  // Get User and the ProjectManagement
  const issue = await getRepository(Issue)
    .createQueryBuilder("issue")
    .leftJoin("issue.project", "project")
    .leftJoin("project.projectManagement", "projectManagement")
    .select("issue")
    .addSelect(["project", "projectManagement.role"])
    .where("issue.id = :issueId", { issueId })
    .andWhere("projectManagement.user.id = :userId", { userId })
    .getOne();

  if (!issue) return notFound("issue");
  if (issue.project.projectManagement.length === 0) return notAuthorized();

  const role = issue.project.projectManagement[0].role; // always length 1 array
  if (role !== Role.ADMIN && role !== Role.OWNER) return notAuthorized();

  if (name) issue.name = name;
  if (desc) issue.desc = desc;
  if (status) issue.status = status;
  if (severity) issue.severity = severity;

  return { response: issue };
};
