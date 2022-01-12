import { Project } from "../../entities/Project";
import { ProjectManagement } from "../../entities/ProjectManagement";
import { User } from "../../entities/User";
import { getRepository } from "typeorm";
import { notFound, notLoggedIn } from "../graphql-response/ErrorFunctions";
import {
  ProjectResponse,
  ProjectUserResponse,
} from "../graphql-response/Response";

export const projectQuery = async (
  projectId: number,
  userId: number | null
): Promise<ProjectResponse> => {
  if (!userId) return notLoggedIn();

  // Get the result
  const result = await getRepository(User).query(
    `SELECT "projectManagement"."role" AS "projectManagement_role", 
		 "project"."name" AS "project_name", "project"."desc" AS "project_desc", "project"."id" 
		 AS "project_id" FROM "user" "user" LEFT JOIN "project_management" "projectManagement"
     ON "projectManagement"."userId"="user"."id"  LEFT JOIN "project"
     "project" ON "project"."id"="projectManagement"."projectId" WHERE 
		 "user"."id" = ${userId} AND "project"."id" = ${projectId};`
  );

  if (!result || result.length === 0)
    return {
      errors: [
        {
          field: "project",
          message:
            "Something went wrong fetching the project! Please try again.",
        },
      ],
    };

  return {
    response: {
      project: {
        id: result[0].project_id,
        name: result[0].project_name,
        desc: result[0].project_desc,
      } as Project,
      canEdit: parseFloat(result[0].projectManagement_role),
    },
  };
};

export const projectUsersQuery = async (
  projectId: number,
  limit: number,
  userId: number | null,
  cursor?: string,
  search?: string
): Promise<ProjectUserResponse> => {
  if (!userId) return { errors: notLoggedIn().errors, hasMore: false };
  const edge = limit + 1;

  // Start query
  const query = getRepository(ProjectManagement)
    .createQueryBuilder("projectManagement")
    .leftJoin("projectManagement.user", "user")
    .select([
      "projectManagement.createdAt",
      "projectManagement.project.id",
      "projectManagement.role",
      "projectManagement.id",
      "user.name",
      "user.id",
      "user.email",
    ])
    .where("projectManagement.project.id = :projectId", { projectId });

  if (search)
    query.andWhere("user.email ILIKE :email", { email: `${search}%` });

  if (cursor)
    query.andWhere("projectManagement.createdAt < :cursor", {
      cursor: new Date(cursor),
    });

  const project = await query
    .orderBy("projectManagement.createdAt", "DESC")
    .limit(edge)
    .getMany();

  if (!project)
    return {
      errors: notFound("project").errors,
      hasMore: false,
    };

  return {
    response: project.slice(0, limit),
    hasMore: project.length === edge,
  };
};
