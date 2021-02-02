import { ApolloQueryResult } from '@apollo/client';
import {
	Box,
	Modal,
	ModalOverlay,
	ModalContent,
	Heading,
	Flex,
	Button,
	ModalCloseButton,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import {
	ProjectQuery,
	ProjectDocument,
	Exact,
	useCreateIssueMutation,
} from '../../../generated/graphql';
import { DropdownField } from '../../DropdownField';
import { InputField } from '../../InputField';

interface InsertModalProps {
	data: ProjectQuery | undefined;
	refetch: (
		variables?:
			| Partial<
					Exact<{
						id: number;
					}>
			  >
			| undefined
	) => Promise<ApolloQueryResult<ProjectQuery>>;
	setClose: () => void;
	open: boolean;
}

export const InsertModal: React.FC<InsertModalProps> = ({
	data,
	refetch,
	setClose,
	open,
}) => {
	const [createIssue] = useCreateIssueMutation();

	return data ? (
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
										severity: parseFloat(values.severity),
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
														...data.project!.issues,
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
											<option value={1}>Medium</option>
											<option value={2}>High</option>
											<option value={3}>Very High</option>
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
	) : null;
};
