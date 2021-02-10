import {
	Box,
	Flex,
	Text,
	Heading,
	Table,
	Avatar,
	Button,
} from '@chakra-ui/react';
import React from 'react';
import {
	ProjectDocument,
	ProjectQuery,
	useRemoveUserFromProjectMutation,
} from '../../generated/graphql';
import { ProjectProps } from '../../util/types';
import { Search } from '../Search';
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
} from '../Table';
import { UserInsert } from './users/UserInsert';

type UserProps = ProjectProps & {
	admin: boolean;
};

export const Users: React.FC<UserProps> = ({ data, admin }) => {
	const [removeUserFromProject] = useRemoveUserFromProjectMutation();

	return (
		<Box mx="auto" w="90%">
			<Box
				mt="5rem"
				px={5}
				fontFamily="Poppins"
				className="profileComponent"
			>
				<Flex align="center" w="100%">
					<Flex align="center">
						<Heading mr={4} size="lg">
							{data!.project!.name}
						</Heading>
						<Search projectData={data} />

						<UserInsert admin={admin} data={data} />
					</Flex>
				</Flex>
				<Box m="auto" mt="3rem" boxShadow="md">
					<Table background="#fff">
						<TableHead background="#eeeeee">
							<TableRow>
								<TableHeader>Name</TableHeader>
								<TableHeader>Email</TableHeader>
								<TableHeader>Role</TableHeader>
								<TableHeader></TableHeader>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.project?.users.map((user) => (
								<TableRow
									_hover={{
										background: '#eeeeee',
									}}
									borderBottom={'1px solid rgba(0,0,0,0.1)'}
									cursor="pointer"
								>
									<TableCell>
										<Flex align="center">
											<Avatar size="sm" />
											<Text fontSize="sm" mx={2}>
												{user.user.name}
											</Text>
										</Flex>
									</TableCell>
									<TableCell>
										<Text fontSize="sm">
											{user.user.email}
										</Text>
									</TableCell>
									<TableCell>
										<Text fontSize="sm">
											{user.role.toString()}
										</Text>
									</TableCell>
									<TableCell>
										{admin ? (
											<Button
												onClick={async () => {
													await removeUserFromProject(
														{
															variables: {
																id: user.id,
															},
															update: (
																cache,
																{
																	data: removedUserData,
																}
															) => {
																cache.writeQuery<ProjectQuery>(
																	{
																		query: ProjectDocument,
																		data: {
																			__typename:
																				'Query',
																			project: {
																				...data!
																					.project!,
																				users: data!.project!.users.filter(
																					(
																						role
																					) => {
																						return (
																							role.id !==
																							user.id
																						);
																					}
																				),
																			},
																		},
																	}
																);
															},
														}
													);
												}}
											>
												x
											</Button>
										) : null}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</Box>
		</Box>
	);
};
