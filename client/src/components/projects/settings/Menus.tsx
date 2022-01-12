import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import {
  useUserProjectsQuery,
  useDeleteProjectMutation,
  useUserQuery,
  ProjectQuery,
  useLeaveProjectMutation,
} from "../../../generated/graphql";
import ProjectContext from "../../../util/ProjectContext";

interface AlertProps {
  id: number;
  data: ProjectQuery;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteMenu: React.FC<AlertProps> = ({
  id,
  data,
  open,
  setOpen,
}) => {
  const history = useHistory();
  const { data: dataUser } = useUserQuery();

  const onClose = () => setOpen(false);
  const cancelRef = React.useRef<any>();
  const [deleteProject] = useDeleteProjectMutation();
  const toast = useToast();
  const { data: projectsData } = useUserProjectsQuery({
    fetchPolicy: "cache-only",
  });
  const { setProject } = React.useContext(ProjectContext);

  return (
    <React.Fragment>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>
            <AlertDialogBody>This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                onClick={async () => {
                  await deleteProject({
                    variables: { id },
                    update: (cache, { data: deletedData }) => {
                      if (!dataUser || !dataUser.user) {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: "Something went wrong!",
                        });
                        return;
                      }

                      if (!deletedData) {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: "Something went wrong!",
                        });
                        return;
                      }

                      if (deletedData.deleteProjectById.errors) {
                        deletedData.deleteProjectById.errors.forEach(
                          (error) => {
                            toast({
                              title: "Error",
                              status: "error",
                              isClosable: true,
                              description: error.message,
                            });
                          }
                        );
                        return;
                      }

                      if (!deletedData.deleteProjectById.response) {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: "Something went wrong!",
                        });
                        return;
                      }

                      if (
                        projectsData &&
                        projectsData.getUserProjects.response
                      ) {
                        const projectRef = cache.identify({
                          id,
                          __typename: "Project",
                        });
                        cache.evict({ id: projectRef });
                      }
                      toast({
                        title: "Success",
                        status: "success",
                        isClosable: true,
                        description: `You deleted project - ${
                          data.project.response!.project.name
                        }`,
                      });
                      setProject(undefined);
                      history.push("/profile");
                    },
                  });
                }}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </React.Fragment>
  );
};

export const LeaveMenu: React.FC<AlertProps> = ({
  id,
  data,
  open,
  setOpen,
}) => {
  const history = useHistory();
  const { data: dataUser } = useUserQuery();

  const onClose = () => setOpen(false);
  const cancelRef = React.useRef<any>();
  const [leaveProject] = useLeaveProjectMutation();
  const toast = useToast();
  const { data: projectsData } = useUserProjectsQuery({
    fetchPolicy: "cache-only",
  });
  const { setProject } = React.useContext(ProjectContext);

  return (
    <React.Fragment>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave Project
            </AlertDialogHeader>
            <AlertDialogBody>This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                onClick={async () => {
                  await leaveProject({
                    variables: { id },
                    update: (cache, { data: deletedData }) => {
                      if (!dataUser || !dataUser.user) {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: "Something went wrong!",
                        });
                        return;
                      }

                      if (!deletedData) {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: "Something went wrong!",
                        });
                        return;
                      }

                      if (deletedData.leaveProject.errors) {
                        deletedData.leaveProject.errors.forEach((error) => {
                          toast({
                            title: "Error",
                            status: "error",
                            isClosable: true,
                            description: error.message,
                          });
                        });
                        return;
                      }

                      if (!deletedData.leaveProject.response) {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: "Something went wrong!",
                        });
                        return;
                      }
                      if (
                        projectsData &&
                        projectsData.getUserProjects.response
                      ) {
                        const projectRef = cache.identify({
                          id: deletedData.leaveProject.response[0],
                          __typename: "ProjectManagement",
                        });
                        cache.evict({ id: projectRef });
                        cache.evict({
                          id: cache.identify({ id, __typename: "UserProject" }),
                        });
                      }
                      toast({
                        title: "Success",
                        status: "success",
                        isClosable: true,
                        description: `You left project - ${
                          data.project.response!.project.name
                        }`,
                      });
                      setProject(undefined);
                      history.push("/profile");
                    },
                  });
                }}>
                Leave
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </React.Fragment>
  );
};
