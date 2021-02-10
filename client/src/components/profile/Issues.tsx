import { Box, Heading, Table, Text } from '@chakra-ui/react';
import React from 'react';
import { ProfileProps } from '../../util/types';
import {
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from '../Table';
import { useHistory } from 'react-router';

export const Issues: React.FC<ProfileProps> = ({ data }) => {
	const history = useHistory();

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
										key={issue.id}
										cursor="pointer"
										onClick={() => {
											history.push(
												`/project/${proj.project.id}/${issue.id}`
											);
										}}
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
