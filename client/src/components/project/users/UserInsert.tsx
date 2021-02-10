import React from 'react';
import {
	Box,
	PopoverTrigger,
	Popover,
	PopoverContent,
	PopoverCloseButton,
	PopoverHeader,
	PopoverBody,
	Button,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputField } from '../../InputField';
import {
	ProjectDocument,
	ProjectQuery,
	Role,
	useAddUserToProjectMutation,
	useUserQuery,
} from '../../../generated/graphql';
/*
 Check if the user is an admin for the project
 Input id
*/

interface UserInsertProps {
	data: ProjectQuery;
	admin: boolean;
}

export const UserInsert: React.FC<UserInsertProps> = ({ data, admin }) => {
	const [addUserToProject] = useAddUserToProjectMutation();

	return (
		<>
			{admin ? (
				<Popover placement="bottom-start">
					<PopoverTrigger>
						<Button
							ml={6}
							textAlign="center"
							background="#7209B7"
							color="#F8F9FA"
							cursor="pointer"
							mt={2}
							px={3}
							fontSize={14}
							borderRadius="md"
							_hover={{
								background: '#4D1175',
							}}
							height="28px"
						>
							Invite
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<PopoverHeader>Add a new User</PopoverHeader>
						<PopoverBody>
							<Formik
								initialValues={{ email: '' }}
								onSubmit={async (values) => {
									console.log(values);
									await addUserToProject({
										variables: {
											id: data.project!.id,
											email: values.email,
										},
										update: (
											cache,
											{ data: insertUserData }
										) => {
											cache.writeQuery<ProjectQuery>({
												query: ProjectDocument,
												data: {
													__typename: 'Query',
													project: {
														...data.project!,
														users: [
															...data!.project!
																.users,
															insertUserData!
																.addUserToProject!,
														],
													},
												},
											});
										},
									});
								}}
							>
								{({ isSubmitting }) => (
									<Form>
										<Box>
											<InputField
												name="email"
												placeholder="Email address"
												type="text"
											/>
										</Box>
										<Box
											mt="15rem"
											textAlign="center"
											w="100%"
										>
											<Button
												type="submit"
												isLoading={isSubmitting}
												w="100%"
											>
												Add User
											</Button>
										</Box>
									</Form>
								)}
							</Formik>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			) : null}
		</>
	);
};
