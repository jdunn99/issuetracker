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
import { useLocation, useHistory } from 'react-router';
import { useSendIssueSubscription } from '../../generated/graphql';

type IssueProps = ProjectProps & {
	admin: boolean;
};

export const Issues: React.FC<IssueProps> = ({ data, refetch, admin }) => {
	const {
		isOpen: open,
		onOpen: setOpen,
		onClose: setClose,
	} = useDisclosure();
	const [id, setId] = React.useState<number>(-1);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const location = useLocation();
	const history = useHistory();
	const [flag, setFlag] = React.useState(true);

	const [newData, setNewData] = React.useState<any>([]);
	const {
		data: newIssues,
		loading: newIssuesLoading,
	} = useSendIssueSubscription();

	React.useEffect(() => {
		let issueMatch = new RegExp('([^/]+$)').exec(location.pathname);
		if (issueMatch && !isOpen && flag) {
			// if we have an issue matched we then open the issue overlay
			setId(parseInt(issueMatch[0]));
			onOpen();
			history.replace(location.pathname.replace(/([^/]+$)/gm, ''));

			setFlag(false);
		}
	}, [location.pathname, history, isOpen, onOpen, flag]);

	React.useEffect(() => {
		if (newIssues) setNewData((prev) => [...prev, newIssues.sendIssue]);
	}, [newIssues]);

	const NewIssueHandler = () => {
		return newData.map((issue) => (
			<TableRow
				_hover={{
					background: '#eeeeee',
				}}
				borderBottom={'1px solid rgba(0,0,0,0.1)'}
				onClick={() => {
					setId(issue.id);
					onOpen();
				}}
				cursor="pointer"
			>
				<TableCell>
					<Text fontSize="sm" fontWeight="bold">
						{issue.name}
					</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="sm">{issue.severity.toString()}</Text>
				</TableCell>
				<TableCell>
					<Text fontSize="sm">
						{new Date(issue.createdAt.toString()).toLocaleString()}
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
		));
	};

	return (
		<>
			<Overlay
				admin={admin}
				issueId={id}
				isOpen={isOpen}
				onClose={onClose}
			/>
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
											{data!.project?.issues.length +
												newData.length}
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
								{NewIssueHandler()}
								{admin ? (
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
								) : null}
							</TableBody>
						</Table>
					</Box>
				</Box>
			</Box>
		</>
	);
};
