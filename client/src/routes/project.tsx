import React from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import {
	ProjectDocument,
	ProjectQuery,
	Severity,
	useProjectQuery,
	UserDocument,
	UserQuery,
	useCreateIssueMutation,
	useCreateProjectMutation,
	Exact,
	useUserQuery,
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
import { Search } from '../components/Search';
import { DropdownField } from '../components/DropdownField';
import { ApolloQueryResult } from '@apollo/client';

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
								`/project/${result.data.createProject.id}`
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

const Render: React.FC<projectProps> = ({ id }) => {
	const { data, loading, refetch } = useProjectQuery({
		variables: { id: parseInt(id!) },
		fetchPolicy: 'cache-first',
	});
	const [active, setActive] = usePersistedState('Issues', 'project-active');

	function actionHandler() {
		switch (active) {
			case 'Issues':
				return <Issues refetch={refetch} data={data!} />;
			case 'Users':
				return <Users refetch={refetch} data={data!} />;
			case 'Settings':
				return <Settings refetch={refetch} data={data!} />;
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
	refetch: (
		variables?:
			| Partial<
					Exact<{
						id: number;
					}>
			  >
			| undefined
	) => Promise<ApolloQueryResult<ProjectQuery>>;
	dataUser?: UserQuery;
}

const Issues: React.FC<ProjectProps> = ({ data, refetch }) => {
	const [issue, setIssue] = React.useState<any>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: open,
		onOpen: setOpen,
		onClose: setClose,
	} = useDisclosure();
	const [createIssue] = useCreateIssueMutation();

	const InsertModal = ({ refetch }) => {
		return (
			<Box fontFamily="Poppins">
				<Modal onClose={setClose} isOpen={open} isCentered>
					<ModalOverlay />
					<ModalContent fontFamily="Poppins" maxW="40rem">
						<Box m="auto" w="100%" maxW="25rem" p={4}>
							<Heading fontFamily="Poppins" size="md">
								Add new issue
							</Heading>
							<Formik
								initialValues={{
									name: '',
									desc: '',
									severity: 'Severity',
								}}
								onSubmit={async (values, { setErrors }) => {
									console.log(values);
									const response = await createIssue({
										variables: {
											name: values.name,
											desc: values.desc,
											severity: parseFloat(
												values.severity
											),
											projectId: data.project!.id,
										},
										update: (cache, { data: test }) => {
											cache.writeQuery<ProjectQuery>({
												query: ProjectDocument,
												data: {
													__typename: 'Query',
													project: {
														...data.project!,
														issues: [
															...data.project!
																.issues,
															test!.createIssue!,
														],
													},
												},
											});
										},
									});

									if (response) {
										refetch();
										setClose();
									}
								}}
							>
								{({ isSubmitting }) => (
									<Form>
										<Box mt={4}>
											<InputField
												name="name"
												placeholder="Name"
												label="Name"
												type="text"
											/>
										</Box>
										<Box mt={4}>
											<InputField
												name="desc"
												placeholder="Description"
												label="Description"
												type="desc"
											/>
										</Box>
										<Box mt={4}>
											<DropdownField
												name="severity"
												placeholder="Severity"
												label="Severity"
											>
												<option value={0}>Low</option>
												<option value={1}>
													Medium
												</option>
												<option value={2}>High</option>
												<option value={3}>
													Very High
												</option>
											</DropdownField>
										</Box>

										<Flex
											align="center"
											justify="flex-end"
											textAlign="center"
											mt={8}
										>
											<Button
												background="#7209B7"
												type="submit"
												isLoading={isSubmitting}
												borderRadius={10}
												_hover={{
													background: '#480972',
												}}
												color="#F8F9FA"
											>
												Create
											</Button>
											<Button
												background="transparent"
												onClick={setClose}
												borderRadius={10}
											>
												Cancel
											</Button>
										</Flex>
									</Form>
								)}
							</Formik>
						</Box>
						<ModalCloseButton />
					</ModalContent>
				</Modal>
			</Box>
		);
	};

	const Overlay = ({ issue }) => {
		function MapSeverity() {
			switch (issue.severity) {
				case Severity.High:
					return 'red';
				case Severity.Medium:
					return 'yellow';
				case Severity.Low:
					return 'green';
			}
		}

		return issue ? (
			<Box fontFamily="Poppins">
				<Modal onClose={onClose} isOpen={isOpen} isCentered>
					<ModalOverlay />
					<ModalContent
						fontFamily="Poppins"
						maxW="50rem"
						className="modal-scroll"
					>
						<Flex flexDir="column" align="center">
							<Stack maxW="30rem" spacing={4} mx="4rem">
								<Box py={6}>
									<Flex py={3} align="center">
										<Heading mr={2} size="lg">
											{issue.name}
										</Heading>

										<Badge
											mt={2}
											fontSize="md"
											colorScheme={MapSeverity()}
										>
											{issue.severity.toString()}
										</Badge>
									</Flex>
									<Text>{issue.desc}</Text>
								</Box>
								<Box py={6}>
									<Heading mr={2} size="md">
										Linked Issues
									</Heading>
									<Stack spacing={2} mt={2}>
										{/* */}
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
								<Flex
									alignSelf="center"
									justifySelf="center"
									py={6}
								>
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
													<Box w={150}>
														<Formik
															initialValues={{
																test: issue.status.toString(),
															}}
															onSubmit={() => {}}
														>
															<Form>
																<DropdownField name="severity">
																	<option
																		value={
																			0
																		}
																	>
																		To Do
																	</option>
																	<option
																		value={
																			1
																		}
																	>
																		In
																		Progress
																	</option>
																	<option
																		value={
																			2
																		}
																	>
																		Review
																	</option>
																</DropdownField>
															</Form>
														</Formik>
													</Box>
												</TableCell>
												<TableCell>
													<Text>
														{new Date(
															issue.createdAt.toString()
														).toLocaleString()}
													</Text>
												</TableCell>
												<TableCell>
													<Text>
														{issue.createdBy.name}
													</Text>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</Flex>
							</Stack>
							<Box my={6} w="30rem" mx="4rem">
								<Heading mb={4} size="md">
									Comments
								</Heading>
								<Stack mt={2} spacing={2}>
									<Flex flexDir="column">
										<Flex align="center">
											<Avatar size="sm" mr={4} />
											<Heading size="sm">
												Jack Dunn
											</Heading>
										</Flex>
										<Text>Comment description</Text>
									</Flex>
									<Formik
										initialValues={{ data: '' }}
										onSubmit={() => {}}
									>
										<Form>
											<Box mt={8}>
												<InputField
													area
													name="data"
													placeholder="Comment description..."
												/>
											</Box>
											<Button
												background="#7209B7"
												type="submit"
												float="right"
												borderRadius={10}
												mt={4}
												size="sm"
												_hover={{
													background: '#480972',
												}}
												color="#F8F9FA"
											>
												Comment
											</Button>
										</Form>
									</Formik>
								</Stack>
							</Box>
						</Flex>
						<ModalCloseButton />
					</ModalContent>
				</Modal>
			</Box>
		) : null;
	};

	return (
		<>
			<Overlay issue={issue} />
			<InsertModal refetch={refetch} />
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
						</Flex>
					</Flex>
					<Box m="auto" mt="3rem" boxShadow="md">
						<Table background="#fff">
							<TableHead background="#eeeeee">
								<TableRow>
									<TableHeader>
										Issues
										<Badge
											background="#4D1175"
											color="#F8F9FA"
											mx="2"
											rounded="xl"
										>
											{data.project?.issues.length}
										</Badge>
									</TableHeader>
									<TableHeader>Severity</TableHeader>
									<TableHeader>Created At</TableHeader>
									<TableHeader>Created By</TableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.project?.issues.map((issue) => (
									<TableRow
										_hover={{
											background: '#eeeeee',
										}}
										borderBottom={
											'1px solid rgba(0,0,0,0.1)'
										}
										onClick={() => {
											setIssue(issue);
											onOpen();
										}}
										cursor="pointer"
									>
										<TableCell>
											<Text
												fontSize="sm"
												fontWeight="bold"
											>
												{issue.name}
											</Text>
										</TableCell>
										<TableCell>
											<Text fontSize="sm">
												{issue.severity.toString()}
											</Text>
										</TableCell>
										<TableCell>
											<Text fontSize="sm">
												{new Date(
													issue.createdAt.toString()
												).toLocaleString()}
											</Text>
										</TableCell>
										<TableCell>
											<Text fontSize="sm">
												<Flex align="center">
													<Avatar size="sm" />
													<Text fontSize="sm" mx={2}>
														{issue.createdBy.name}
													</Text>
												</Flex>
											</Text>
										</TableCell>
									</TableRow>
								))}

								<TableRow
									_hover={{
										background: '#eeeeee',
									}}
									cursor="pointer"
									onClick={setOpen}
								>
									<TableCell>
										<Text>Add new issue +</Text>
									</TableCell>
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

const Users: React.FC<ProjectProps> = ({ data }) => {
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

const Settings: React.FC<ProjectProps> = ({ data, refetch }) => {
	return (
		<Box mx="auto" w="90%">
			<Box
				mt="5rem"
				px={5}
				fontFamily="Poppins"
				className="profileComponent"
			>
				<Heading size="lg">{data!.project!.name} Settings</Heading>
				<Box h="100%" m="auto" maxW="50%" mt="3rem">
					<Formik
						initialValues={{
							name: data!.project!.name,
							desc: data!.project!.desc,
						}}
						onSubmit={async (values) => {}}
					>
						<Form>
							<Box mt={8}>
								<InputField
									name="name"
									placeholder={data!.project!.name}
									label="Project Name"
									type="text"
								/>
							</Box>
							<Box mt={8}>
								<InputField
									name="desc"
									placeholder={data!.project!.desc}
									label="Project Description"
									type="text"
								/>
							</Box>
						</Form>
					</Formik>
				</Box>
			</Box>
		</Box>
	);
};
