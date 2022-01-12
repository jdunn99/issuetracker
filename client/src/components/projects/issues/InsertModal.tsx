import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  Flex,
  Button,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import {
  ProjectIssuesDocument,
  ProjectIssuesQuery,
  Severity,
  Status,
  useCreateIssueMutation,
  useProjectIssuesLazyQuery,
} from "../../../generated/graphql";
import ProjectContext from "../../../util/ProjectContext";
import { DropdownField } from "../../DropdownField";
import { InputField } from "../../InputField";

interface InsertModalProps {
  setClose: () => void;
  open: boolean;
}

export const convertSeverity = (severity: string) => {
  switch (severity) {
    case "HIGH":
      return 2;
    case "MEDIUM":
      return 1;
    case "LOW":
      return 0;
    default:
      return -1;
  }
};

export const InsertModal: React.FC<InsertModalProps> = ({ setClose, open }) => {
  const [createIssue] = useCreateIssueMutation();
  const toast = useToast();

  const [fetch, { data }] = useProjectIssuesLazyQuery();
  const { project } = React.useContext(ProjectContext);

  React.useEffect(() => {
    // Will always be from Cache
    if (project && !data) {
      fetch({ variables: { id: parseFloat(project.id) } });
    }
  }, [project, fetch, data]);

  return project && data ? (
    <Box fontFamily="Poppins">
      <Modal onClose={setClose} isOpen={open} isCentered>
        <ModalOverlay />
        <ModalContent fontFamily="Poppins" maxW="40rem">
          <Box m="auto" w="100%" maxW="25rem" p={4}>
            <Heading fontFamily="Poppins" size="md">
              Add new issue
            </Heading>
            <Formik
              initialValues={{
                name: "",
                desc: "",
                severity: Severity.Low,
              }}
              onSubmit={async (values, { setErrors }) => {
                await createIssue({
                  variables: {
                    name: values.name,
                    desc: values.desc,
                    severity: convertSeverity(values.severity),
                    projectId: parseFloat(project.id),
                  },
                  update: (cache, { data: mutationData }) => {
                    if (!data) {
                      toast({
                        title: "Error",
                        status: "error",
                        isClosable: true,
                        description: "Something went wrong!",
                      });
                      return;
                    }

                    if (!mutationData || !mutationData.createIssue) {
                      toast({
                        title: "Error",
                        status: "error",
                        isClosable: true,
                        description: "Something went wrong!",
                      });
                      return;
                    }

                    if (mutationData.createIssue.errors) {
                      mutationData.createIssue.errors.forEach((error) => {
                        toast({
                          title: "Error",
                          status: "error",
                          isClosable: true,
                          description: error.message,
                        });
                      });
                      return;
                    }

                    if (!mutationData.createIssue.response) {
                      toast({
                        title: "Error",
                        status: "error",
                        isClosable: true,
                        description: "Something went wrong!",
                      });
                      return;
                    }

                    const inserted = {
                      _typename: "UserIssueResponse",
                      name: values.name,
                      severity: values.severity,
                      status: Status.Todo,
                      projectId: parseFloat(project.id),
                      projectName: project.name,
                      createdAt: new Date().toDateString(),
                      id: mutationData.createIssue.response.id,
                      desc: values.desc,
                    };

                    cache.writeQuery<ProjectIssuesQuery>({
                      query: ProjectIssuesDocument,
                      data: {
                        __typename: "Query",
                        getIssuesFromProject: {
                          response: [
                            ...data!.getIssuesFromProject.response!,
                            inserted,
                          ],
                        },
                      },
                      variables: {
                        id: parseFloat(project.id),
                      },
                    });
                  },
                });

                setClose();
              }}>
              {({ isSubmitting }) => (
                <Form>
                  <Box mt={4}>
                    <InputField
                      name="name"
                      placeholder="Name"
                      label="Name"
                      type="text"
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      name="desc"
                      placeholder="Description"
                      label="Description"
                      type="desc"
                    />
                  </Box>
                  <Box mt={4}>
                    <DropdownField name="severity" label="Severity">
                      <option value={Severity.Low}>Low</option>
                      <option value={Severity.Medium}>Medium</option>
                      <option value={Severity.High}>High</option>
                    </DropdownField>
                  </Box>

                  <Flex
                    align="center"
                    justify="flex-end"
                    textAlign="center"
                    mt={8}>
                    <Button
                      background="#7209B7"
                      type="submit"
                      isLoading={isSubmitting}
                      borderRadius={10}
                      _hover={{
                        background: "#480972",
                      }}
                      color="#F8F9FA">
                      Create
                    </Button>
                    <Button
                      background="transparent"
                      onClick={setClose}
                      borderRadius={10}>
                      Cancel
                    </Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Box>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Box>
  ) : null;
};
