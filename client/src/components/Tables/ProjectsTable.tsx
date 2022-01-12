import { Table } from "./Table";
import React from "react";
import { UserProject } from "../../generated/graphql";
import ProjectContext from "../../util/ProjectContext";
import { useHistory } from "react-router-dom";
import SidebarContext from "../../util/SidebarContext";
interface ProjectsTableProps {
  data: ({
    __typename?: "UserProject" | undefined;
  } & Pick<
    UserProject,
    "name" | "role" | "issues" | "owner" | "createdAt" | "id"
  >)[];
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ data }) => {
  const history = useHistory();
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Issues",
        accessor: "issues",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Owner",
        accessor: "owner",
      },
    ],
    []
  );
  const { setProject } = React.useContext(ProjectContext);
  const { changeActive } = React.useContext(SidebarContext);

  const callback = (tableData: any) => {
    setProject({
      id: tableData.id.toString(),
      name: tableData.name,
      canEdit: tableData.role,
    });

    history.push(`/project/${tableData.id}`);
    changeActive("Overview");
  };
  return <Table columns={columns} callback={callback} data={data} />;
};
