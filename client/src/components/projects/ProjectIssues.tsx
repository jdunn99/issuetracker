import {
  Flex,
  Accordion,
  Box,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import {
  ProjectIssuesQuery,
  useProjectIssuesLazyQuery,
  UserIssue,
  useUpdateIssueMutation,
} from "../../generated/graphql";
import { useError } from "../../util/hooks/useError";
import ProjectContext from "../../util/ProjectContext";
import { Head } from "../Head";
import { InsertButton } from "../InsertButton";
import { InsertModal } from "./issues/InsertModal";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IssueContainer } from "./issues/IssueContainer";
import { IssueItem } from "./issues/IssueItem";

interface IssuesPageProps {}

type Issue = ({
  __typename?: "UserIssue" | undefined;
} & {
  __typename?: "UserIssue" | undefined;
} & Pick<
    UserIssue,
    | "name"
    | "status"
    | "severity"
    | "createdAt"
    | "projectName"
    | "projectId"
    | "desc"
    | "id"
  >)[];

interface FormattedIssues {
  TODO: Issue;
  PROGRESS: Issue;
  REVIEW: Issue;
  RESOLVED: Issue;
}

const convertToFloat = (s: string) => {
  switch (s) {
    case "TODO":
      return 0;
    case "PROGRESS":
      return 1;
    case "REVIEW":
      return 2;
    case "RESOLVED":
      return 3;
    default:
      return 0;
  }
};

const format = (s: string) => {
  switch (s) {
    case "TODO":
      return "To Do";
    case "PROGRESS":
      return "In Progress";
    case "REVIEW":
      return "Review";
    case "RESOLVED":
      return "Resolved";
    default:
      return "";
  }
};

export const ProjectIssues: React.FC<IssuesPageProps> = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [fetch, { data, loading }] = useProjectIssuesLazyQuery();
  const { project } = React.useContext(ProjectContext);

  const [issues, setIssues] = React.useState<FormattedIssues>();

  const [update] = useUpdateIssueMutation();
  const toast = useToast();

  React.useEffect(() => {
    if (project !== undefined)
      fetch({
        variables: {
          id: parseInt(project.id),
        },
      });
  }, [project, fetch]);

  React.useEffect(() => {
    if (data && data.getIssuesFromProject.response) {
      const temp: FormattedIssues = {
        TODO: [],
        PROGRESS: [],
        REVIEW: [],
        RESOLVED: [],
      };

      data.getIssuesFromProject.response.forEach((issue) => {
        const status = issue.status.toString();
        temp[status] = [...temp[status], issue];
      });

      setIssues(temp);
    }
  }, [data]);

  useError<ProjectIssuesQuery>(data, "getIssuesFromProject");

  const onDragEnd = async (result: any) => {
    const { destination, source } = result;

    const temp = issues;

    if (!destination) return;
    if (!temp) return;

    const sameContainer = source.droppableId === destination.droppableId;
    const sameIndex = source.index === destination.index;

    if (sameContainer && sameIndex) return;

    if (project && !project.canEdit) {
      toast({
        title: "Error",
        status: "error",
        isClosable: true,
        description: "You don't have permission to perform that action.",
      });
      return;
    }

    const sourceIssues: UserIssue[] = temp[source.droppableId];
    const draggedItem = sourceIssues[source.index];

    sourceIssues.splice(source.index, 1);

    if (!sameContainer) {
      const destIssues: UserIssue[] = temp[destination.droppableId];
      destIssues.splice(destination.index, 0, draggedItem);

      await update({
        variables: {
          id: draggedItem.id,
          status: convertToFloat(destination.droppableId),
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
            id: draggedItem.id,
            __typename: "UserIssue",
          });

          cache.modify({
            id: issueRef,
            fields: {
              status(_cachedStatus) {
                return updatedIssue.updateIssue.response!.status;
              },
            },
          });
        },
      });
      setIssues({
        ...temp,
        [source.droppableId]: [...sourceIssues],
        [destination.droppableId]: [...destIssues],
      });
    } else {
      if (sameIndex) return;
      sourceIssues.splice(destination.index, 0, draggedItem);
      setIssues({
        ...temp,
        [source.droppableId]: [...sourceIssues],
      });
    }
  };

  return project ? (
    <React.Fragment>
      <InsertModal open={isOpen} setClose={onClose} />
      <Flex p={8} flexDir="column" className="right-col">
        <Head name={`${project.name} - Issues`}>
          <Flex mt={4} align="center" fontFamily="Poppins">
            {project.canEdit && (
              <InsertButton heading="Add Issue" callback={onOpen} />
            )}
          </Flex>
        </Head>

        {/* Content */}
        <Box mt={4}>
          {loading ? (
            <Spinner />
          ) : (
            data &&
            data.getIssuesFromProject.response && (
              <Box mt="2rem" mx="auto">
                <DragDropContext
                  onDragEnd={(result) => {
                    onDragEnd(result);
                  }}>
                  <Accordion allowMultiple defaultIndex={[0, 1, 2, 3, 4]}>
                    {issues &&
                      Object.keys(issues).map((key) => (
                        <Droppable key={key} droppableId={key}>
                          {(provided, snapshot) => (
                            <Box
                              {...provided.droppableProps}
                              background={
                                snapshot.isDraggingOver
                                  ? "#eed8fd"
                                  : "transparent"
                              }
                              ref={provided.innerRef}>
                              <IssueContainer heading={format(key)}>
                                {issues[key].map(
                                  (issue: UserIssue, index: number) => (
                                    <IssueItem
                                      project={project}
                                      issue={issue}
                                      key={issue.id}
                                      index={index}
                                    />
                                  )
                                )}
                              </IssueContainer>

                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      ))}
                  </Accordion>
                </DragDropContext>
              </Box>
            )
          )}
        </Box>
      </Flex>
    </React.Fragment>
  ) : (
    <p>Something went wrong.</p>
  );
};
