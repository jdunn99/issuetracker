import React from "react";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { Sidebar } from "../components/Sidebar";
import {
  ProjectQuery,
  useProjectLazyQuery,
  useUserQuery,
} from "../generated/graphql";
import SidebarContext from "../util/SidebarContext";
import { ProjectIssues } from "../components/projects/ProjectIssues";
import ProjectContext from "../util/ProjectContext";
import { useParams } from "react-router";
import { ProjectSettings } from "../components/projects/ProjectSettings";
import { ProjectUsers } from "../components/projects/ProjectUsers";
import { useHistory } from "react-router-dom";

export const Project: React.FC = () => {
  const { changeActive, active } = React.useContext(SidebarContext);
  const { project, setProject } = React.useContext(ProjectContext);
  const { data, loading } = useUserQuery();
  const [rendered, setRendered] = React.useState<JSX.Element>();

  const history = useHistory();
  const toast = useToast();
  const params: { id: string } = useParams();

  // If we don't have a project already set. Do so.
  const init = (projectData: ProjectQuery) => {
    if (!project && projectData && projectData.project.response) {
      setProject({
        canEdit: projectData.project.response.canEdit,
        id: params.id,
        name: projectData.project.response.project.name,
      });
    }
  };

  const [fetch, { data: projectData }] = useProjectLazyQuery({
    onCompleted: init,
  });

  // Check if user is signed in.
  React.useEffect(() => {
    if (!loading && data && !data.user) {
      toast({
        title: "Error",
        status: "error",
        isClosable: true,
        description: "Not signed in",
      });
      history.push("/signin");
    }
  }, [data, history, loading, toast]);

  React.useEffect(() => {
    fetch({ variables: { id: parseFloat(params.id) } });
  }, [params, fetch]);

  // Render active component
  React.useEffect(() => {
    if (data)
      switch (active) {
        case "Issues":
          setRendered(<ProjectIssues />);
          return;
        case "Users":
          setRendered(<ProjectUsers />);
          return;
        case "Settings":
          if (projectData) setRendered(<ProjectSettings data={projectData} />);
          return;
        default:
          changeActive("Issues");
          return;
      }
  }, [data, active, projectData, changeActive]);

  return data && data.user ? (
    <Box maxH="100vh" overflowY="hidden">
      <Flex>
        <Sidebar name={data.user.name} email={data.user.email} />
        {rendered}
      </Flex>
    </Box>
  ) : null;
};
