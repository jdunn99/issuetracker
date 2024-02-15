import { db, getPaginatedResult } from "../models/database";
import { NewProject, Project, UpdatedProject } from "../models/project-model";
import { Role } from "../models/project-user-model";
import { ConnectionArgs } from "../models/types";

/**
 * Defines the functions for retrieving project related entities from the database
 */
const ProjectController = {
  /**
   * @function
   * Return a project by ID from the database
   *
   * @param id The requested project ID
   * @return The project given their ID
   */
  project(id: number) {
    return db
      .selectFrom("project")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  },

  projectByURL(url: string) {
    return db
      .selectFrom("project")
      .where("url", "=", url)
      .selectAll()
      .executeTakeFirstOrThrow();
  },

  getProjects({ first, after }: ConnectionArgs): Promise<Project[]> {
    const query = getPaginatedResult("project", { first, after });
    return query.execute();
  },

  getProjectsForUser(
    id: number,
    { first, after }: ConnectionArgs
  ): Promise<Project[]> {
    return db
      .selectFrom("project")
      .selectAll()
      .fullJoin("projectuser", "projectuser.project_id", "project.id")
      .where("projectuser.user_id", "=", id)
      .$if(typeof first !== "undefined", (qb) => qb.limit(first))
      .$if(typeof after !== "undefined", (qb) =>
        qb.where("project.id", ">", parseInt(after))
      )
      .execute();
  },

  /**
   * @todo Add the creator id in the context variable
   * @async
   * @function
   *
   * Creates a project in the database and
   * @param project
   * @returns
   */
  async createProject(project: NewProject): Promise<Project> {
    // Need to add context instead of passing the creator_id!!!
    const newProject = await db
      .insertInto("project")
      .values(project)
      .returningAll()
      .executeTakeFirstOrThrow();

    const project_user = await db
      .insertInto("projectuser")
      .values({
        project_id: newProject.id,
        user_id: newProject.creator_id,
        role: Role.CREATOR,
      })
      .executeTakeFirst();
    console.log(project_user);

    return newProject;
  },

  updateProject(project: UpdatedProject): Promise<Project> {
    return db
      .updateTable("project")
      .set(project)
      .where("id", "=", project.id!)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
};

export default ProjectController;
