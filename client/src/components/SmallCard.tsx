import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface SmallCardProps {
  heading: string;
  value: string | number;
}

export const SmallCard: React.FC<SmallCardProps> = ({ heading, value }) => {
  return (
    <Box
      fontFamily="poppins"
      boxShadow="0px 12px 26px rgba(0, 0, 0, 0.06);"
      maxH={109}
      flex={1}
      borderRadius={8}>
      <Box p={6}>
        <Text size="xs" color="#7209B7">
          {heading}
        </Text>
        <Heading>{value}</Heading>
      </Box>
    </Box>
  );
};
