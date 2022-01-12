import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  Flex,
  Box,
  PopoverBody,
  Button,
  Spinner,
  Text,
  Avatar,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { InsertButton } from "../../InsertButton";
import {
  GetUsersQuery,
  useAddUsersMutation,
  useUsersLazyQuery,
} from "../../../generated/graphql";
import { Formik, Form } from "formik";
import { InputField } from "../../InputField";

interface UserInsertProps {
  data: GetUsersQuery;
  projectId: number;
}

export const UserInsert: React.FC<UserInsertProps> = ({ data, projectId }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const toast = useToast();

  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [fetch, { data: queriedData, loading }] = useUsersLazyQuery();
  const [addUsers] = useAddUsersMutation();
  const [checked, setChecked] = React.useState<number[]>([]);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prev: number[]) => {
      const temp = prev.find((check) => check.toString() === e.target.value);
      return temp
        ? prev.filter((obj) => obj !== parseFloat(e.target.value))
        : [...prev, parseFloat(e.target.value)];
    });
  };

  const onClick = async () => {
    setSubmitting(true);
    await addUsers({
      variables: {
        id: projectId,
        users: checked,
      },
      update: (cache, { data: newUsersData }) => {
        if (!newUsersData) {
          toast({
            title: "Error",
            status: "error",
            isClosable: true,
            description: "Something went wrong!",
          });
          return;
        }
        if (newUsersData.addUsers.errors)
          newUsersData.addUsers.errors.forEach((error) => {
            toast({
              title: "Error",
              status: "error",
              isClosable: true,
              description: error.message,
            });
          });

        if (!newUsersData!.addUsers.response) return;

        cache.modify({
          id: cache.identify({
            __typename: "Query",
            id: projectId,
          }),
          fields: {
            getUsersForProject(cached) {
              console.log(...newUsersData.addUsers.response!);
              const addedRefs = newUsersData.addUsers.response!.map(
                ({ id }) => {
                  return { __ref: `ProjectManagement:${id}` };
                }
              );
              const temp = Object.assign({}, cached);
              temp.response = [...addedRefs, ...temp.response];

              return temp;
            },
          },
        });
      },
    });
    setSubmitting(false);
    close();
  };

  const LoadingComponent = () => {
    return (
      <Flex align="center" justify="center" h={32}>
        <Spinner />
      </Flex>
    );
  };

  const UserComponent: React.FC<{ name: string; id: number; email: string }> =
    ({ name, id, email }) => {
      return (
        <Flex key={id} align="center" justify="space-between" mt={3}>
          <Flex align="center">
            <Avatar size="sm" mr={2} />
            <Box>
              <Text fontSize={14}>{name}</Text>
              <Text fontSize={14} opacity={0.8}>
                {email}
              </Text>
            </Box>
          </Flex>
          <Checkbox
            colorScheme="gray"
            isChecked={checked.includes(id)}
            onChange={(e) => handleCheck(e)}
            value={id}
          />
        </Flex>
      );
    };

  return (
    <Popover placement="bottom-start" isOpen={isOpen} onClose={close}>
      <PopoverTrigger>
        <Box>
          <InsertButton callback={open} heading="Add users" />
        </Box>
      </PopoverTrigger>
      <PopoverContent fontFamily="Poppins">
        <PopoverHeader>Add a new user by email.</PopoverHeader>
        <PopoverBody>
          <Formik
            initialValues={{ query: "" }}
            onSubmit={({ query }) =>
              fetch({ variables: { query, limit: 10 } })
            }>
            <Form autoComplete="new-password">
              <Flex align="center">
                <InputField
                  autoComplete="none"
                  name="query"
                  placeholder="Search for user by email..."
                  type="text"
                />

                <Button
                  height="32px"
                  ml={2}
                  size="sm"
                  background="#7209B7"
                  color="#F8F9FA"
                  type="submit"
                  _hover={{
                    background: "#4D1175",
                  }}>
                  Search
                </Button>
              </Flex>
            </Form>
          </Formik>

          {loading ? (
            <LoadingComponent />
          ) : (
            queriedData && (
              <React.Fragment>
                {queriedData.usersByQuery.map(({ id, name, email }) => (
                  <UserComponent key={id} id={id} name={name} email={email} />
                ))}
                <Flex mt={8} justify="flex-end">
                  <Button mr={2} size="sm" onClick={() => setChecked([])}>
                    Cancel
                  </Button>
                  <Button
                    background="#7209B7"
                    isLoading={submitting}
                    color="#F8F9FA"
                    size="sm"
                    _active={{
                      background: "#4D1175",
                    }}
                    _hover={{
                      background: "#4D1175",
                    }}
                    onClick={onClick}
                    disabled={checked.length === 0}>
                    Add
                  </Button>
                </Flex>
              </React.Fragment>
            )
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
