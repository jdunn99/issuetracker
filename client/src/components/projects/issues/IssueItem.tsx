import React from "react";
import {
  Box,
  useBreakpointValue,
  AccordionPanel,
  Flex,
  Badge,
  Text,
} from "@chakra-ui/react";
import { truncate } from "../../../util/truncate";
import { UserIssue, Severity, Role } from "../../../generated/graphql";
import { BottomBar } from "./BottomBar";
import { Edit } from "./Edit";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Project } from "../../../util/ProjectContext";

interface IssueItemProps {
  issue: UserIssue;
  index: number;
  project: Project;
}

interface StyledDragProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  id: string;
}

const StyledDrag: React.FC<StyledDragProps> = ({
  children,
  provided,
  snapshot,
  id,
}) => (
  <Box
    key={id}
    align="center"
    background={snapshot.isDragging ? "#f1f1f4" : "transparent"}
    ref={provided.innerRef}
    {...provided.dragHandleProps}
    {...provided.draggableProps}>
    {children}
  </Box>
);

const mapSeverity = (severity: Severity): string => {
  switch (severity) {
    case Severity.High:
      return "red";
    case Severity.Medium:
      return "yellow";
    case Severity.Low:
      return "green";
    default:
      return "";
  }
};

export const IssueItem: React.FC<IssueItemProps> = ({
  issue,
  index,
  project,
}) => {
  const [shown, setShown] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const truncation = useBreakpointValue({
    base: 0,
    md: 50,
    lg: 65,
    xl: 100,
  });

  return edit ? (
    <Box p={2} borderBottom="1px solid rgba(0,0,0,0.1)">
      <Edit project={project} issue={issue} setEdit={(q) => setEdit(q)} />
    </Box>
  ) : (
    <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
      {(provided, snapshot) => (
        <StyledDrag
          provided={provided}
          id={issue.id.toString()}
          snapshot={snapshot}>
          <AccordionPanel
            pb={4}
            cursor="pointer"
            onMouseEnter={() => setShown(true)}
            onMouseLeave={() => setShown(false)}>
            <Box p={2} borderBottom="1px solid rgba(0,0,0,0.1)">
              <Flex gridGap={4} align="center">
                <Flex flex={1} align="center">
                  <Text mr={2} fontWeight="bold">
                    {issue.name}
                  </Text>
                  {!!truncation && (
                    <Text fontSize="14px" opacity={0.7}>
                      {truncate(issue.desc, truncation!)}
                    </Text>
                  )}
                </Flex>
                {shown &&
                  (project.canEdit === Role.Admin ||
                    project.canEdit === Role.Owner) && (
                    <BottomBar setEdit={(q) => setEdit(q)} issue={issue} />
                  )}
                <Badge size="md" colorScheme={mapSeverity(issue.severity)}>
                  {issue.severity.toString()}
                </Badge>
              </Flex>
            </Box>
          </AccordionPanel>
        </StyledDrag>
      )}
    </Draggable>
  );
};
