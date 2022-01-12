import { Flex, Box, Text, Spinner } from "@chakra-ui/react";
import React from "react";
import {
  UserProjectsQuery,
  useUserProjectsQuery,
} from "../../generated/graphql";
import { Head } from "../Head";
import { ProjectsTable } from "../Tables/ProjectsTable";
import { Searchbar } from "../Searchbar";
import { InsertButton } from "../InsertButton";
import { useHistory, Link } from "react-router-dom";
import { useError } from "../../util/hooks/useError";

export const ProjectsPage: React.FC<{}> = () => {
  const { data, loading } = useUserProjectsQuery();
  const history = useHistory();
  const [query, setQuery] = React.useState<string>("");

  const callback = () => {
    history.push("/create");
  };

  useError<UserProjectsQuery>(data, "getUserProjects");

  return (
    <Flex p={8} flexDir="column" className="right-col">
      <Head name="Projects">
        <Flex
          mt={4}
          align="center"
          justify="space-between"
          fontFamily="Poppins">
          <Searchbar
            placeholder="projects"
            query={query}
            setQuery={(q) => setQuery(q)}
          />
          <InsertButton heading="Add Project" callback={callback} />
        </Flex>
      </Head>

      {/* Content */}
      <Box mt={4}>
        {loading ? (
          <Spinner />
        ) : data &&
          data.getUserProjects.response &&
          data.getUserProjects.response.length > 0 ? (
          <ProjectsTable
            data={data.getUserProjects.response.filter(({ name }) => {
              return name
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase());
            })}
          />
        ) : (
          <Flex justify="center">
            <Text fontFamily="Poppins">
              You are not a member of any projects. Create one{" "}
              <Link to="/create">
                <span style={{ color: "#7209B7" }}>here</span>
              </Link>
              .
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
