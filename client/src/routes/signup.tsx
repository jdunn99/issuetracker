import React from "react";
import { Box, Flex, Button, Heading, Text } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { Formik, Form } from "formik";
import { Link, useHistory } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";
import { MapError } from "../util/MapError";

interface SignupProps {}

export const Signup: React.FC<SignupProps> = () => {
  const [register] = useRegisterMutation();
  const history = useHistory();

  return (
    <Flex flexDir="column" align="center" justify="center" minHeight="100vh">
      <Heading fontSize={28} fontFamily="Poppins">
        Create your free account
      </Heading>
      <Box mt={8} mx="auto" maxW="450px" w="90%">
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={async ({ name, email, password }, { setErrors }) => {
            const response = await register({
              variables: { name, email, password },
            });
            if (response.data?.register.errors) {
              setErrors(MapError(response.data.register.errors));
            } else {
              history.push("/signin");
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box mt={4}>
                <InputField
                  name="name"
                  placeholder="Full name"
                  label="Full name"
                  type="name"
                />
              </Box>
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
                  Sign Up
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        <Flex w="100%" justify="flex-end" mt={2}>
          <Text fontFamily="Poppins" mx={1}>
            Already have an account?
          </Text>
          <Link to="/signin">
            <Text fontFamily="Poppins" fontWeight="bold" color="#7209B7">
              Sign In
            </Text>
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};
