import { Flex, Box, Spinner } from "@chakra-ui/react";
import React from "react";
import { Role, useGetUsersLazyQuery } from "../../generated/graphql";
import { usePagination } from "../../util/hooks/usePagination";
import ProjectContext from "../../util/ProjectContext";
import { Head } from "../Head";
import { Searchbar } from "../Searchbar";
import { ProjectUsersTable } from "../Tables/ProjectUsersTable";
import { UserInsert } from "./users/UserInsert";

interface IssuesPageProps {}

export const ProjectUsers: React.FC<IssuesPageProps> = () => {
  const [fetch, { data, loading, fetchMore }] = useGetUsersLazyQuery();
  const { project } = React.useContext(ProjectContext);
  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    if (!data || !data.getUsersForProject.response) return;
    setCursor(
      data.getUsersForProject.response![
        data.getUsersForProject.response!.length - 1
      ].createdAt
    );
  }, [data]);

  React.useEffect(() => {
    if (project)
      fetch({
        variables: {
          id: parseInt(project.id),
          cursor: "",
          limit: 15,
        },
      });
  }, [project, fetch]);

  const [cursor, setCursor] = React.useState<string>("");
  const loader = React.useRef<HTMLDivElement>(null);

  const { loading: load } = usePagination(
    { id: parseFloat(project!.id), cursor, limit: 15 },
    loader,
    fetchMore,
    cursor
  );

  return project ? (
    <Flex p={8} flexDir="column" className="right-col">
      <Head name={`${project.name} - Users`}>
        <Flex
          mt={4}
          align="center"
          justify="space-between"
          fontFamily="Poppins">
          <Searchbar
            placeholder="users"
            query={query}
            setQuery={(q) => setQuery(q)}
          />
          {(project.canEdit === Role.Admin || project.canEdit === Role.Owner) &&
            data && (
              <UserInsert data={data} projectId={parseFloat(project.id)} />
            )}
        </Flex>
      </Head>

      {/* Content */}
      <Box mt={4}>
        {loading ? (
          <Spinner />
        ) : (
          data && (
            <React.Fragment>
              <ProjectUsersTable
                projectId={parseFloat(project.id)}
                data={data}
                canEdit={project.canEdit}
                query={query}
              />
              {!!data.getUsersForProject.hasMore && (
                <Flex ref={loader} align="center" justify="center">
                  {load && <Spinner />}
                </Flex>
              )}
            </React.Fragment>
          )
        )}
      </Box>
    </Flex>
  ) : (
    <Spinner />
  );
};
