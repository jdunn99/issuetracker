import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { ProjectQuery, Role } from "../../generated/graphql";
import ProjectContext from "../../util/ProjectContext";
import { Head } from "../Head";
import { Editable } from "./settings/Edit";
import { DeleteMenu, LeaveMenu } from "./settings/Menus";

interface ProjectSettingsProps {
  data: ProjectQuery;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({ data }) => {
  const { project } = React.useContext(ProjectContext);

  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [openLeave, setOpenLeave] = React.useState<boolean>(false);

  return !!project ? (
    <Flex p={8} flexDir="column" className="right-col">
      <Head name={`${project.name} - Settings`}></Head>

      {/* Content */}
      <Box mt="4rem" mx="auto" w={{ base: "90%", md: "75%", xl: "40%" }}>
        <Box rounded="lg" mb={4} p={4} border="1px solid rgba(0,0,0,0.1)">
          <Editable
            data={data}
            canEdit={
              project.canEdit === Role.Admin || project.canEdit === Role.Owner
            }
          />
        </Box>

        <Box rounded="lg" mb={4} p={4} border="1px solid rgba(0,0,0,0.1)">
          <Flex align="center" justify="space-between">
            <Box>
              <Heading size="sm">Delete Project</Heading>
              <p style={{ fontSize: "14px" }}>
                Once you delete a project, it is gone forever.
              </p>
            </Box>
            <React.Fragment>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => setOpenDelete(true)}
                disabled={project.canEdit !== Role.Owner}>
                Delete Project
              </Button>
              <DeleteMenu
                id={parseFloat(project.id)}
                data={data}
                open={openDelete}
                setOpen={setOpenDelete}
              />
            </React.Fragment>
          </Flex>
          <Flex mt={4} align="center" justify="space-between">
            <Box>
              <Heading size="sm">Leave Project</Heading>
              <p style={{ fontSize: "14px" }}>
                Once you leave you cannot join back unless invited.
              </p>
            </Box>
            <React.Fragment>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => setOpenLeave(true)}
                disabled={project.canEdit === Role.Owner}>
                Leave Project
              </Button>
              <LeaveMenu
                id={parseFloat(project.id)}
                data={data}
                open={openLeave}
                setOpen={(q) => setOpenLeave(q)}
              />
            </React.Fragment>
          </Flex>
        </Box>
      </Box>
    </Flex>
  ) : (
    <p>Project Does Not Exist</p>
  );
};
