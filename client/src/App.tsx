import React from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { Header } from "./components/Header";
import {
  Box,
  Heading,
  Stack,
  Text,
  Flex,
  Button,
  Image,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Login } from "./routes/login";
import { Signup } from "./routes/signup";
import { Profile } from "./routes/profile";
import { Project } from "./routes/project";
import { useSendFeedSubscription, useUserQuery } from "./generated/graphql";
import { SidebarProvider } from "./util/SidebarContext";
import { ProjectType, ProjectProvider } from "./util/ProjectContext";
import { Create } from "./routes/create";

export const Home: React.FC<{}> = () => {
  const { data } = useUserQuery();

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <section id="hero-section">
        <Box mt="5rem" p={2}>
          <Box mx="auto" maxW={1200}>
            <div className="hero">
              <Header image="https://www.figma.com/file/syQNvs8hdYouZ33hJf4lIe/Untitled?node-id=111%3A4">
                <Stack
                  spacing={8}
                  pr={["0rem", "0rem", "0rem", "10rem"]}
                  mb={["4rem", "4rem", "4rem", "0rem"]}>
                  <Heading fontFamily="Poppins" size="2xl">
                    Track your issues.
                  </Heading>
                  <Heading fontFamily="Poppins" fontSize={24}>
                    The quick approach to problem solving.
                  </Heading>
                  <Box borderLeft={["", "", "", "1px solid #7209B7"]} px={4}>
                    <Text fontFamily="Poppins" color="gray.600">
                      Eliminate bugs from your code base. Develop solutions
                      faster.
                    </Text>
                    <Text fontFamily="Poppins" color="gray.600">
                      Ensure a great user experience.
                    </Text>
                  </Box>
                  <Link to={data && data.user ? "/profile" : "/signin"}>
                    <Button
                      background="#7209B7"
                      borderRadius={10}
                      _hover={{ background: "#480972" }}
                      px={8}>
                      <Text color="#F8F9FA" fontFamily="Poppins">
                        Get Started
                      </Text>
                    </Button>
                  </Link>
                </Stack>
              </Header>
            </div>

            <Flex mt="10rem" flexDir="column" align="center" textAlign="center">
              <Heading fontFamily="Poppins" fontSize={24} mb={8}>
                The tool your team needs to tackle your issues.
              </Heading>
              <Box m="auto" maxW={600}>
                <Text color="gray.600" fontFamily="Poppins">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  fugit praesentium, alias doloremque qui minima vero
                  asperiores.
                </Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </section>
      <Box my="8rem">
        <Features />
      </Box>
      <Box my="8rem">
        <Choose />
      </Box>
    </div>
  );
};

const Features = () => {
  return (
    <Box flex={1} m="auto" fontFamily="Poppins">
      <Box w="100%" mb={6}>
        <Flex
          flexDirection={["column", "column", "column", "row"]}
          mb="4rem"
          mx="auto"
          maxW={1200}
          p={4}
          pt="6rem">
          <Flex
            flexDir="column"
            justifyContent="center"
            w={["100%", "100%", "100%", "55%"]}>
            <Heading
              fontFamily="Poppins"
              size="lg"
              lineHeight={1.5}
              mb={5}
              textAlign={["center", "center", "center", "left"]}>
              Quickly diagnose bugs.
            </Heading>
            <Text
              mt={2}
              mr={4}
              mb={10}
              color="gray.600"
              textAlign={["center", "center", "center", "left"]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip
            </Text>
          </Flex>

          <Flex
            alignItems="center"
            justifyContent={["center", "center", "center", "flex-end"]}>
            <Image
              width={["100%", "100%", "75%", "90%"]}
              src="https://res.cloudinary.com/de0iugw9w/image/upload/v1610472261/issue-tracker/1_kcv20h.png"
              alt="placeholder"
            />
          </Flex>
        </Flex>
      </Box>

      <Box w="100%" mb={6}>
        <Flex
          flexDirection={[
            "column-reverse",
            "column-reverse",
            "column-reverse",
            "row",
          ]}
          mb="4rem"
          mx="auto"
          maxW={1200}
          p={4}
          pt="6rem">
          <Flex
            alignItems="center"
            justifyContent={["center", "center", "center", "flex-start"]}>
            <Image
              width={["100%", "100%", "75%", "90%"]}
              src="https://res.cloudinary.com/de0iugw9w/image/upload/v1610472339/issue-tracker/2_kfeblg.png"
              alt="placeholder"
            />
          </Flex>
          <Flex
            flexDir="column"
            justifyContent="center"
            w={["100%", "100%", "100%", "55%"]}>
            <Heading
              fontFamily="Poppins"
              size="lg"
              lineHeight={1.5}
              mb={5}
              textAlign={["center", "center", "center", "left"]}>
              Improve your workflow.
            </Heading>
            <Text
              mt={2}
              color="gray.600"
              mr={4}
              fontSize="16px"
              mb={10}
              textAlign={["center", "center", "center", "left"]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Box w="100%">
        <Flex
          flexDirection={["column", "column", "column", "row"]}
          mb="4rem"
          mx="auto"
          maxW={1200}
          p={4}
          pt="6rem">
          <Flex
            flexDir="column"
            justifyContent="center"
            w={["100%", "100%", "100%", "55%"]}>
            <Heading
              fontFamily="Poppins"
              size="lg"
              lineHeight={1.5}
              mb={5}
              textAlign={["center", "center", "center", "left"]}>
              Solve your problems.
            </Heading>
            <Text
              mt={2}
              mr={4}
              mb={10}
              color="gray.600"
              textAlign={["center", "center", "center", "left"]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip
            </Text>
          </Flex>

          <Flex
            alignItems="center"
            justifyContent={["center", "center", "center", "flex-end"]}>
            <Image
              width={["100%", "100%", "75%", "90%"]}
              alt="placeholder"
              src="https://res.cloudinary.com/de0iugw9w/image/upload/v1610472339/issue-tracker/3_qru0tu.png"
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const Choose = () => {
  return (
    <Box flex={1} m="auto" maxW={1200} p={4} fontFamily="Poppins">
      <Heading textAlign="center" fontFamily="Poppins" fontSize={24} mb={8}>
        Why Choose Us?
      </Heading>
      <Grid templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]}>
        <Stack mb="4rem">
          <Heading
            mt="2rem"
            size="md"
            textAlign={["center", "center", "center", "left"]}
            fontFamily="Poppins"
            color="#7209B7">
            It's Free
          </Heading>
          <Text
            mt={2}
            color="gray.600"
            mr={4}
            textAlign={["center", "center", "center", "left"]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Stack>

        <Stack mb="4rem">
          <Heading
            mt="2rem"
            color="#7209B7"
            size="md"
            textAlign={["center", "center", "center", "left"]}
            fontFamily="Poppins">
            It's Easy to Use
          </Heading>
          <Text
            mt={2}
            color="gray.600"
            mr={4}
            fontFamily="Poppins"
            textAlign={["center", "center", "center", "left"]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Stack>

        <Stack mb="2rem">
          <Heading
            mt="2rem"
            color="#7209B7"
            size="md"
            textAlign={["center", "center", "center", "left"]}
            fontFamily="Poppins">
            It's Secure
          </Heading>
          <Text
            mt={2}
            color="gray.600"
            mr={4}
            fontFamily="Poppins"
            textAlign={["center", "center", "center", "left"]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Stack>
      </Grid>
    </Box>
  );
};

const Subscriptions: React.FC<{ id: number }> = ({ id }) => {
  useSendFeedSubscription({
    variables: { id },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (!subscriptionData.data) return;

      const cache = client.cache;
      cache.modify({
        id: cache.identify({ __typename: "Query" }),
        fields: {
          getUserOverview(cached) {
            const temp = Object.assign({}, cached);
            temp.response = {
              ...temp.response,
              feed: [
                { __ref: `Feed:${subscriptionData.data!.sendFeed.id}` },
                ...temp.response.feed,
              ],
            };
            return temp;
          },
        },
      });
    },
  });
  return null;
};

function App() {
  const [closed, setClosed] = React.useState<boolean>(false);

  const [project, setProject] = React.useState<ProjectType>();
  const [active, setActive] = React.useState<string>("Home");

  const { data } = useUserQuery();
  const changeActive = (query: string) => {
    setActive(query);
  };

  const toggleSidebar = () => {
    setClosed(!closed);
  };

  const changeProject = (newProject: ProjectType) => {
    setProject(newProject);
  };

  const breakPoint = useBreakpointValue({ base: true, lg: false });
  React.useEffect(() => {
    setClosed(breakPoint!);
  }, [breakPoint]);

  return (
    <ProjectProvider value={{ project: project, setProject: changeProject }}>
      <SidebarProvider value={{ active, changeActive, closed, toggleSidebar }}>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signin" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/project/:id" component={Project} />
            <Route path="/create" component={Create} />
          </Switch>
        </Router>
        {data && data.user && <Subscriptions id={data.user.id} />}
      </SidebarProvider>
    </ProjectProvider>
  );
}

export default App;
