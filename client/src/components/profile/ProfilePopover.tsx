import React from "react";
import {
  Box,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
  Heading,
  PopoverBody,
  Avatar,
  Flex,
  Text,
  Spinner,
  PopoverFooter,
} from "@chakra-ui/react";
import {
  useLogoutMutation,
  UserDocument,
  UserQuery,
  useUserQuery,
} from "../../generated/graphql";
import { useHistory } from "react-router-dom";

interface ProfilePopoverProps {}

export const ProfilePopover: React.FC<ProfilePopoverProps> = () => {
  const history = useHistory();
  const { data, loading } = useUserQuery();

  const [logout] = useLogoutMutation();

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Avatar cursor="pointer" size="sm" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader textAlign="center">Account</PopoverHeader>
        <PopoverBody>
          {loading || !data || !data.user ? (
            <Flex align="center" justify="center">
              <Spinner />
            </Flex>
          ) : (
            <Box>
              <Flex align="center">
                <Avatar mr={4} />
                <Flex flexDir="column">
                  <Heading size="sm">{data.user.id}</Heading>
                  <Text size="xs">{data.user.email}</Text>
                </Flex>
              </Flex>
            </Box>
          )}
        </PopoverBody>
        <PopoverFooter p={0}>
          <Box
            w="100%"
            py="0.25rem"
            px={2}
            my={2}
            cursor="pointer"
            _hover={{ background: "#f8f8f8" }}
            onClick={() => history.push("/profile")}>
            <Text>Profile</Text>
          </Box>
          <Box
            w="100%"
            py="0.25rem"
            px={2}
            my={2}
            cursor="pointer"
            _hover={{ background: "#f8f8f8" }}>
            <Text>Settings</Text>
          </Box>
        </PopoverFooter>
        <PopoverFooter p={0}>
          <Box
            w="100%"
            py="0.25rem"
            px={2}
            my={2}
            cursor="pointer"
            onClick={async () => {
              await logout({
                update: (cache, { data: _newData }) => {
                  cache.writeQuery<UserQuery>({
                    query: UserDocument,
                    data: { user: null },
                  });
                },
              });
              history.push("/");
            }}
            _hover={{ background: "#f8f8f8" }}>
            <Text>Log Out</Text>
          </Box>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
