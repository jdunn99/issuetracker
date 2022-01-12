import { Flex, Box, Heading } from "@chakra-ui/react";
import React from "react";
import { FaBell } from "react-icons/fa";
import { ProfilePopover } from "./profile/ProfilePopover";

interface HeadProps {
  name: string;
}

export const Head: React.FC<HeadProps> = ({ name, children }) => {
  return (
    <React.Fragment>
      <Flex align="center" justify="space-between" mt={5}>
        <Box>
          <Heading size="md" fontFamily="Poppins">
            {name}
          </Heading>
        </Box>
        <Flex align="center">
          <FaBell />
          <Box ml={6}>
            <ProfilePopover />
          </Box>
        </Flex>
      </Flex>

      {children}
    </React.Fragment>
  );
};
