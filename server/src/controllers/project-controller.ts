import { db, getPaginatedResult } from "../models/database";
import { Project } from "../models/project-model";
import { ConnectionArgs } from "../models/types";

/**
 * Defines the functions for retrieving project related entities from the database
 */
const ProjectController = {
  getProjects({ first, after }: ConnectionArgs): Promise<Project[]> {
    const query = getPaginatedResult("project", { first, after });
    return query.execute();
  },

  getProjectsForUser(
    id: number,
    { first, after }: ConnectionArgs
  ): Promise<Project[]> {
    const query = getPaginatedResult("project", { first, after });
    return query.where("creator_id", "=", id).execute();
  },
};

export default ProjectController;
