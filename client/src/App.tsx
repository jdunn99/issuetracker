import React from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import {
	Box,
	Heading,
	Stack,
	Text,
	Flex,
	Button,
	Image,
	Grid,
} from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Login } from './routes/login';
import { signup } from './routes/signup';
import { Profile } from './routes/profile';
import { Project } from './routes/project';
import { useUserQuery } from './generated/graphql';

function Home() {
	const { data, loading } = useUserQuery();

	return (
		<div>
			<header>
				<Navbar />
			</header>
			<section id="hero-section">
				<Box mt="5rem" p={2}>
					<Box mx="auto" maxW={1200}>
						<div className="hero">
							<Header image="https://www.figma.com/file/syQNvs8hdYouZ33hJf4lIe/Untitled?node-id=111%3A4">
								<Stack
									spacing={8}
									pr={['0rem', '0rem', '0rem', '10rem']}
									mb={['4rem', '4rem', '4rem', '0rem']}
								>
									<Heading fontFamily="Poppins" size="2xl">
										Track your issues.
									</Heading>
									<Heading fontFamily="Poppins" fontSize={24}>
										The quick approach to problem solving.
									</Heading>
									<Box
										borderLeft={[
											'',
											'',
											'',
											'1px solid #7209B7',
										]}
										px={4}
									>
										<Text fontFamily="Poppins">
											Eliminate bugs from your code base.
											Develop solutions faster.
										</Text>
										<Text fontFamily="Poppins">
											Ensure a great user experience.
										</Text>
									</Box>
									<Link
										to={
											data && data.user
												? '/profile'
												: '/signin'
										}
									>
										<Button
											background="#7209B7"
											borderRadius={10}
											_hover={{ background: '#480972' }}
											px={8}
										>
											<Text
												color="#F8F9FA"
												fontFamily="Poppins"
											>
												Get Started
											</Text>
										</Button>
									</Link>
								</Stack>
							</Header>
						</div>

						<Flex
							mt="10rem"
							flexDir="column"
							align="center"
							textAlign="center"
						>
							<Heading fontFamily="Poppins" fontSize={24} mb={8}>
								The tool your team needs to tackle your issues.
							</Heading>
							<Box m="auto" maxW={600}>
								<Text fontFamily="Poppins">
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Ea fugit praesentium,
									alias doloremque qui minima vero asperiores.
								</Text>
							</Box>
						</Flex>
					</Box>
				</Box>
			</section>
			<Box my="8rem">
				<Features />
			</Box>
			<Box my="8rem">
				<Choose />
			</Box>
		</div>
	);
}

const Features = () => {
	return (
		<Box flex={1} m="auto" fontFamily="Poppins">
			<Box w="100%" mb={6}>
				<Flex
					flexDirection={['column', 'column', 'row', 'row']}
					mb="4rem"
					mx="auto"
					maxW={1200}
					p={4}
				>
					<Flex
						flexDir="column"
						justifyContent="center"
						w={['100%', '100%', '43%', '43%']}
					>
						<Heading
							fontFamily="Poppins"
							size="lg"
							lineHeight={1.5}
							mb={5}
							textAlign={['center', 'center', 'left', 'left']}
						>
							Quickly diagnose bugs.
						</Heading>
						<Text
							mt={2}
							mr={4}
							mb={10}
							textAlign={['center', 'center', 'left', 'left']}
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
						</Text>
					</Flex>

					<Flex
						alignItems="center"
						justifyContent={[
							'center',
							'center',
							'flex-end',
							'flex-end',
						]}
					>
						<Image
							width={['100%', '100%', '80%', '80%']}
							alt="placeholder"
						/>
					</Flex>
				</Flex>
			</Box>

			<Box w="100%" mb={6}>
				<Flex
					flexDirection={[
						'column-reverse',
						'column-reverse',
						'row',
						'row',
					]}
					mb="4rem"
					mx="auto"
					maxW={1200}
					p={4}
					pt="6rem"
				>
					<Flex
						alignItems="center"
						justifyContent={[
							'center',
							'center',
							'flex-start',
							'flex-start',
						]}
					>
						<Image
							width={['100%', '100%', '80%', '80%']}
							alt="placeholder"
						/>
					</Flex>
					<Flex
						flexDir="column"
						justifyContent="center"
						w={['100%', '100%', '43%', '43%']}
					>
						<Heading
							fontFamily="Poppins"
							size="lg"
							lineHeight={1.5}
							mb={5}
							textAlign={['center', 'center', 'left', 'left']}
						>
							Improve your workflow.
						</Heading>
						<Text
							mt={2}
							mr={4}
							fontSize="16px"
							mb={10}
							textAlign={['center', 'center', 'left', 'left']}
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
						</Text>
					</Flex>
				</Flex>
			</Box>
			<Box w="100%">
				<Flex
					flexDirection={['column', 'column', 'row', 'row']}
					mb="4rem"
					mx="auto"
					maxW={1200}
					p={4}
					pt="6rem"
				>
					<Flex
						flexDir="column"
						justifyContent="center"
						w={['100%', '100%', '43%', '43%']}
					>
						<Heading
							fontFamily="Poppins"
							size="lg"
							lineHeight={1.5}
							mb={5}
							textAlign={['center', 'center', 'left', 'left']}
						>
							Solve your problems.
						</Heading>
						<Text
							mt={2}
							mr={4}
							mb={10}
							textAlign={['center', 'center', 'left', 'left']}
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
						</Text>
					</Flex>

					<Flex
						alignItems="center"
						justifyContent={[
							'center',
							'center',
							'flex-end',
							'flex-end',
						]}
					>
						<Image
							width={['100%', '100%', '80%', '80%']}
							alt="placeholder"
						/>
					</Flex>
				</Flex>
			</Box>
		</Box>
	);
};

const Choose = () => {
	return (
		<Box flex={1} m="auto" maxW={1200} p={4} fontFamily="Poppins">
			<Heading
				textAlign="center"
				fontFamily="Poppins"
				fontSize={24}
				mb={8}
			>
				Why Choose Us?
			</Heading>
			<Grid templateColumns={['1fr', '1fr', 'repeat(3, 1fr)']}>
				<Stack mb="4rem">
					<Heading
						mt="2rem"
						size="md"
						textAlign={['center', 'center', 'left', 'left']}
						fontFamily="Poppins"
						color="#7209B7"
					>
						It's Free
					</Heading>
					<Text
						mt={2}
						color="gray.500"
						mr={4}
						textAlign={['center', 'center', 'left', 'left']}
					>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua.
					</Text>
				</Stack>

				<Stack mb="4rem">
					<Heading
						mt="2rem"
						color="#7209B7"
						size="md"
						textAlign={['center', 'center', 'left', 'left']}
						fontFamily="Poppins"
					>
						It's Easy to Use
					</Heading>
					<Text
						mt={2}
						color="gray.500"
						mr={4}
						fontFamily="Poppins"
						textAlign={['center', 'center', 'left', 'left']}
					>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua.
					</Text>
				</Stack>

				<Stack mb="2rem">
					<Heading
						mt="2rem"
						color="#7209B7"
						size="md"
						textAlign={['center', 'center', 'left', 'left']}
						fontFamily="Poppins"
					>
						It's Secure
					</Heading>
					<Text
						mt={2}
						color="gray.500"
						mr={4}
						fontFamily="Poppins"
						textAlign={['center', 'center', 'left', 'left']}
					>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua.
					</Text>
				</Stack>
			</Grid>
		</Box>
	);
};

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/signin" exact component={Login} />
				<Route path="/signup" exact component={signup} />
				<Route path="/profile" exact component={Profile} />
				<Route path="/project/:id" component={Project} />
			</Switch>
		</Router>
	);
}

export default App;
