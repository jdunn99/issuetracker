import { Role } from "../types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  Int,
  PubSubEngine,
  PubSub,
  Subscription,
  Root,
} from "type-graphql";
import { getConnection, getRepository } from "typeorm";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Error } from "../entities/Error";
import { Context } from "../types";
import { ProjectManagement } from "../entities/ProjectManagement";
import {
  DeletionResponse,
  ProjectManagementResponse,
  ProjectResponse,
  ProjectUserResponse,
} from "./graphql-response/Response";
import {
  notAuthorized,
  notFound,
  notLoggedIn,
} from "./graphql-response/ErrorFunctions";
import { ProjectPayload } from "./graphql-response/Objects";
import { projectQuery, projectUsersQuery } from "./project/queries";
import {
  addUsersMutation,
  createProjectMutation,
  updateProjectMutation,
} from "./project/mutations";

type Proj = {
  id: number;
  role: any;
  user: number;
};

/** Resolver for Project Entity */
@Resolver(() => Project)
export class ProjectResolver {
  /** Queries */

  @Query(() => ProjectResponse)
  async project(
    @Arg("id") id: number,
    @Ctx() { req }: Context
  ): Promise<ProjectResponse> {
    return projectQuery(id, req.session.userId);
  }

  @Query(() => ProjectUserResponse)
  async getUsersForProject(
    @Arg("id") id: number,
    @Arg("limit", () => Int) limit: number,
    @Ctx() { req }: Context,
    @Arg("cursor", { nullable: true }) cursor?: string,
    @Arg("search", { nullable: true }) search?: string
  ): Promise<ProjectUserResponse> {
    return projectUsersQuery(id, limit, req.session.userId, cursor, search);
  }

  /** Mutations */

  @Mutation(() => ProjectResponse)
  async createProject(
    @Arg("name") name: string,
    @Arg("desc") desc: string,
    @Ctx() { req }: Context
  ): Promise<ProjectResponse> {
    return createProjectMutation(name, desc, req.session.userId);
  }

  @Mutation(() => ProjectResponse)
  async updateProject(
    @Ctx() { req }: Context,
    @Arg("id") id: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("desc", { nullable: true }) desc?: string
  ): Promise<ProjectResponse> {
    return updateProjectMutation(id, req.session.userId, name, desc);
  }

  // private async addUserToProject(
  //   id: number,
  //   userId: number,
  //   pubsub: PubSubEngine,
  //   name: string
  // ): Promise<ProjectManagementResponse> {
  //   const addedUser = await getRepository(User).findOne({
  //     where: { id: userId },
  //     join: {
  //       alias: "user",
  //       leftJoinAndSelect: {
  //         issues: "user.issues",
  //         feed: "user.feed",
  //       },
  //     },
  //   });
  //   if (!addedUser) return notFound("user");

  //   const project = await getRepository(Project).findOne({
  //     where: { id: id },
  //     relations: ["projectManagement"],
  //     join: {
  //       alias: "project",
  //       leftJoinAndSelect: {
  //         projectManagement: "project.projectManagement",
  //         user: "projectManagement.user",
  //       },
  //     },
  //   });

  //   if (!project) return notFound("project");

  //   for (const temp of project.projectManagement) {
  //     if (temp.user.id === userId)
  //       return {
  //         errors: [
  //           {
  //             field: "user",
  //             message: `${addedUser.email} is already a member of ${project.name}`,
  //           },
  //         ],
  //       };
  //   }

  //   const manager = new ProjectManagement();
  //   manager.user = addedUser;
  //   manager.role = Role.VIEWER;
  //   manager.project = project;

  //   const connection = getConnection();

  //   await connection.manager.save(manager);

  //   const feedItem = new Feed();
  //   feedItem.title = `${name} added you to a project.`;
  //   feedItem.subheading = project.name;
  //   feedItem.type = FeedType.Invite;
  //   feedItem.user = addedUser;

  //   await connection.manager.save(feedItem);

  //   await pubsub.publish("FEED", feedItem);

  //   return {
  //     response: manager,
  //   };
  // }

  @Mutation(() => ProjectUserResponse)
  async addUsers(
    @Arg("id") id: number,
    @Arg("users", () => [Int]) users: [number],
    @PubSub() pubsub: PubSubEngine,
    @Ctx() { req }: Context
  ): Promise<ProjectUserResponse> {
    return addUsersMutation(id, req.session.userId, users, pubsub);
  }

  @Mutation(() => DeletionResponse)
  async removeUsersFromProject(
    @Arg("projectId") projectId: number,
    @Arg("userIds", () => [Int]) userIds: number[],
    @Ctx() { req }: Context
  ): Promise<DeletionResponse> {
    const response = await getRepository(User)
      .query(`SELECT "projectManagement"."role" AS "projectManagement_role", "projManagement"."id" AS
        "projManagement_id", "projManagement"."role" AS
         "projManagement_role" FROM "user" "user" LEFT JOIN "project_management" "projectManagement" ON 
         "projectManagement"."userId"="user"."id"  LEFT JOIN "project" "project" ON "project"."id"="projectManagement"."projectId"
           LEFT JOIN "project_management" "projManagement" ON "projManagement"."projectId"="project"."id" WHERE "user"."id" = ${
             req.session.userId
           } AND 
           "project"."id" = ${projectId} AND "projManagement"."userId" IN (${userIds.toString()})`);

    if (!response || response.length === 0)
      return {
        errors: [
          {
            field: "project",
            message: "Something went wrong! Please try again.",
          },
        ],
      };

    const user = parseFloat(response[0].projectManagement_role);
    if (user !== Role.ADMIN && user !== Role.OWNER) return notAuthorized();

    const errors: Error[] = [];
    const deleted: number[] = [];

    const connection = getConnection();
    for (const temp of response) {
      const role = parseFloat(temp.projManagement_role);
      if (role !== Role.OWNER)
        if (user === Role.ADMIN && role === Role.ADMIN)
          errors.push({
            field: "user",
            message: "You are not authorized to delete another Admin",
          });
        else {
          await connection.manager.delete(ProjectManagement, {
            id: temp.projManagement_id,
          });
          deleted.push(temp.projManagement_id);
        }
      else
        errors.push({
          field: "user",
          message: "Cannot delete the Owner of a project.",
        });
    }

    return { response: deleted, errors: errors };
  }

  @Mutation(() => ProjectManagementResponse)
  async changeRole(
    @Arg("id") id: number,
    @Arg("role") role: Role
  ): Promise<ProjectManagementResponse> {
    const user = await getRepository(ProjectManagement).findOne({
      id,
    });
    if (!user) return notFound("user");

    user.role = role;
    await getRepository(ProjectManagement).save(user);
    return {
      response: user,
    };
  }

  @Mutation(() => DeletionResponse)
  async leaveProject(
    @Arg("id") id: number,
    @Ctx() { req }: Context,
    @PubSub() pubsub: PubSubEngine
  ): Promise<DeletionResponse> {
    if (!req.session.userId) return notLoggedIn();

    const project = await getRepository(Project).query(`
    SELECT "projectManagement"."id", "projectManagement"."role", "projectManagement"."userId"
     AS user FROM "project" "project" LEFT JOIN "project_management" "projectManagement" 
     ON "projectManagement"."projectId"="project"."id" WHERE "project"."id" = ${id};
    `);

    if (!project) return notFound("project");

    const deleted: Proj = project.filter((proj: Proj) => {
      return proj.user === req.session.userId;
    })[0];

    // Make sure only the owner can't leave
    if (parseFloat(deleted.role) === Role.OWNER)
      return {
        errors: [
          {
            field: "user",
            message: "As the Owner, you cannot leave this project!",
          },
        ],
      };

    await pubsub.publish("LEAVE_PROJECT", {
      subscribers: project.map((proj: Proj) => proj.user),
      deleted: [deleted.id],
    });

    const connection = getConnection();
    await connection.manager.delete(ProjectManagement, {
      id: deleted.id,
    });

    return { response: [deleted.id] };
  }

  @Mutation(() => DeletionResponse)
  async deleteProjectById(
    @Arg("id") id: number,
    @Ctx() { req }: Context
  ): Promise<DeletionResponse> {
    // returns a length 1 array of { projectManagement_role: Role }
    if (!req.session.userId) return notLoggedIn();

    const user = await getRepository(User).query(
      `SELECT "projectManagement"."role" AS "projectManagement_role" FROM "user"
      "user" LEFT JOIN "project_management" "projectManagement" ON "projectManagement"."userId"="user"."id"
      WHERE "user"."id" = ${req.session.userId} AND "projectManagement"."projectId" = ${id}`
    );

    // Make sure the user is actually in the project
    if (!user || user.length !== 1)
      return {
        errors: [
          {
            field: "user",
            message: "Something went wrong! Please try again.",
          },
        ],
      };

    // Make sure only the owner can delete a project
    if (parseFloat(user[0].projectManagement_role) !== Role.OWNER)
      return notAuthorized();

    const connection = getConnection();
    const project = await getRepository(Project).findOne({ id });

    // Make sure the project exists
    if (!project) return notFound("project");

    await connection.manager.delete(Project, project);

    return { response: [id] };
  }

  @Mutation(() => Boolean)
  async deleteProjects(): Promise<Boolean> {
    await getRepository(Project).delete({});

    return true;
  }

  @Subscription(() => [Int], {
    topics: "LEAVE_PROJECT",
    filter: ({ payload, args }) => {
      return payload.subscribers.some((id: number) => {
        return id === parseInt(args.id);
      });
    },
  })
  sendLeaveProject(
    @Root() payload: ProjectPayload,
    @Arg("id") _id: number
  ): number[] {
    return payload.deleted;
  }

  @Subscription(() => [Int], {
    topics: "DELETE_PROJECT",
    filter: ({ payload, args }) => !payload.includes(args.id),
  })
  deleteProject(@Root() payload: number[], @Arg("id") _id: number): number[] {
    return payload;
  }
}
