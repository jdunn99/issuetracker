import { Box, Flex, Text, Heading, Table, Avatar } from '@chakra-ui/react';
import React from 'react';
import { ProjectProps } from '../../util/types';
import { Search } from '../Search';
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
} from '../Table';

export const Users: React.FC<ProjectProps> = ({ data }) => {
	const [active, setActive] = React.useState<boolean>(false);
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

						<Box
							ml={6}
							textAlign="center"
							pt="6.5px"
							background="#7209B7"
							borderRadius="50%"
							color="#F8F9FA"
							width="35px"
							onMouseEnter={() => setActive(true)}
							onMouseLeave={() => setActive(false)}
							cursor="pointer"
							_hover={{
								background: '#4D1175',
							}}
							height="35px"
						>
							+
						</Box>
						<Box
							display={active ? 'block' : 'none'}
							className="fadeIn"
							mx={3}
						>
							<p>Add a new user</p>
						</Box>
					</Flex>
				</Flex>
				<Box m="auto" mt="3rem" boxShadow="md">
					<Table background="#fff">
						<TableHead background="#eeeeee">
							<TableRow>
								<TableHeader>Name</TableHeader>
								<TableHeader>Email</TableHeader>
								<TableHeader>Role</TableHeader>
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
											{user.user.id}
										</Text>
									</TableCell>
									<TableCell>
										<Text fontSize="sm">
											{user.role.toString()}
										</Text>
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
