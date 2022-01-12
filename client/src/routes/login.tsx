import React from "react";
import { Box, Flex, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { Formik, Form, FormikErrors } from "formik";
import { Link, useHistory } from "react-router-dom";
import {
  useLoginMutation,
  UserDocument,
  UserQuery,
} from "../generated/graphql";
import { MapError } from "../util/MapError";

/************** PROPS *************/

/************** COMPONENTS *************/

/**
 * Render login forms. Send request to server.
 */
const LoginForm: React.FC = () => {
  /************** SETUP *************/
  const [login] = useLoginMutation();
  const history = useHistory();

  /************** HANDLERS *************/

  /**
   * Send login request. Update cache.
   * @param values the email and password being checked
   * @param setErrors any errors being handled by Formik
   */
  const onSubmit = async (
    values: { email: string; password: string },
    setErrors: (
      errors: FormikErrors<{
        email: string;
        password: string;
      }>
    ) => void
  ) => {
    const response = await login({
      variables: {
        email: values.email,
        password: values.password,
      },
      update: (cache, { data }) => {
        cache.writeQuery<UserQuery>({
          query: UserDocument,
          data: {
            __typename: "Query",
            user: data?.login!.response!.user!,
          },
        });
      },
    });
    if (response.data?.login.errors) {
      setErrors(MapError(response.data.login.errors));
    } else {
      history.push("/");
    }
  };

  /************** RENDER *************/
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values, { setErrors }) => onSubmit(values, setErrors)}>
      {({ isSubmitting }) => (
        <Form>
          <Box mt={4}>
            <InputField
              name="email"
              placeholder="Email"
              label="Email"
              type="email"
            />
          </Box>
          <Box mt={4}>
            <InputField
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
            />
          </Box>

          <Box w="100%" textAlign="center" mt={8}>
            <Button
              w="100%"
              background="#7209B7"
              type="submit"
              isLoading={isSubmitting}
              borderRadius={10}
              _hover={{ background: "#480972" }}
              color="#F8F9FA">
              Sign In
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

/**
 * Route for the user to login. Routes to /login
 */
export const Login: React.FC = () => {
  /************** RENDER *************/
  return (
    <Flex flexDir="column" align="center" justify="center" minHeight="100vh">
      <Heading fontSize={28} fontFamily="Poppins">
        Sign In
      </Heading>
      <Box mt={8} mx="auto" maxW="450px" w="90%">
        <LoginForm />
        <Box textAlign="center" my={6}>
          <p>or</p>
        </Box>
        <Stack w="100%" spacing={4}>
          <Flex w="100%" justify="flex-end">
            <Text fontFamily="Poppins" mx={1}>
              Don't have an account?
            </Text>
            <Link to="/signup">
              <Text fontFamily="Poppins" fontWeight="bold" color="#7209B7">
                Sign Up
              </Text>
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
};
