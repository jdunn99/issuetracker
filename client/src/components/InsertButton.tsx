import { Button, Box } from "@chakra-ui/react";
import React from "react";

interface InsertButtonProps {
  callback?: () => void;
  heading: string;
}

export const InsertButton: React.FC<InsertButtonProps> = ({
  callback,
  heading,
}) => {
  const onClick = () => {
    if (!!callback) callback();
  };

  return (
    <React.Fragment>
      <Button
        ml={2}
        onClick={onClick}
        color="white"
        size="sm"
        p={1}
        background="#7209B7"
        _hover={{ background: "#480972" }}
        _active={{ background: "#480972" }}
        display={{ base: "inline-block", md: "none" }}
        title={heading}
        borderRadius="50%">
        +
      </Button>
      <Button
        onClick={onClick}
        background="#7209B7"
        type="submit"
        _active={{ background: "#480972" }}
        borderRadius={20}
        display={{ base: "none", md: "flex" }}
        _hover={{ background: "#480972" }}
        color="#F8F9FA"
        size="sm">
        {heading}
        <Box ml={2} p={1} background="#4D1175" borderRadius="50%" width={25}>
          +
        </Box>
      </Button>
    </React.Fragment>
  );
};
