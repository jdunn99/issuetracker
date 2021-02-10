import React from 'react';
import { Box, Flex, Button, Heading, Text } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';

interface signupProps {}

export const signup: React.FC<signupProps> = () => {
	return (
		<Flex
			flexDir="column"
			align="center"
			justify="center"
			minHeight="100vh"
		>
			<Heading fontSize={28} fontFamily="Poppins">
				Create your free account
			</Heading>
			<Box mt={8} mx="auto" maxW="450px" w="90%">
				<Formik
					initialValues={{ email: '', password: '' }}
					onSubmit={async (values, { setErrors }) => {}}
				>
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
									_hover={{ background: '#480972' }}
									color="#F8F9FA"
								>
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
						<Text
							fontFamily="Poppins"
							fontWeight="bold"
							color="#7209B7"
						>
							Sign In
						</Text>
					</Link>
				</Flex>
			</Box>
		</Flex>
	);
};
