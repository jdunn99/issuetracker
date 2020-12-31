import React from 'react';
import {
	Box,
	Flex,
	Button,
	Heading,
	Text,
	Grid,
	Avatar,
} from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../components/Table';
import { Sidebar } from '../components/Sidebar';
import { UserQuery, useUserQuery } from '../generated/graphql';
import { useHistory } from 'react-router-dom';
import { usePersistedState } from '../util/persistState';
import { Search } from '../components/Search';

interface profileProps {}

export const Profile: React.FC<profileProps> = () => {
	const [active, setActive] = usePersistedState('Dashboard', 'active');
	const { data, loading } = useUserQuery();

	function actionHandler() {
		switch (active) {
			case 'Dashboard':
				return <Dashboard data={data} />;

			case 'Projects':
				return <Projects data={data} />;
			case 'Issues':
				return <Issues data={data} />;
		}
	}

	return (
		<Box maxH="100vh" overflowY="hidden">
			<main>
				<Navbar overview />
				<Flex>
					<Sidebar background="#7209B7">
						<Box textAlign="center" px="5rem">
							<Button
								bg={
									active === 'Dashboard'
										? '#AF0EDE'
										: 'transparent'
								}
								color="white"
								_hover={{ background: '#AF0EDE' }}
								onClick={() => setActive('Dashboard')}
							>
								Dashboard
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Projects'
										? '#AF0EDE'
										: 'transparent'
								}
								color="white"
								_hover={{ background: '#AF0EDE' }}
								onClick={() => setActive('Projects')}
							>
								Projects
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Issues'
										? '#AF0EDE'
										: 'transparent'
								}
								color="white"
								_hover={{ background: '#AF0EDE' }}
								onClick={() => setActive('Issues')}
							>
								Issues
							</Button>
						</Box>
					</Sidebar>
					<Flex flexDir="column" className="right-col">
						{actionHandler()}
					</Flex>
				</Flex>
			</main>
		</Box>
	);
};

const Dashboard: React.FC<ProjectsProps> = ({ data }) => {
	return (
		<Box mt="5rem" px={5} fontFamily="Poppins" className="profileComponent">
			<Heading size="lg">Dashboard Overview</Heading>
			<Flex flexDir="column" mt="2rem">
				<Flex flexDir="row">
					<Grid templateColumns="repeat(2, 1fr)" gap={4}>
						<Box
							p={4}
							boxShadow=" 1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
							w={408}
							rounded="lg"
							h={207}
						>
							<Heading size="md">Total Issues Resolved</Heading>
						</Box>

						<Box
							p={4}
							boxShadow=" 1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
							w={408}
							rounded="lg"
							h={207}
						>
							<Heading size="md">Total Issues Resolved</Heading>
						</Box>
						<Box
							p={4}
							boxShadow=" 1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
							w={408}
							rounded="lg"
							h={207}
						>
							<Heading size="md">Total Issues Resolved</Heading>
						</Box>
						<Box
							p={4}
							boxShadow=" 1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
							w={408}
							rounded="lg"
							h={207}
						>
							<Heading size="md">Total Issues Resolved</Heading>
						</Box>
					</Grid>
					<Box
						ml={4}
						p={4}
						boxShadow=" 1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
						rounded="lg"
						w="100%"
					>
						<Heading size="md">Issues by Priority</Heading>
					</Box>
				</Flex>
				<Box
					mt={4}
					p={4}
					boxShadow=" 1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
					rounded="lg"
					w="100%"
					h={341}
					mb={8}
				>
					<Heading size="md">Top Active Issues</Heading>
				</Box>
			</Flex>
		</Box>
	);
};

interface ProjectsProps {
	data: UserQuery | undefined;
}

const Projects: React.FC<ProjectsProps> = ({ data }) => {
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
												`/project/${proj.project.id}`
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

const Issues: React.FC<ProjectsProps> = ({ data }) => {
	return (
		<Box mt="5rem" px={5} fontFamily="Poppins" className="profileComponent">
			<Heading size="lg">Issues Overview</Heading>
			{data?.user?.projects.map((proj) => (
				<Box my="3rem">
					<Text my={1}>{proj.project.name}</Text>
					<Box boxShadow="lg">
						<Table>
							<TableHead background="#eeeeee">
								<TableHeader>Name</TableHeader>
								<TableHeader>Level</TableHeader>
								<TableHeader>Status</TableHeader>
								<TableHeader>Created At</TableHeader>
								<TableHeader>Created By</TableHeader>
							</TableHead>
							<TableBody>
								{proj.project.issues.map((issue) => (
									<TableRow
										_hover={{
											background: '#eeeeee',
										}}
										cursor="pointer"
									>
										<TableCell>
											<Text>{issue.name}</Text>
										</TableCell>
										<TableCell>
											<Text>
												{issue.severity.toString()}
											</Text>
										</TableCell>
										<TableCell>
											<Text>
												{issue.status.toString()}
											</Text>
										</TableCell>
										<TableCell>
											<Text>
												{new Date(
													issue.createdAt.toString()
												).toLocaleString()}
											</Text>
										</TableCell>
										<TableCell>
											<Text>{issue.createdBy.name}</Text>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</Box>
			))}
		</Box>
	);
};
