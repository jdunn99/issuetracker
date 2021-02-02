import {
	useDisclosure,
	Text,
	Box,
	Flex,
	Heading,
	Table,
	Badge,
	Avatar,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { ProjectProps } from '../../util/types';
import { InputField } from '../InputField';
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
} from '../Table';
import { InsertModal } from './issues/InsertModal';
import { Overlay } from './issues/Overlay';

export const Issues: React.FC<ProjectProps> = ({ data, refetch }) => {
	const {
		isOpen: open,
		onOpen: setOpen,
		onClose: setClose,
	} = useDisclosure();
	const [id, setId] = React.useState<number>();

	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Overlay issueId={id} isOpen={isOpen} onClose={onClose} />
			<InsertModal
				data={data}
				open={open}
				setClose={setClose}
				refetch={refetch}
			/>
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
											{data!.project?.issues.length}
										</Badge>
									</TableHeader>
									<TableHeader>Severity</TableHeader>
									<TableHeader>Created At</TableHeader>
									<TableHeader>Created By</TableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								{data!.project?.issues.map((issue) => (
									<TableRow
										_hover={{
											background: '#eeeeee',
										}}
										borderBottom={
											'1px solid rgba(0,0,0,0.1)'
										}
										onClick={() => {
											setId(issue.id);
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
