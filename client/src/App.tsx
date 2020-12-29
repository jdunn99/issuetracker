import React from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Box, Heading, Stack, Text, Flex, Button } from '@chakra-ui/react';
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
												: '/login'
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
		</div>
	);
}

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
