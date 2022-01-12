import React from "react";
import { Role } from "../generated/graphql";

export type Project = {
  name: string;
  id: string;
  canEdit: Role;
};

export type ProjectType = Project | undefined;

type ContextType = {
  project: ProjectType;
  setProject: (project: Project | undefined) => void;
};

const ProjectContext = React.createContext<ContextType>({
  project: undefined,
  setProject: () => {},
});

export const ProjectProvider = ProjectContext.Provider;

export default ProjectContext;
