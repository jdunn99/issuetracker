import { db } from "../models/database";
import { NewProject } from "../models/project-model";

const ProjectService = {
  createProject: async (project: NewProject) => {
    console.log(project);
    return await db
      .insertInto("project")
      .values(project)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
};

export default ProjectService;
