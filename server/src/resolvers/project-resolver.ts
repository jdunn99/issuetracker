import { Root } from "@apollo/protobufjs";
import { NewProject } from "../models/project-model";
import ProjectService from "../services/project-service";

/**
 * Defines resolver functions for GraphQL Project schema
 */
const ProjectResolver = {
  /**
   * Query functions
   */
  Query: {
    /**
     * @function
     * Retrieves
     */
  },
  Mutation: {
    createProject: async (_parent: Root, project: NewProject) => {
      return await ProjectService.createProject(project);
    },
  },
};

export default ProjectResolver;
