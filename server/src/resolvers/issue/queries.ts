import { Project } from "../../entities/Project";
import { getRepository } from "typeorm";
import {
  notAuthorized,
  notFound,
  notLoggedIn,
} from "../graphql-response/ErrorFunctions";
import { ProjectIssueResponse } from "../graphql-response/Response";
import { UserIssue } from "../graphql-response/Objects";

/**
 * Get the Issues for a Project formatted for DND
 * @param id the ID of the Project being sent
 * @param userId the User ID making the request
 * @returns {Promise<ProjectIssueResponse>} the issues and any accompanying errors
 */
export const getIssuesQuery = async (
  id: number,
  userId: number | null
): Promise<ProjectIssueResponse> => {
  if (!userId) return notLoggedIn();

  // Get the Project and ProjectManagement
  const project = await getRepository(Project)
    .createQueryBuilder("project")
    .leftJoin("project.projectManagement", "projectManagement")
    .leftJoinAndSelect("project.issues", "issues")
    .addSelect("projectManagement.role")
    .where("project.id = :id", { id })
    .andWhere("projectManagement.user.id = :userId", { userId })
    .getOne();

  if (!project) return notFound("project");
  if (!project.projectManagement || project.projectManagement.length === 0)
    return notAuthorized();

  // Build the formatted data for DND
  const result: UserIssue[] = project.issues.map((issue) => {
    return {
      id: issue.id,
      name: issue.name,
      createdAt: issue.createdAt.toDateString(),
      severity: issue.severity,
      status: issue.status,
      projectName: project.name,
      projectId: project.id,
      desc: issue.desc,
    };
  });

  return { response: result };
};
