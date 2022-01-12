import { useToast, Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import {
  ProjectQuery,
  useUpdateProjectMutation,
  ProjectDocument,
} from "../../../generated/graphql";
import ProjectContext from "../../../util/ProjectContext";
import { InputField } from "../../InputField";

interface EditableProps {
  data: ProjectQuery;
  canEdit: boolean;
}

export const Editable: React.FC<EditableProps> = ({ data, canEdit }) => {
  const [update] = useUpdateProjectMutation();

  const { project, setProject } = React.useContext(ProjectContext);
  const toast = useToast();

  return (
    <Formik
      initialValues={{
        name: data!.project!.response!.project.name,
        desc: data!.project!.response!.project.desc,
      }}
      onSubmit={async ({ name, desc }) => {
        await update({
          variables: { id: data!.project!.response!.project.id, name, desc },
          update: (cache, { data: newData }) => {
            if (!newData) {
              toast({
                title: "Error",
                status: "error",
                isClosable: true,
                description: "Something went wrong!",
              });
              return;
            }

            if (newData.updateProject.errors) {
              newData.updateProject.errors.forEach((error) => {
                toast({
                  title: "Error",
                  status: "error",
                  isClosable: true,
                  description: error.message,
                });
              });
              return;
            }

            if (!newData.updateProject.response) {
              toast({
                title: "Error",
                status: "error",
                isClosable: true,
                description: "Something went wrong!",
              });
              return;
            }

            cache.writeQuery<ProjectQuery>({
              query: ProjectDocument,
              data: {
                project: {
                  ...data.project!,
                  response: {
                    ...data!.project!.response!,
                    project: {
                      id: data!.project!.response!.project.id,
                      name,
                      desc,
                    },
                  },
                },
              },
              variables: { id: data!.project!.response!.project.id },
            });

            if (project)
              setProject({ name, id: project.id, canEdit: project.canEdit });
          },
        });
      }}>
      {({ resetForm, isSubmitting }) => (
        <Form>
          <Box mt={8}>
            <InputField
              name="name"
              disabled={!canEdit}
              placeholder={data!.project!.response!.project.name}
              label="Project Name"
              type="text"
            />
          </Box>
          <Box mt={8}>
            <InputField
              name="desc"
              area
              disabled={!canEdit}
              placeholder={data!.project!.response!.project.desc}
              label="Project Description"
              type="text"
            />
          </Box>

          <Flex mt={8} justify="flex-end">
            <Button
              disabled={!canEdit}
              mr={2}
              size="sm"
              onClick={() => {
                resetForm();
              }}>
              Cancel
            </Button>
            <Button
              background="#7209B7"
              color="#F8F9FA"
              type="submit"
              size="sm"
              disabled={!canEdit}
              isLoading={isSubmitting}
              _active={{
                background: "#4D1175",
              }}
              _hover={{
                background: "#4D1175",
              }}>
              Submit
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
