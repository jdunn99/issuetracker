import { Box, Heading, Flex, Grid, Spinner } from '@chakra-ui/react';
import React from 'react';
import { ProfileProps } from '../../util/types';

export const Dashboard: React.FC<ProfileProps> = ({ data }) => {
	return data && data.user ? (
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
							h={307}
						>
							<Heading size="md">Issues by Project</Heading>
							<Flex
								h="90%"
								align="center"
								justify="center"
							></Flex>
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
	) : (
		<Spinner />
	);
};
