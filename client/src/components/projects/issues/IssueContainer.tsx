import React from "react";
import {
  AccordionItem,
  Text,
  AccordionButton,
  Box,
  Flex,
  Heading,
  AccordionIcon,
} from "@chakra-ui/react";

interface IssueContainerProps {
  heading: string;
}

export const IssueContainer: React.FC<IssueContainerProps> = ({
  heading,
  children,
}) => {
  const count = React.Children.count(children);

  return (
    <AccordionItem border="none" py="0.75rem">
      <AccordionButton borderBottom="1px solid rgba(0,0,0,0.1)">
        <Box flex="1" textAlign="left">
          <Flex align="center" gridGap={2}>
            <Heading size="sm">{heading}</Heading>
            <Text opacity={0.8} fontSize="sm">
              {!!count && count}
            </Text>
          </Flex>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      {children}
    </AccordionItem>
  );
};
