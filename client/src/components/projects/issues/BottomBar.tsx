import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { AiOutlineComment } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { UserIssue } from "../../../generated/graphql";
import { Overlay } from "./Overlay";

interface BottomBarProps {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  issue: UserIssue;
}

export const BottomBar: React.FC<BottomBarProps> = ({ issue, setEdit }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <React.Fragment>
      <Overlay onClose={onClose} isOpen={isOpen} issue={issue} />
      <Box>
        <Flex align="center" justify="flex-end" gridGap={2}>
          <Box
            p={1}
            rounded="md"
            onClick={() => setEdit(true)}
            _hover={{ color: "#480972", background: "#eed8fd" }}>
            <BsPencil />
          </Box>
          <Box
            p={1}
            rounded="md"
            onClick={onOpen}
            _hover={{ color: "#480972", background: "#eed8fd" }}>
            <AiOutlineComment />
          </Box>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
