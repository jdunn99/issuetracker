import { Flex, Heading, Box, Button, Text } from "@chakra-ui/react";
import { Formik, Form, FormikErrors } from "formik";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
  useCreateProjectMutation,
  ProjectQuery,
  ProjectDocument,
  useUserProjectsQuery,
  UserProjectsQuery,
  UserProjectsDocument,
  Role,
} from "../generated/graphql";
import { InputField } from "../components/InputField";
import ProjectContext from "../util/ProjectContext";
import SidebarContext from "../util/SidebarContext";
import { MapError } from "../util/MapError";

/************* COMPONENTS ***************/
/**
 * Form to handle request t ocreate a Project.
 */
export const CreateForm: React.FC = () => {
  /************* SETUP ***************/
  const { data } = useUserProjectsQuery();
  const [createProject] = useCreateProjectMutation();

  const { setProject } = React.useContext(ProjectContext);
  const { changeActive } = React.useContext(SidebarContext);

  const history = useHistory(); // after we create, we are going to re-route to the render page

  /************* HANDLERS ***************/
  /**
   * Submit the request to the Sever to create a Project.
   * @param values the requested values of the Project
   * @param setErrors any errors handled by Formik
   */
  const onSubmit = async (
    values: { name: string; desc: string },
    setErrors: (
      errors: FormikErrors<{
        name: string;
        desc: string;
      }>
    ) => void
  ) => {
    if (values.name === "") return;
    const result = await createProject({
      variables: { name: values.name, desc: values.desc },
      update: (cache, { data: projectData }) => {
        const newProject = projectData!.createProject!;

        // Do nothing, so Formik can handle the errors
        if (!newProject || newProject.errors || !newProject.response) return;

        // Write to active Project cache
        cache.writeQuery<ProjectQuery>({
          query: ProjectDocument,
          data: {
            __typename: "Query",
            project: {
              response: {
                canEdit: Role.Owner,
                project: newProject.response.project,
              },
            },
          },
        });

        // Write to Table cache
        if (data && data.getUserProjects.response)
          cache.writeQuery<UserProjectsQuery>({
            query: UserProjectsDocument,
            data: {
              __typename: "Query",
              getUserProjects: {
                response: [
                  ...data!.getUserProjects!.response!,
                  {
                    name: newProject.response.project.name,
                    id: newProject.response.project.id,
                    owner: newProject.response.project.owner.name,
                    createdAt: newProject.response.project.createdAt,
                    issues: 0,
                    role: Role.Owner,
                  },
                ],
              },
            },
          });
      },
    });

    // Handle errors or route to Project
    if (result.data)
      if (result.data.createProject.response) {
        setProject({
          id: result.data.createProject.response.project.id.toString(),
          name: result.data.createProject.response.project.name,
          canEdit: Role.Owner,
        });

        changeActive("Overview");
        history.push(
          `/project/${result.data.createProject.response.project.id}/`
        );
      } else if (result.data.createProject.errors) {
        setErrors(MapError(result.data.createProject.errors));
      }
  };

  /************* RENDER ***************/
  return (
    <Formik
      initialValues={{ name: "", desc: "" }}
      onSubmit={async (values, { setErrors }) => onSubmit(values, setErrors)}>
      {({ isSubmitting }) => (
        <Form>
          <Box mt={4}>
            <InputField
              name="name"
              placeholder="Project name"
              label="Project name"
              type="text"
            />
          </Box>
          <Box mt={4}>
            <InputField
              name="desc"
              placeholder="Description"
              label="Description"
              type="text"
            />
          </Box>

          <Flex align="center" justify="flex-end" w="100%" mt={8}>
            <Button
              background="#7209B7"
              type="submit"
              isLoading={isSubmitting}
              borderRadius={10}
              _hover={{ background: "#480972" }}
              color="#F8F9FA"
              mx={3}>
              Create
            </Button>
            <Link to="/profile">
              <Text fontFamily="Poppins">Cancel</Text>
            </Link>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

/**
 * Route rendered to create a Project
 */
export const Create: React.FC = () => {
  /************* RENDER ***************/
  return (
    <Flex flexDir="column" align="center" justify="center" minHeight="100vh">
      <Heading fontSize={28} fontFamily="Poppins">
        Create new project
      </Heading>
      <Box mt={8} mx="auto" maxW="450px" w="90%">
        <CreateForm />
      </Box>
    </Flex>
  );
};
