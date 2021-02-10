import { Flex, Heading, Box, Button, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	useUserQuery,
	useCreateProjectMutation,
	ProjectQuery,
	ProjectDocument,
	UserQuery,
	UserDocument,
} from '../../generated/graphql';
import { DropdownField } from '../DropdownField';
import { InputField } from '../InputField';

export const Create: React.FC = () => {
	const { data, loading } = useUserQuery();
	const [createProject] = useCreateProjectMutation();
	const history = useHistory(); // after we create, we are going to re-route to the render page
	return (
		<Flex
			flexDir="column"
			align="center"
			justify="center"
			minHeight="100vh"
		>
			<Heading fontSize={28} fontFamily="Poppins">
				Create new project
			</Heading>
			<Box mt={8} mx="auto" maxW="450px" w="90%">
				<Formik
					initialValues={{ name: '', desc: '' }}
					onSubmit={async (values, { setErrors }) => {
						const result = await createProject({
							variables: { name: values.name, desc: values.desc },
							update: (cache, { data: projectData }) => {
								cache.writeQuery<ProjectQuery>({
									query: ProjectDocument,
									data: {
										__typename: 'Query',
										project: projectData!.createProject!,
									},
								});
								cache.writeQuery<UserQuery>({
									query: UserDocument,
									data: {
										__typename: 'Query',
										user: {
											email: data!.user!.role,
											id: data!.user!.id,
											role: data!.user!.role,
											projects: [
												...data!.user!.projects,
												{
													project: {
														name: projectData!
															.createProject!
															.name,
														desc: projectData!
															.createProject!
															.desc,
														id: projectData!
															.createProject!.id,
														issues: [],
													},
												},
											],
										},
									},
								});
							},
						});
						if (result.data)
							history.push(
								`/project/${result.data.createProject.id}/`
							);
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Box mt={4}>
								<InputField
									name="name"
									placeholder="Project name"
									label="Project name"
									type="text"
								/>
							</Box>
							<Box mt={4}>
								<InputField
									name="desc"
									placeholder="Description"
									label="Description"
									type="text"
								/>
							</Box>
							<Box mt={4}>
								<DropdownField
									name="privacy"
									placeholder="Privacy"
									label="Privacy (not implemented)"
								>
									<option value={0}>Public</option>
									<option value={1}>Private</option>
									<option value={2}>Shared</option>
								</DropdownField>
							</Box>
							<Flex
								align="center"
								justify="flex-end"
								w="100%"
								mt={8}
							>
								<Button
									background="#7209B7"
									type="submit"
									isLoading={isSubmitting}
									borderRadius={10}
									_hover={{ background: '#480972' }}
									color="#F8F9FA"
									mx={3}
								>
									Create
								</Button>
								<Link to="/profile">
									<Text fontFamily="Poppins">Cancel</Text>
								</Link>
							</Flex>
						</Form>
					)}
				</Formik>
			</Box>
			;
		</Flex>
	);
};
