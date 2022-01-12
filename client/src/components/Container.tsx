import React from "react";
import { Box, Heading } from "@chakra-ui/react";

interface ContainerProps {
  heading?: string;
  overflow?: boolean;
  height: any;
}

export const Container: React.FC<ContainerProps> = ({
  heading,
  height,
  overflow = false,
  children,
}) => {
  return (
    <Box
      fontFamily="poppins"
      boxShadow="0px 12px 26px rgba(0, 0, 0, 0.06);"
      height={height}
      flex="1 1 auto"
      overflowY={overflow ? "scroll" : "hidden"}
      mb={8}
      borderRadius={8}>
      {!!heading && (
        <Box px={6} pt={6} pb={4} borderBottom="1px solid rgba(0,0,0,0.06)">
          <Heading fontSize={20}>{heading}</Heading>
        </Box>
      )}
      <Box height="inherit" w="100%">
        {children}
      </Box>
    </Box>
  );
};
