import {
	Box,
	Heading,
	Stack,
	Flex,
	Avatar,
	Button,
	Text,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import {
	IssueQuery,
	IssueDocument,
	useDeleteCommentMutation,
	useCreateCommentMutation,
	UserQuery,
	useSendCommentSubscription,
} from '../../../../generated/graphql';
import { MapError } from '../../../../util/MapError';
import { InputField } from '../../../InputField';

interface CommentProps {
	dataUser: UserQuery;
	data: IssueQuery;
	issueId: number;
}

export const Comment: React.FC<CommentProps> = ({
	dataUser,
	data,
	issueId,
}) => {
	const [newComments, setNewComments] = React.useState<any>([]);
	const [deleteComment] = useDeleteCommentMutation();
	const [createComment] = useCreateCommentMutation();
	const { data: commentData } = useSendCommentSubscription();

	React.useEffect(() => {
		if (commentData)
			setNewComments((prev) => [...prev, commentData.sendComment]);
	}, [commentData]);

	const newComment = () => {
		return newComments.map((comment) => (
			<Flex flexDir="column">
				<Flex align="center" justify="space-between" w="100%">
					<Flex align="center">
						<Avatar size="sm" mr={4} />
						<Heading size="sm">{comment.postedBy.name}</Heading>
					</Flex>

					<Text opacity={0.8} fontSize="sm">
						{new Date(comment.createdAt).toLocaleString()}
					</Text>
				</Flex>
				<Flex align="center" justify="space-between">
					<Text>{comment.comment}</Text>
					{dataUser && dataUser!.user!.id === comment.postedBy.id ? (
						<Button
							size="xs"
							rounded="50%"
							onClick={async () => {
								await deleteComment({
									variables: {
										id: comment.sendComment.id,
									},
									update: (cache, { data: deletedData }) => {
										cache.writeQuery<IssueQuery>({
											query: IssueDocument,
											data: {
												__typename: 'Query',
												issue: {
													...data!.issue,
													comments: data!.issue.comments.filter(
														(com) => {
															return (
																com.id !==
																comment!.id
															);
														}
													),
												},
											},
										});
									},
								});
							}}
						>
							x
						</Button>
					) : null}
				</Flex>
			</Flex>
		));
	};

	return dataUser && data ? (
		<Box my={6} w="100%" mx="4rem">
			<Heading mb={4} size="md">
				Comments
			</Heading>
			<Stack mt={2} spacing={4}>
				{data.issue.comments.map((comment) => (
					<Flex flexDir="column" key={comment.id}>
						<Flex align="center" justify="space-between" w="100%">
							<Flex align="center">
								<Avatar size="sm" mr={4} />
								<Heading size="sm">
									{comment.postedBy.name}
								</Heading>
							</Flex>

							<Text opacity={0.8} fontSize="sm">
								{new Date(comment.createdAt).toLocaleString()}
							</Text>
						</Flex>
						<Flex align="center" justify="space-between">
							<Text>{comment.comment}</Text>
							{dataUser &&
							dataUser!.user!.id === comment.postedBy.id ? (
								<Button
									size="xs"
									rounded="50%"
									onClick={async () => {
										await deleteComment({
											variables: {
												id: comment.id,
											},
											update: (
												cache,
												{ data: commentData }
											) => {
												cache.writeQuery<IssueQuery>({
													query: IssueDocument,
													data: {
														__typename: 'Query',
														issue: {
															...data!.issue,
															comments: data!.issue.comments.filter(
																(com) => {
																	return (
																		com.id !==
																		comment.id
																	);
																}
															),
														},
													},
												});
											},
										});
									}}
								>
									x
								</Button>
							) : null}
						</Flex>
					</Flex>
				))}
				{newComment()}

				<Formik
					initialValues={{ content: '' }}
					onSubmit={async (values, { setErrors, resetForm }) => {
						const response = await createComment({
							variables: {
								issueId: issueId,
								content: values.content,
							},
						});

						if (response.data!.createComment !== null) {
							setErrors(MapError(response.data!.createComment!));
						} else {
							resetForm({
								values: { content: '' },
							});
						}
					}}
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
								my={4}
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
	) : null;
};
