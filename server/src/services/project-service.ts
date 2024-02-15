import ProjectController from "../controllers/project-controller";
import { db } from "../models/database";
import {
  NewProject,
  Project,
  ProjectConnection,
  ProjectPayload,
} from "../models/project-model";
import { ConnectionArgs } from "../models/types";

/**
 * Defines functions for handling request and response logic to/from the graphql resolver
 */
const ProjectService = {
  /**
   * @async
   * @function
   * Fetches projects from the database and converts into connection format
   *
   * @returns The requested projects in connection format
   */
  async getProjects({
    first,
    after,
  }: ConnectionArgs): Promise<ProjectConnection> {
    try {
      const data = await ProjectController.getProjects({ first, after });
      const edges = data.map((node) => ({
        cursor: node.id.toString(),
        node,
      }));

      return {
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  },

  async getProject(id: number) {
    try {
      return ProjectController.project(id);
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getProjectsByUserId(
    id: number,
    { first, after }: ConnectionArgs
  ): Promise<ProjectConnection> {
    try {
      let endCursor: string | undefined;

      const data = await ProjectController.getProjectsForUser(id, {
        first,
        after,
      });

      const edges = data.map((node) => ({
        cursor: node.id.toString(),
        node,
      }));

      if (edges.length > 0) {
        endCursor = edges[edges.length - 1].cursor;
      }

      return {
        edges,
        pageInfo: {
          endCursor,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  },
  async createProject(project: NewProject): Promise<ProjectPayload> {
    try {
      const newProject = await ProjectController.createProject(project);

      return {
        project: newProject,
        errors: [],
      };
    } catch (error) {
      console.error(error);
      return {
        errors: [
          {
            field: ["create", "project"],
            message: (error as any).toString(),
          },
        ],
        project: null,
      };
    }
  },
};

export default ProjectService;
