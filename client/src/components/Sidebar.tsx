import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  Link,
} from "@chakra-ui/react";
import { AiOutlineHome, AiOutlineProject } from "react-icons/ai";
import { VscIssues, VscGear, VscAccount } from "react-icons/vsc";
import SidebarContext from "../util/SidebarContext";
import ProjectContext from "../util/ProjectContext";
import { useHistory } from "react-router-dom";

interface SidebarProps {
  name: string;
  email: string;
}

interface SidebarButtonProps {
  name: string;
  icon?: any;
  closed?: boolean;
  active: string;
  setActive: (arg0: string) => void;
}

interface OpenCloseProps {
  active: string;
  setActive: (arg0: string) => void;
  name: string;
  email: string;
  toggleSidebar: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  active,
  setActive,
  icon,
  closed,
  name,
}) => {
  const history = useHistory();
  const { project } = React.useContext(ProjectContext);

  return closed ? (
    <Flex
      title={name}
      alignSelf="center"
      _hover={{ background: "#e6e6ea" }}
      cursor="pointer"
      rounded="xl"
      color={active === name ? "#7209b7" : "#25252d"}
      p={2}
      textAlign="center"
      onClick={() => {
        if (
          (name === "Home" || name === "Projects") &&
          history.location.pathname !== "/profile"
        )
          history.push("/profile");
        else if (
          project &&
          (name === "Settings" || name === "Issues" || name === "Users") &&
          history.location.pathname !== `project/${project.id}`
        )
          history.push(`/project/${project.id}`);
        setActive(name);
      }}
      background={active === name ? "#eed8fd" : "transparent"}>
      {icon}
    </Flex>
  ) : (
    <Box
      _hover={{ background: "#e6e6ea" }}
      cursor="pointer"
      padding={2}
      paddingLeft={4}
      rounded="2xl"
      color={active === name ? "#7209b7" : "#25252d"}
      onClick={() => {
        if (
          (name === "Home" || name === "Projects") &&
          history.location.pathname !== "/profile"
        )
          history.push("/profile");
        else if (
          project &&
          (name === "Users" || name === "Settings" || name === "Issues") &&
          history.location.pathname !== `project/${project.id}`
        )
          history.push(`/project/${project.id}`);
        setActive(name);
      }}
      background={active === name ? "#eed8fd" : "transparent"}
      fontWeight={active === name ? "bold" : "regular"}
      fontSize="sm">
      <Flex align="center" gridGap={2}>
        {icon}
        <Text>{name}</Text>
      </Flex>
    </Box>
  );
};

const SidebarClosed: React.FC<OpenCloseProps> = ({
  active,
  setActive,
  toggleSidebar,
}) => {
  const projContext = React.useContext(ProjectContext);

  return (
    <Box w="55px" fontFamily="Poppins" background="#f1f1f4">
      <Flex
        flexDir="column"
        p={2}
        className="center-col"
        justify="space-between">
        <Flex justify="center" flexDir="column" align="flex-start">
          <Flex
            flexDir="column"
            pb="2rem"
            gridGap={2}
            mb="2rem"
            borderBottom={
              projContext.project ? "1px solid rgba(0,0,0,0.1)" : "none"
            }
            w="100%">
            <Button mt="2rem" mb="1rem" onClick={() => toggleSidebar()}>
              ☰
            </Button>
            <SidebarButton
              active={active}
              closed
              setActive={(q) => setActive(q)}
              icon={<AiOutlineHome />}
              name="Home"
            />
            <SidebarButton
              active={active}
              closed
              setActive={(q) => setActive(q)}
              icon={<AiOutlineProject />}
              name="Projects"
            />
          </Flex>

          {projContext.project && (
            <Stack spacing={2} w="100%">
              <SidebarButton
                active={active}
                closed
                setActive={(q) => setActive(q)}
                icon={<VscIssues />}
                name="Issues"
              />
              <SidebarButton
                active={active}
                closed
                setActive={(q) => setActive(q)}
                icon={<VscAccount />}
                name="Users"
              />
              <SidebarButton
                active={active}
                closed
                setActive={(q) => setActive(q)}
                icon={<VscGear />}
                name="Settings"
              />
            </Stack>
          )}
        </Flex>
        <Flex alignSelf="center">
          <Avatar size="xs" />
        </Flex>
      </Flex>
    </Box>
  );
};

const SidebarOpen: React.FC<OpenCloseProps> = ({
  active,
  setActive,
  name,
  email,
  toggleSidebar,
}) => {
  const projContext = React.useContext(ProjectContext);

  return (
    <Box w="20%" fontFamily="Poppins" background="#f1f1f4">
      <Flex
        flexDir="column"
        p={4}
        ml={2}
        borderRight="1px solid rgba(0,0,0,0.1)"
        className="center-col"
        justify="space-between">
        <Flex flexDir="column" align="flex-start">
          <Flex px={4} mb="1rem" mt="2rem" align="center" gap={8}>
            <Heading cursor="pointer" size="md">
              <Link _hover={{ border: "none" }} href="/">
                Issue Tracker
              </Link>
            </Heading>
            <Button
              background="transparent"
              onClick={() => toggleSidebar()}
              ml={["0", "0", "2rem", "2rem", "4rem"]}>
              ☰
            </Button>
          </Flex>
          <Stack
            pb="2rem"
            spacing={2}
            borderBottom={
              projContext.project ? "1px solid rgba(0,0,0,0.1)" : "none"
            }
            w="100%">
            <SidebarButton
              active={active}
              setActive={(q) => setActive(q)}
              icon={<AiOutlineHome />}
              name="Home"
            />
            <SidebarButton
              active={active}
              setActive={(q) => setActive(q)}
              icon={<AiOutlineProject />}
              name="Projects"
            />
          </Stack>
          {projContext.project && (
            <React.Fragment>
              <Heading px={4} size="sm" mt="2rem" mb="1rem">
                {projContext.project.name}
              </Heading>
              <Stack px={4} spacing={2} w="100%">
                <SidebarButton
                  active={active}
                  setActive={(q) => setActive(q)}
                  icon={<VscIssues />}
                  name="Issues"
                />
                <SidebarButton
                  active={active}
                  setActive={(q) => setActive(q)}
                  icon={<VscAccount />}
                  name="Users"
                />
                <SidebarButton
                  active={active}
                  setActive={(q) => setActive(q)}
                  icon={<VscGear />}
                  name="Settings"
                />
              </Stack>
            </React.Fragment>
          )}
        </Flex>
        <Flex mr={2} alignSelf="center">
          <Avatar />
          <Flex flexDir="column" mx={2}>
            <Text>{name}</Text>
            <Text fontSize="sm">{email}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ name, email }) => {
  const context = React.useContext(SidebarContext);
  return (
    <React.Fragment>
      {context.closed ? (
        <SidebarClosed
          active={context.active}
          setActive={(q) => context.changeActive(q)}
          toggleSidebar={context.toggleSidebar}
          name={name}
          email={email}
        />
      ) : (
        <SidebarOpen
          active={context.active}
          toggleSidebar={context.toggleSidebar}
          setActive={(q: string) => context.changeActive(q)}
          name={name}
          email={email}
        />
      )}
    </React.Fragment>
  );
};
