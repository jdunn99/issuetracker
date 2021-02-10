import {
	Box,
	Modal,
	ModalOverlay,
	ModalContent,
	Flex,
	Stack,
	Heading,
	Badge,
	Button,
	Spinner,
	Table,
	ModalCloseButton,
	Select,
} from '@chakra-ui/react';
import React from 'react';
import {
	IssueDocument,
	IssueQuery,
	Severity,
	useIssueQuery,
	useUserQuery,
	useUpdateIssueMutation,
} from '../../../generated/graphql';
import {
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from '../../Table';
import { Editable } from '../../Editable';
import { Comment } from './Overlay/Comment';

interface OverlayProps {
	issueId: number;
	isOpen: boolean;
	onClose: () => void;
	admin: boolean;
}

// TODO: ISSUE LAZY QUERY

export const Overlay: React.FC<OverlayProps> = ({
	issueId,
	isOpen,
	admin,
	onClose,
}) => {
	const [updateIssue] = useUpdateIssueMutation();
	const { loading, data, refetch } = useIssueQuery({
		variables: { id: issueId },
	});
	const { data: dataUser } = useUserQuery();

	const [tempName, setTempName] = React.useState<string>('');
	const inputRef = React.useRef<any>();

	const [tempDesc, setTempDesc] = React.useState<string>('');
	const descRef = React.useRef<any>();

	const [tempStatus, setTempStatus] = React.useState<any>();

	function MapSeverity(): string {
		switch (data!.issue!.severity) {
			case Severity.Veryhigh:
				return 'red';
			case Severity.High:
				return 'orange';
			case Severity.Medium:
				return 'yellow';
			case Severity.Low:
				return 'green';
		}
	}

	async function close() {
		if (
			tempName === data!.issue.name &&
			tempDesc === data!.issue.desc &&
			tempStatus === undefined
		) {
			onClose();
			return;
		}

		console.log(tempStatus);

		await updateIssue({
			variables: {
				id: issueId,
				name: tempName,
				desc: tempDesc,
				status: parseFloat(tempStatus),
			},
			update: (cache, { data: issueResponseData }) => {
				if (!issueResponseData?.updateIssue.errors)
					cache.writeQuery<IssueQuery>({
						query: IssueDocument,
						data: {
							__typename: 'Query',
							issue: issueResponseData!.updateIssue!.issue!,
						},
					});
			},
		});

		onClose();
	}

	React.useEffect(() => {
		refetch();

		if (!isOpen) {
			// whenever we close the modal we will update whatever was opened if the user is an editor
		} else {
			if (data) {
				setTempName(data.issue.name);
				setTempDesc(data.issue.desc);
				setTempStatus(data.issue.status);
			}
		}
	}, [isOpen, refetch, data]);

	return (
		<Box fontFamily="Poppins">
			<Modal onClose={() => close()} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent
					fontFamily="Poppins"
					maxW={['25rem', '30rem', '40rem', '50rem']}
					className="modal-scroll"
				>
					<Flex flexDir="column" align="center" wrap="wrap">
						{loading || !data ? (
							<Flex
								w="100%"
								h="100vh"
								align="center"
								justify="center"
							>
								<Spinner />
							</Flex>
						) : (
							<>
								<Stack
									maxW={['20rem', '30rem', '30rem', '40rem']}
									spacing={4}
									mx="4rem"
								>
									<Box py={6}>
										<Flex py={3} align="center">
											{/* <Heading mr={2} size="lg">
												{data.issue.name}
											</Heading> */}
											{/* TODO: Make a function to check permissions - similar to back end implementation in resolvers */}
											<Editable
												childRef={inputRef}
												value={tempName}
											>
												<input
													name="test"
													placeholder={tempName}
													ref={inputRef}
													type="text"
													onChange={(e) =>
														setTempName(
															e.target.value
														)
													}
													className="editable-content-title"
												/>
											</Editable>
											<Badge
												mt={2}
												fontSize="md"
												colorScheme={MapSeverity()}
											>
												{data.issue.severity.toString()}
											</Badge>
										</Flex>
										<Editable
											childRef={descRef}
											value={tempDesc}
											type="textarea"
											area
										>
											<textarea
												style={{ width: '100%' }}
												placeholder={tempDesc}
												rows={5}
												ref={descRef}
												onChange={(e) =>
													setTempDesc(e.target.value)
												}
											/>
										</Editable>
									</Box>
									<>{console.log(data.issue.status)}</>
									<Box py={6}>
										<Heading mr={2} size="md">
											Linked Issues
										</Heading>
										{/* <Stack spacing={2} mt={2}>
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
									<Box textAlign="center">
										<Button rounded="50%">+</Button>
									</Box>
								</Stack> */}
										<Box textAlign="center">
											<Button size="sm" rounded="50%">
												+
											</Button>
										</Box>
									</Box>
									<Box py={6}>
										<Heading mr={2} size="md">
											Attachments
										</Heading>
										{/* <Grid
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
								</Grid> */}
										<Box textAlign="center">
											<Button size="sm" rounded="50%">
												+
											</Button>
										</Box>
									</Box>

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
														<Select
															variant="filled"
															background="#eeeeee"
															size="sm"
															color=""
															onChange={(e) =>
																setTempStatus(
																	e.target
																		.value
																)
															}
														>
															<option
																disabled={true}
																value=""
															>
																{
																	data.issue
																		.status
																}
															</option>
															<option value={0}>
																To Do
															</option>
															<option value={1}>
																In Progress
															</option>
															<option value={2}>
																Review
															</option>
														</Select>
													</Box>
												</TableCell>
												<TableCell>
													{new Date(
														data.issue.createdAt
													).toLocaleString()}
												</TableCell>
												<TableCell>
													{data.issue.createdBy.name}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									<Comment
										issueId={issueId}
										data={data}
										dataUser={dataUser!}
									/>
								</Stack>
							</>
						)}
					</Flex>
					<ModalCloseButton />
				</ModalContent>
			</Modal>
		</Box>
	);
};
