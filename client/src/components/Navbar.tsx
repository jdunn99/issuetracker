import React from 'react';
import { Box, Flex, Heading, Text, Button, Avatar } from '@chakra-ui/react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useUserQuery } from '../generated/graphql';
interface NavbarProps {
	overview?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ overview = false }) => {
	return (
		<Flex
			maxHeight="5vh"
			background="#F8F9FA"
			boxShadow={overview ? 'md' : ''}
			top={0}
			zIndex={5}
			p={overview ? 0 : '2rem'}
		>
			{overview ? <NavbarOverview /> : <NavbarStandard />}
		</Flex>
	);
};

const NavbarStandard: React.FC = () => {
	const { data, loading } = useUserQuery();

	return (
		<Flex mx="auto" w={1200} align="center" jusitfy="space-between">
			<Box>
				<Link to="/">
					<Heading fontFamily="Poppins" fontSize={20}>
						Issue Tracker
					</Heading>
				</Link>
			</Box>
			<Box ml="auto">
				<Flex align="center" justify="center">
					{data && data.user ? (
						<>
							<Link to="/">
								<Text mx={3} fontFamily="Poppins">
									Features
								</Text>
							</Link>

							<Link to="/profile">
								<Avatar size="sm" />
							</Link>
						</>
					) : (
						<>
							<Link to="/">
								<Text mx={3} fontFamily="Poppins">
									Features
								</Text>
							</Link>
							<Link to="/signin">
								<Text mx={3} fontFamily="Poppins">
									Sign In
								</Text>
							</Link>
							<Link to="/signup">
								<Button
									background="#7209B7"
									borderRadius={10}
									_hover={{ background: '#480972' }}
									mx={3}
									size="sm"
								>
									<Text
										color="#F8F9FA"
										fontFamily="Poppins"
										px={2}
									>
										Sign Up
									</Text>
								</Button>
							</Link>
						</>
					)}
				</Flex>
			</Box>
		</Flex>
	);
};

const NavbarOverview: React.FC = () => {
	return (
		<Flex mx="auto" align="center" jusitfy="space-between" w="90%" p={4}>
			<Box>
				<Link to="/">
					<Heading fontFamily="Poppins" fontSize={20}>
						Issue Tracker
					</Heading>
				</Link>
			</Box>
			<Box ml="auto">
				<Flex align="center">
					<Text mx={8} fontFamily="Poppins">
						Notifications
					</Text>

					<Avatar size="sm" />
				</Flex>
			</Box>
		</Flex>
	);
};