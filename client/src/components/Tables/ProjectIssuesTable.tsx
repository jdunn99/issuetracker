import { Table } from "./Table";
import React from "react";
import { UserIssue } from "../../generated/graphql";
import { Overlay } from "../projects/issues/Overlay";
import ProjectContext from "../../util/ProjectContext";
import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

interface ProjectsTableProps {
  data: ({
    __typename?: "UserIssue" | undefined;
  } & Pick<
    UserIssue,
    | "name"
    | "status"
    | "severity"
    | "createdAt"
    | "projectName"
    | "projectId"
    | "id"
  >)[];
}

export const ProjectIssuesTable: React.FC<ProjectsTableProps> = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Severity",
        accessor: "severity",
      },
      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Created At",
        accessor: "createdAt",
      },
    ],
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [issueId, setIssueId] = React.useState<number | undefined>(undefined);
  const callback = (tableData: any) => {
    setIssueId(parseInt(tableData.id));
    onOpen();
  };

  const { project } = React.useContext(ProjectContext);

  const history = useHistory();

  const issueFromRoute = React.useMemo(() => {
    return history.location.pathname.split("/").length - 1 >= 3
      ? history.location.pathname.match(/([^\/]+$)/)
      : null;
  }, [history.location.pathname]);

  React.useEffect(() => {
    if (issueFromRoute && issueFromRoute[0]) {
      setIssueId(parseInt(issueFromRoute[0]));
      onOpen();
    }
  }, [issueFromRoute, onOpen]);

  return (
    <React.Fragment>
      {/* {!!issueId && !!project && (
        // <Overlay
        //   issueId={issueId}
        //   admin={project.canEdit}
        //   isOpen={isOpen}
        //   onClose={onClose}
        // />
      )} */}
      <Table callback={callback} columns={columns} data={data} />
    </React.Fragment>
  );
};
