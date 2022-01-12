import { CheckedTable, Table } from "./Table";
import React from "react";
import { Flex, Select, useToast } from "@chakra-ui/react";
import {
  useChangeRoleMutation,
  GetUsersQuery,
  useRemoveUserFromProjectMutation,
  Role,
} from "../../generated/graphql";

interface ProjectsTableProps {
  data: GetUsersQuery;
  query: string;
  projectId: number;
  canEdit: Role;
}

interface DropdownProps {
  originalData: any;
  row: any;
  onChange: (id: number, role: number, index: number) => Promise<void>;
  owner: boolean;
}
const Dropdown: React.FC<DropdownProps> = ({
  originalData,
  row,
  onChange,
  owner,
}) => {
  return (
    <Flex justify={{ base: "flex-end", md: "flex-start" }}>
      <Select
        size="sm"
        variant="filled"
        onChange={(e) => {
          onChange(originalData.id, parseFloat(e.target.value), row.row.index);
        }}
        background="#eeeeee"
        w={{ base: "50%", md: "100%", xl: "50%" }}>
        <option value="" disabled selected>
          {originalData.role}
        </option>
        {owner && <option value={0}>Admin</option>}
        <option value={1}>Editor</option>
        <option value={2}>Viewer</option>
      </Select>
    </Flex>
  );
};

export const ProjectUsersTable: React.FC<ProjectsTableProps> = ({
  data,
  query,
  projectId,
  canEdit,
}) => {
  const [changeRole] = useChangeRoleMutation();
  const toast = useToast();
  const [remove] = useRemoveUserFromProjectMutation();

  const onChange = React.useCallback(
    async (id: number, role: number, index: number) => {
      await changeRole({
        variables: { id, role },
        update: (cache, { data: newRoleData }) => {
          if (!newRoleData) return;

          if (
            newRoleData.changeRole.errors &&
            newRoleData.changeRole.errors.length > 0
          ) {
            newRoleData.changeRole.errors.forEach((error) => {
              toast({
                title: "Error",
                status: "error",
                isClosable: true,
                description: error.message,
              });
            });
            return;
          }

          cache.modify({
            id: cache.identify({ id, __typename: "ProjectManagement" }),
            fields: {
              role(cached) {
                console.log(cached);
                return newRoleData!.changeRole!.response!.role;
              },
            },
          });
        },
      });
    },
    [changeRole, toast]
  );

  const [filtered, setFiltered] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (data && data.getUsersForProject.response)
      setFiltered(
        data.getUsersForProject.response!.filter(({ user }) => {
          const regex = new RegExp("^" + query.toLocaleLowerCase());
          return user.email.toLocaleLowerCase().search(regex) !== -1;
        })
      );
  }, [data, query]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "user.name",
      },
      {
        Header: "Email",
        accessor: "user.email",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: (row) => {
          const originalData = row.cell.row.original;

          return canEdit === Role.Admin || canEdit === Role.Owner ? (
            canEdit === Role.Owner &&
            (originalData.role === "VIEWER" ||
              originalData.role === "EDITOR" ||
              originalData.role === "ADMIN") ? (
              <Dropdown
                row={row}
                originalData={originalData}
                onChange={onChange}
                owner={true}
              />
            ) : canEdit === Role.Admin &&
              (originalData.role === "VIEWER" ||
                originalData.role === "EDITOR") ? (
              <Dropdown
                row={row}
                originalData={originalData}
                onChange={onChange}
                owner={false}
              />
            ) : (
              originalData.role
            )
          ) : (
            originalData.role
          );
        },
      },
    ],
    [canEdit, onChange]
  );

  const callback = async (tableData: any) => {
    console.log(tableData);
    const userIds = tableData.map((data) => data.user.id);
    await remove({
      variables: { projectId, userIds },
      update: (cache, { data: newData }) => {
        if (!newData || newData.removeUsersFromProject === false) {
          toast({
            title: "Error",
            status: "error",
            isClosable: true,
            description: "Something went wrong!",
          });
          return;
        }

        if (
          newData.removeUsersFromProject.errors &&
          newData.removeUsersFromProject.errors.length > 0
        ) {
          newData.removeUsersFromProject.errors.forEach((error) => {
            toast({
              title: "Error",
              status: "error",
              isClosable: true,
              description: error.message,
            });
          });
          return;
        }

        if (!data.getUsersForProject.response) {
          toast({
            title: "Error",
            status: "error",
            isClosable: true,
            description: "Something went wrong!",
          });
          return;
        }

        tableData.forEach(({ id }) => {
          const deletedItem = cache.identify({
            id,
            __typename: "ProjectManagement",
          });
          cache.evict({ id: deletedItem });
        });
      },
    });
  };

  return (
    <React.Fragment>
      {canEdit === Role.Admin || canEdit === Role.Owner ? (
        <CheckedTable callback={callback} columns={columns} data={filtered} />
      ) : (
        <Table columns={columns} data={filtered} />
      )}
    </React.Fragment>
  );
};
