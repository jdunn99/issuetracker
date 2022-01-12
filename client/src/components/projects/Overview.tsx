import { Flex, Box, Text, Spinner, Container, Heading } from "@chakra-ui/react";
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from "recharts";
import { Issue } from "../../generated/graphql";
import ProjectContext from "../../util/ProjectContext";
import { Head } from "../Head";
import { SmallCard } from "../SmallCard";

interface HomePageProps {}

export const Overview: React.FC<HomePageProps> = () => {
  const { project } = React.useContext(ProjectContext);

  return !!project ? (
    <Flex p={8} flexDir="column" className="right-col">
      <Head name={`${project.name} - Overview`}>
        <Text>Last updated {new Date(Date.now()).toDateString()}</Text>
      </Head>

      {/* Content */}
      <Box mt={4}>
        <Flex gridGap={8} flexDir={{ base: "column", xl: "row" }}>
          <Box flex={2}>
            <Flex
              flex={1}
              gridGap={8}
              mb={8}
              justify="center"
              flexDir={{ base: "column", md: "row" }}>
              <SmallCard heading="Total Issues" value={0} />
              <SmallCard value={0} heading="Issues Resolved" />
              <SmallCard value={0} heading="Total Users" />
            </Flex>

            <Container height={401}>
              <Box px={6} pt={6} pb={4}>
                <Heading fontSize={18}>Issues Tracked</Heading>
              </Box>
              <ResponsiveContainer width="99%" height="80%">
                <AreaChart
                  margin={{ top: 20, bottom: 10, left: 10, right: 40 }}>
                  <XAxis fontSize="14px" dataKey="name" />
                  <YAxis fontSize="14px" />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7209b7" stopOpacity={0.8} />

                      <stop offset="95%" stopColor="#7209b7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3" />
                  <Area
                    strokeWidth={2}
                    type="monotone"
                    dataKey="uv"
                    fill="url(#colorUv)"
                    stroke="#7209b7"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Container>
            <Flex
              flex={1}
              gridGap={8}
              flexDir={{ base: "column", md: "row" }}></Flex>
          </Box>

          <Box flex={0.75}>
            <Container height={421} heading="Owned Projects">
              <Box></Box>
            </Container>
          </Box>
        </Flex>
      </Box>
    </Flex>
  ) : (
    <Flex p={8} flexDir="column" className="right-col">
      <Spinner />
    </Flex>
  );
};
