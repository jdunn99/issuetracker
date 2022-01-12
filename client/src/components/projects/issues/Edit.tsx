import React from "react";
import { Box, Flex, Button, useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import {
  Severity,
  useProjectIssuesQuery,
  UserIssue,
  useUpdateIssueMutation,
} from "../../../generated/graphql";
import { DropdownField } from "../../DropdownField";
import { InputField } from "../../InputField";
import { convertSeverity } from "./InsertModal";
import { Project } from "../../../util/ProjectContext";

interface EditProps {
  issue: UserIssue;
  project: Project;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Edit: React.FC<EditProps> = ({ issue, project, setEdit }) => {
  const [update] = useUpdateIssueMutation();
  const toast = useToast();

  const { data } = useProjectIssuesQuery({
    variables: { id: parseFloat(project.id) },
  });

  return (
    <Formik
      initialValues={{
        newName: issue.name,
        newDesc: issue.desc,
        severity: issue.severity,
      }}
      onSubmit={async (values) => {
        await update({
          variables: {
            id: issue.id,
            desc: values.newDesc,
            name: values.newName,
            severity: convertSeverity(values.severity.toString()),
          },

          update: (cache, { data: updatedIssue }) => {
            if (!updatedIssue) {
              toast({
                title: "Error",
                status: "error",
                isClosable: true,
                description: "Something went wrong!",
              });
              return;
            }

            if (updatedIssue.updateIssue.errors) {
              updatedIssue.updateIssue.errors.forEach((error) => {
                toast({
                  title: "Error",
                  status: "error",
                  isClosable: true,
                  description: error.message,
                });
              });
              return;
            }

            if (!updatedIssue.updateIssue.response) {
              toast({
                title: "Error",
                status: "error",
                isClosable: true,
                description: "Something went wrong!",
              });
              return;
            }

            if (!data || !data.getIssuesFromProject.response) {
              toast({
                title: "Error",
                status: "error",
                isClosable: true,
                description: "Something went wrong!",
              });
              return;
            }

            const issueRef = cache.identify({
              id: issue.id,
              __typename: "UserIssue",
            });

            cache.modify({
              id: issueRef,
              fields: {
                desc(_) {
                  return values.newDesc;
                },
                name(_) {
                  return values.newName;
                },
                severity(_) {
                  return values.severity;
                },
              },
              broadcast: false,
            });
          },
        });
        setEdit(false);
      }}>
      <Form>
        <Box border="1px solid rgba(0,0,0,0.1)" borderRadius="md">
          <Box p={2}>
            <InputField
              name="newName"
              type="text"
              label="Name"
              placeholder={issue.name}
              background="transparent"
            />
          </Box>
          <Box p={2}>
            <InputField
              name="newDesc"
              type="text"
              label="Description"
              area
              placeholder={issue.desc}
              background="transparent"
            />
          </Box>
          <Box p={2}>
            <DropdownField
              name="severity"
              label="Severity"
              background="transparent">
              <option value={Severity.Low}>Low</option>
              <option value={Severity.Medium}>Medium</option>
              <option value={Severity.High}>High</option>
            </DropdownField>
          </Box>
          <Flex align="center" p={2} gridGap={1}>
            <Button color="white" background="#7209B7" size="sm" type="submit">
              Submit
            </Button>
            <Button size="sm" onClick={() => setEdit(false)}>
              Cancel
            </Button>
          </Flex>
        </Box>
      </Form>
    </Formik>
  );
};
