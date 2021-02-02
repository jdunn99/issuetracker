import {
	Box,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	Flex,
	Stack,
	Heading,
	Badge,
	Button,
	Grid,
	Table,
	Avatar,
	ModalCloseButton,
	useDisclosure,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import {
	useCreateCommentMutation,
	Severity,
	ProjectQuery,
	ProjectDocument,
} from '../../../generated/graphql';
import { DropdownField } from '../../DropdownField';
import { InputField } from '../../InputField';
import {
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from '../../Table';

interface OverlayProps {
	issueId: number | undefined;
	isOpen: boolean;
	onClose: () => void;
}

// TODO: ISSUE LAZY QUERY

export const Overlay: React.FC<OverlayProps> = ({
	issueId,
	isOpen,
	onClose,
}) => {
	const [createComment] = useCreateCommentMutation();

	// function MapSeverity() {
	// 	switch (issue.severity) {
	// 		case Severity.High:
	// 			return 'red';
	// 		case Severity.Medium:
	// 			return 'yellow';
	// 		case Severity.Low:
	// 			return 'green';
	// 	}
	// }
	return (
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
										{/* {issue.name} */}
									</Heading>

									<Badge
										mt={2}
										fontSize="md"
										// colorScheme={MapSeverity()}
									>
										{/* {issue.severity.toString()} */}
									</Badge>
								</Flex>
								<Text></Text>
							</Box>
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
							<Flex
								alignSelf="center"
								justifySelf="center"
								py={6}
							>
								<Table>
									<TableHead>
										<TableHeader>Status</TableHeader>
										<TableHeader>Created At</TableHeader>
										<TableHeader>Created By</TableHeader>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>
												<Box w={150}>
													<Formik
														initialValues={{
															data: '',
														}}
														onSubmit={() => {}}
													>
														<Form>
															<DropdownField name="severity">
																<option
																	value={0}
																>
																	To Do
																</option>
																<option
																	value={1}
																>
																	In Progress
																</option>
																<option
																	value={2}
																>
																	Review
																</option>
															</DropdownField>
														</Form>
													</Formik>
												</Box>
											</TableCell>
											<TableCell></TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Flex>
						</Stack>
						<Box my={6} w="30rem" mx="4rem">
							<Heading mb={4} size="md">
								Comments
							</Heading>
							<Stack mt={2} spacing={4}>
								{/* {issue.comments.map((comment: Comment) => (
										<Flex flexDir="column">
											<Flex
												align="center"
												justify="space-between"
												w="100%"
											>
												<Flex align="center">
													<Avatar size="sm" mr={4} />
													<Heading size="sm">
														{comment.postedBy.name}
													</Heading>
												</Flex>

												<Text
													opacity={0.8}
													fontSize="sm"
												>
													{new Date(
														comment.createdAt
													).toLocaleString()}
												</Text>
											</Flex>
											<Text>{comment.comment}</Text>
										</Flex>
									))} */}

								<Formik
									initialValues={{ content: '' }}
									onSubmit={async (
										values,
										{ setErrors }
									) => {}}
								>
									{({ isSubmitting }) => (
										<Form>
											<Box mt={8}>
												<InputField
													area
													name="content"
													placeholder="Comment description..."
												/>
											</Box>
											<Button
												background="#7209B7"
												type="submit"
												float="right"
												borderRadius={10}
												isLoading={isSubmitting}
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
									)}
								</Formik>
							</Stack>
						</Box>
					</Flex>
					<ModalCloseButton />
				</ModalContent>
			</Modal>
		</Box>
	);
};
