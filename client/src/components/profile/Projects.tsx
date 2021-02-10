import {
	Box,
	Flex,
	Heading,
	Button,
	Table,
	Avatar,
	Text,
} from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ProfileProps } from '../../util/types';
import { Search } from '../Search';
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
} from '../Table';

export const Projects: React.FC<ProfileProps> = ({ data }) => {
	const history = useHistory();

	return (
		<Box mt="5rem" px={5} fontFamily="Poppins" className="profileComponent">
			<Flex align="center" w="100%">
				<Flex align="center">
					<Heading size="lg">Projects</Heading>

					<Box mx={4}>
						<Search userData={data} />
					</Box>
				</Flex>
				<Box ml="auto">
					<Button
						background="#7209B7"
						type="submit"
						borderRadius={20}
						_hover={{ background: '#480972' }}
						color="#F8F9FA"
						size="sm"
						onClick={() => history.push('/project/create')}
					>
						Add Project
						<Box
							ml={2}
							p={1}
							background="#4D1175"
							borderRadius="50%"
							width={25}
						>
							+
						</Box>
					</Button>
				</Box>
			</Flex>
			<Box m="auto" pt="3rem">
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader>Name</TableHeader>
							<TableHeader>Desc</TableHeader>
							<TableHeader>Issues</TableHeader>
							<TableHeader>Owner</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{data && data.user
							? data.user.projects.map((proj) => (
									<TableRow
										_hover={{
											background: '#eeeeee',
										}}
										cursor="pointer"
										onClick={() =>
											history.push(
												`/project/${proj.project.id}/`
											)
										}
									>
										<TableCell>
											<Text
												fontSize="sm"
												fontWeight="bold"
											>
												{proj.project.name}
											</Text>
										</TableCell>
										<TableCell>
											<Text
												fontSize="sm"
												fontWeight="bold"
											>
												{proj.project.desc.substr(
													0,
													125
												)}
											</Text>
										</TableCell>
										<TableCell>
											<Text
												fontSize="sm"
												fontWeight="bold"
											>
												{proj.project.issues.length}
											</Text>
										</TableCell>
										<TableCell>
											<Flex align="center">
												<Avatar size="sm" />
												<Text fontSize="sm" mx={2}>
													{data.user!.email}
												</Text>
											</Flex>
										</TableCell>
									</TableRow>
							  ))
							: null}
					</TableBody>
				</Table>
			</Box>
		</Box>
	);
};
