import { Table } from "./Table";
import React from "react";
import { useCanEditLazyQuery, UserIssue } from "../../generated/graphql";
import SidebarContext from "../../util/SidebarContext";
import ProjectContext from "../../util/ProjectContext";
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

export const IssuesTable: React.FC<ProjectsTableProps> = ({ data }) => {
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
        Header: "Project",
        accessor: "projectName",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
      },
    ],
    []
  );

  const { changeActive } = React.useContext(SidebarContext);
  const { setProject } = React.useContext(ProjectContext);
  const history = useHistory();
  const [checkPermissions, { data: editData }] = useCanEditLazyQuery();
  const [tableData, setTableData] = React.useState<any>();

  const callback = (tableData: any) => {
    checkPermissions({ variables: { id: tableData.projectId } });

    setTableData(tableData);
  };

  React.useEffect(() => {
    if (editData) {
      setProject({
        id: tableData.projectId,
        name: tableData.projectName,
        canEdit: editData.canEdit,
      });

      changeActive("Issues ");
      history.push(`/project/${tableData.projectId}/${tableData.id}`);
    }
  }, [editData, tableData, setProject, history, changeActive]);

  return <Table columns={columns} data={data} callback={callback} />;
};
