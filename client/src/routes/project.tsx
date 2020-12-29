import React from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import {
	ProjectQuery,
	useProjectQuery,
	UserDocument,
	UserQuery,
} from '../generated/graphql';
import {
	Spinner,
	Box,
	Flex,
	Button,
	Heading,
	Text,
	Avatar,
	Badge,
	Grid,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Stack,
	Table,
	useDisclosure,
} from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { Formik, Form, Field } from 'formik';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import {
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from '../components/Table';
import { usePersistedState } from '../util/persistState';

interface projectProps {
	id: string | undefined;
}

export const Project = ({ match }: RouteComponentProps<projectProps>) => {
	return match.params.id === 'create' ? (
		<Create />
	) : match.params.id ? (
		<Render id={match.params.id} />
	) : null;
};

const Create: React.FC = () => {
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
						history.push('/profile');
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

const Render: React.FC<projectProps> = ({ id }) => {
	const { data, loading } = useProjectQuery({
		variables: { id: parseInt(id!) },
	});
	const [active, setActive] = usePersistedState('Issues', 'project-active');

	function actionHandler() {
		switch (active) {
			case 'Issues':
				return <Issues data={data!} />;
			default:
				return null;
		}
	}

	return loading && !data ? (
		<Spinner />
	) : (
		<Box>
			<main>
				<Navbar overview />
				<Flex>
					<Sidebar background="#7209B7">
						<Box textAlign="center">
							<Button
								bg="transparent"
								color="white"
								_hover={{ background: '#AF0EDE' }}
							></Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg="transparent"
								_hover={{ background: '#AF0EDE' }}
							></Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg="transparent"
								_hover={{ background: '#AF0EDE' }}
							></Button>
						</Box>
					</Sidebar>
					<Sidebar background="#EDEDED">
						<Box textAlign="center" mb={4}>
							<Heading size="lg">{data!.project!.name}</Heading>
						</Box>
						<Box textAlign="center" px="5rem">
							<Button
								bg={
									active === 'Issues'
										? '#DDDDDD'
										: 'transparent'
								}
								_hover={{ background: '#DDDDDD' }}
								onClick={() => setActive('Issues')}
							>
								Issues
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Users'
										? '#DDDDDD'
										: 'transparent'
								}
								_hover={{ background: '#DDDDDD' }}
								onClick={() => setActive('Users')}
							>
								Users
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Settings'
										? '#DDDDDD'
										: 'transparent'
								}
								_hover={{ background: '#DDDDDD' }}
								onClick={() => setActive('Settings')}
							>
								Settings
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

interface ProjectProps {
	data: ProjectQuery;
}

const Issues: React.FC<ProjectProps> = ({ data }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const Overlay: React.FC = () => {
		return (
			<Box fontFamily="Poppins">
				<Modal onClose={onClose} isOpen={isOpen} isCentered>
					<ModalOverlay />
					<ModalContent fontFamily="Poppins" maxW="60rem">
						<Flex>
							<Stack spacing={4} mx="4rem">
								<Box py={6}>
									<Flex py={3} align="center">
										<Heading mr={2} size="lg">
											Issue Name
										</Heading>
										<Badge
											mt={2}
											fontSize="md"
											colorScheme="yellow"
										>
											Medium
										</Badge>
									</Flex>
									<Text>Issue description...</Text>
								</Box>
								<Box py={6}>
									<Heading mr={2} size="md">
										Linked Issues
									</Heading>
									<Stack spacing={2} mt={2}>
										<Box
											p={2}
											w={420}
											border="1px solid rgba(0,0,0, 0.1)"
										>
											<Flex align="center">
												<Flex>
													<Badge
														colorScheme="red"
														fontSize="sm"
														rounded="lg"
													>
														High
													</Badge>
													<Heading size="sm" mx={3}>
														Linked Issue Name
													</Heading>
												</Flex>
												<Box ml="auto">
													<Badge
														fontSize="sm"
														rounded="lg"
													>
														To-Do
													</Badge>
												</Box>
											</Flex>
										</Box>
									</Stack>
								</Box>
								<Box py={6}>
									<Heading mr={2} size="md">
										Attachments
									</Heading>
									<Grid
										mt={2}
										templateColumns="repeat(3, 1fr)"
										gap={4}
									>
										<Box
											width={140}
											height={90}
											background="#C4C4C4"
										/>
										<Box
											width={140}
											height={90}
											background="#C4C4C4"
										/>
										<Box
											width={140}
											height={90}
											background="#C4C4C4"
										/>
									</Grid>
								</Box>
								<Box py={6}>
									<Table>
										<TableHead>
											<TableHeader>Status</TableHeader>
											<TableHeader>
												Created At
											</TableHeader>
											<TableHeader>
												Created By
											</TableHeader>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>
													<Badge
														fontSize="sm"
														rounded="lg"
													>
														To-Do
													</Badge>
												</TableCell>
												<TableCell>
													<Text>
														12/23/2020 9:01 PM
													</Text>
												</TableCell>
												<TableCell>
													<Text>Jack Dunn</Text>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</Box>
							</Stack>
							<Box pt="4rem">
								<Heading mr={2} size="md">
									Comments
								</Heading>
								<Stack mt={2} spacing={2}>
									<Flex align="center">
										<Avatar size="sm" mr={4} />
										<Flex flexDir="column">
											<Heading size="sm">
												Jack Dunn
											</Heading>
											<Text>Comment description</Text>
										</Flex>
									</Flex>
								</Stack>
							</Box>
						</Flex>
						<ModalCloseButton />
					</ModalContent>
				</Modal>
			</Box>
		);
	};

	return (
		<>
			<Overlay />
			<Box mx="auto" w="90%">
				<Box
					mt="5rem"
					px={5}
					fontFamily="Poppins"
					className="profileComponent"
				>
					<Flex align="center" w="100%">
						<Flex align="center">
							<Heading size="lg">{data!.project!.name}</Heading>

							<Box mx={4}>
								<Formik
									initialValues={{
										email: '',
										password: '',
									}}
									onSubmit={async (
										values,
										{ setErrors }
									) => {}}
								>
									<Form>
										<InputField
											type="text"
											name="text"
											placeholder="Search"
										/>
									</Form>
								</Formik>
							</Box>

							<Box
								ml={2}
								textAlign="center"
								pt="6.5px"
								background="#7209B7"
								borderRadius="50%"
								color="#F8F9FA"
								width="35px"
								cursor="pointer"
								_hover={{
									background: '#4D1175',
								}}
								height="35px"
							>
								+
							</Box>
						</Flex>
					</Flex>
					<Box m="auto" mt="3rem" boxShadow="md">
						<Table background="#fff">
							<TableHead background="#eeeeee">
								<TableRow>
									<TableHeader>
										Not Started
										<Badge
											background="#4D1175"
											color="#F8F9FA"
											mx="2"
											rounded="xl"
										>
											1
										</Badge>
									</TableHeader>
									<TableHeader>Severity</TableHeader>
									<TableHeader>Reproducable</TableHeader>
									<TableHeader>Created At</TableHeader>
									<TableHeader>Created By</TableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow
									_hover={{
										background: '#eeeeee',
									}}
									borderBottom={'1px solid rgba(0,0,0,0.1)'}
									onClick={onOpen}
									cursor="pointer"
								>
									<TableCell>
										<Text fontSize="sm" fontWeight="bold">
											Issue 1
										</Text>
									</TableCell>
									<TableCell>
										<Text fontSize="sm">Medium</Text>
									</TableCell>
									<TableCell>
										<Text fontSize="sm">Sometimes</Text>
									</TableCell>
									<TableCell>
										<Text fontSize="sm">
											12/23/2020 10:41 PM
										</Text>
									</TableCell>
									<TableCell>
										<Flex align="center">
											<Avatar size="sm" />
											<Text fontSize="sm" mx={2}>
												Jack Dunn
											</Text>
										</Flex>
									</TableCell>
								</TableRow>

								<TableRow
									_hover={{
										background: '#eeeeee',
									}}
									cursor="pointer"
								>
									<TableCell>
										<Text>Add new issue +</Text>
									</TableCell>
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
								</TableRow>
							</TableBody>
						</Table>
					</Box>
				</Box>
			</Box>
		</>
	);
};
