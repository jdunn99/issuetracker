import { Root } from "@apollo/protobufjs";
import { NewProject, Project } from "../models/project-model";
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
    project(_parent: Root, project: Project) {
      return ProjectService.getProject(project.id);
    },
  },
  Mutation: {
    createProject(_parent: Root, project: NewProject) {
      return ProjectService.createProject(project);
    },
  },
};

export default ProjectResolver;
