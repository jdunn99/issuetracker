import React from "react";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { Sidebar } from "../components/Sidebar";
import { useUserQuery } from "../generated/graphql";
import { ProjectsPage } from "../components/profile/ProjectsPage";
import SidebarContext from "../util/SidebarContext";
import { HomePage } from "../components/profile/HomePage";
import { useHistory } from "react-router-dom";

/**
 * Profile component rendered by the Router
 */
export const Profile: React.FC = () => {
  /************** SETUP *************/
  const [rendered, setRendered] = React.useState<JSX.Element>();

  const { data, loading } = useUserQuery();

  const { active, changeActive } = React.useContext(SidebarContext);

  const toast = useToast();
  const history = useHistory();

  /************** HOOKS *************/
  /**
   * Make sure the User is signed in before accessing this page.
   */
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

  /**
   * Handle any input from the Sidebar context and render the component
   */
  React.useEffect(() => {
    if (data)
      switch (active) {
        case "Home":
          setRendered(<HomePage />);
          return;
        case "Projects":
          setRendered(<ProjectsPage />);
          return;
        default:
          changeActive("Home");
          return;
      }
  }, [data, active, changeActive]);

  /************** RENDER *************/
  return data && data.user ? (
    <Box maxH="100vh" overflowY="hidden">
      <Flex>
        <Sidebar name={data.user.name} email={data.user.email} />
        {rendered}
      </Flex>
    </Box>
  ) : null;
};
