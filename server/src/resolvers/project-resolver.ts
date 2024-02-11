import { Root } from "@apollo/protobufjs";
import { NewProject } from "../models/project-model";
import ProjectService from "../services/project-service";

const ProjectResolver = {
  Mutation: {
    createProject: async (_parent: Root, project: NewProject) => {
      return await ProjectService.createProject(project);
    },
  },
};

export default ProjectResolver;
