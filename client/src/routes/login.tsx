import React from 'react';
import { Box, Flex, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { Formik, Form, Field } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import {
	useUserQuery,
	useLoginMutation,
	UserDocument,
	UserQuery,
} from '../generated/graphql';
import { MapError } from '../util/MapError';

interface loginProps {}

export const Login: React.FC<loginProps> = () => {
	const [login] = useLoginMutation();
	const history = useHistory();

	return (
		<Flex
			flexDir="column"
			align="center"
			justify="center"
			minHeight="100vh"
		>
			<Heading fontSize={28} fontFamily="Poppins">
				Sign In
			</Heading>
			<Box mt={8} mx="auto" maxW="450px" w="90%">
				<Formik
					initialValues={{ email: '', password: '' }}
					onSubmit={async (values, { setErrors }) => {
						const response = await login({
							variables: {
								email: values.email,
								password: values.password,
							},
							update: (cache, { data }) => {
								cache.writeQuery<UserQuery>({
									query: UserDocument,
									data: {
										__typename: 'Query',
										user: data?.login.user,
									},
								});
							},
						});
						if (response.data?.login.errors) {
							setErrors(MapError(response.data.login.errors));
						} else {
							history.push('/');
						}
					}}
				>
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
							<Box mt={4} fontFamily="Poppins">
								<Flex align="center">
									<Field type="checkbox" name="toggle" />
									<Text mx={2}>Remember me</Text>
								</Flex>
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
									Sign In
								</Button>
							</Box>
						</Form>
					)}
				</Formik>
				<Box textAlign="center" my={6}>
					<p>or</p>
				</Box>
				<Stack w="100%" spacing={4}>
					{/* <Button
						w="100%"
						background="#393939"
						type="submit"
						borderRadius={10}
						_hover={{ background: '#000' }}
						color="#F8F9FA"
					>
						Sign In with Github
					</Button>
					<Button
						w="100%"
						background="#D84D2D"
						type="submit"
						borderRadius={10}
						_hover={{ background: '#932E17' }}
						color="#F8F9FA"
					>
						Sign In with Google
					</Button>
					<Button
						w="100%"
						background="#3E5D9F"
						type="submit"
						borderRadius={10}
						_hover={{ background: '#1B2B4F' }}
						color="#F8F9FA"
					>
						Sign In with Facebook
					</Button>
					<Button
						w="100%"
						background="#14B3EF"
						type="submit"
						borderRadius={10}
						_hover={{ background: '#05698E' }}
						color="#F8F9FA"
					>
						Sign In with Twitter
					</Button> */}
					<Flex w="100%" justify="flex-end">
						<Text fontFamily="Poppins" mx={1}>
							Don't have an account?
						</Text>
						<Link to="/signup">
							<Text
								fontFamily="Poppins"
								fontWeight="bold"
								color="#7209B7"
							>
								Sign Up
							</Text>
						</Link>
					</Flex>
				</Stack>
			</Box>
		</Flex>
	);
};
