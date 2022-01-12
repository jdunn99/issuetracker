import React from "react";
import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import "../App.css";
import { Link } from "react-router-dom";
import { useUserQuery } from "../generated/graphql";
import { ProfilePopover } from "./profile/ProfilePopover";

interface NavbarProps {
  overview?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ overview = false }) => {
  return (
    <Flex
      maxHeight="5vh"
      background="#F8F9FA"
      boxShadow={overview ? "md" : ""}
      zIndex={1}
      className={overview ? "navbar" : ""}
      p="2rem">
      {overview ? <NavbarOverview /> : <NavbarStandard />}
    </Flex>
  );
};

const NavbarStandard: React.FC = () => {
  const { data } = useUserQuery();

  return (
    <Flex mx="auto" w={1200} align="center" jusitfy="space-between">
      <Box>
        <Link to="/">
          <Heading fontFamily="Poppins" fontSize={20}>
            Issue Tracker
          </Heading>
        </Link>
      </Box>
      <Box ml="auto">
        <Flex align="center" justify="center">
          {data && data.user ? (
            <>
              <Link to="/">
                <Text mx={3} fontFamily="Poppins">
                  Features
                </Text>
              </Link>

              <ProfilePopover />
            </>
          ) : (
            <>
              <Link to="/">
                <Text mx={3} fontFamily="Poppins">
                  Features
                </Text>
              </Link>
              <Link to="/signin">
                <Text mx={3} fontFamily="Poppins">
                  Sign In
                </Text>
              </Link>
              <Link to="/signup">
                <Button
                  background="#7209B7"
                  borderRadius={10}
                  _hover={{ background: "#480972" }}
                  mx={3}
                  size="sm">
                  <Text color="#F8F9FA" fontFamily="Poppins" px={2}>
                    Sign Up
                  </Text>
                </Button>
              </Link>
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

const NavbarOverview: React.FC = () => {
  return (
    <Flex mx="auto" align="center" justify="space-between" w="90%">
      <Box>
        <Link to="/">
          <Heading fontFamily="Poppins" fontSize={20}>
            Issue Tracker
          </Heading>
        </Link>
      </Box>
      <Box ml="auto">
        <Flex align="center">
          <Text mx={8} fontFamily="Poppins">
            Notifications
          </Text>

          <ProfilePopover />
        </Flex>
      </Box>
    </Flex>
  );
};
