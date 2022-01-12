import { Project } from "../../entities/Project";
import { Error } from "../../entities/Error";
import { ProjectManagement } from "../../entities/ProjectManagement";
import { Role } from "../../types";
import { getConnection, getRepository } from "typeorm";
import {
  notAuthorized,
  notFound,
  notLoggedIn,
} from "../graphql-response/ErrorFunctions";
import { User } from "../../entities/User";
import {
  ProjectResponse,
  ProjectUserResponse,
} from "../graphql-response/Response";
import { PubSubEngine } from "apollo-server-express";

export const createProjectMutation = async (
  name: string,
  desc: string,
  userId: number | null
): Promise<ProjectResponse> => {
  if (!userId) return notLoggedIn();
  const user = await getRepository(User).findOne({ id: userId });

  if (!user) return notFound("user");

  const connection = getConnection();

  const newProject = new Project();
  newProject.name = name;
  newProject.desc = desc;
  newProject.issues = [];
  newProject.owner = user;

  await connection.manager.save(newProject);

  const manager = new ProjectManagement();
  manager.role = Role.OWNER;
  manager.user = user;
  manager.project = newProject;

  await connection.manager.save(manager);
  return {
    response: {
      canEdit: Role.OWNER,
      project: newProject,
    },
  };
};

export const updateProjectMutation = async (
  projectId: number,
  userId: number | null,
  name?: string,
  desc?: string
): Promise<ProjectResponse> => {
  const project = await getRepository(Project)
    .createQueryBuilder("project")
    .leftJoinAndSelect("project.projectManagement", "projectManagement")
    .leftJoin("projectManagement.user", "user")
    .where("project.id = :projectId", { projectId })
    .andWhere("projectManagement.user.id = :userId", {
      userId,
    })
    .getOne();

  if (!project) return notFound("project");

  const user = project.projectManagement[0];
  if (!user) return notLoggedIn();

  if (user.role !== Role.ADMIN && user.role !== Role.OWNER)
    return notAuthorized();

  const connection = getConnection();
  if (name) project.name = name;
  if (desc) project.desc = desc;

  await connection.manager.save(Project, project);
  return {
    response: {
      canEdit: user.role,
      project,
    },
  };
};

// const addUserToProject = async (
//   id: number,
//   userId: number,
//   pubsub: PubSubEngine,
//   name: string
// ): Promise<ProjectManagementResponse> => {

// };

export const addUsersMutation = async (
  _projectId: number,
  userId: number | null,
  insertedIds: number[],
  _pubsub: PubSubEngine
): Promise<ProjectUserResponse> => {
  if (!userId) return { errors: notLoggedIn().errors, hasMore: false };
  const result: ProjectManagement[] = [];

  // TODO: Change query for authorization
  const user = await getRepository(User).findOne({
    id: userId,
  });
  if (!user) return { errors: notLoggedIn().errors, hasMore: false };

  const addedErrors: Error[] = [];
  for (const id of insertedIds) {
    if (user.id !== id) {
      // const userResponse = await addUserToProject(
      //   projectId,
      //   id,
      //   pubsub,
      //   user.name
      // );
      // if (userResponse.errors) addedErrors.push(...userResponse.errors);
      // if (userResponse.response) result.push(userResponse.response);
    } else {
      addedErrors.push({
        field: "user",
        message: `You are already a member of this project!`,
      });
    }
  }

  return {
    response: result,
    errors: addedErrors.length === 0 ? undefined : addedErrors,
    hasMore: false,
  };
};
