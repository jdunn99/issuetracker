import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useUserQuery } from '../generated/graphql';
import { usePersistedState } from '../util/persistState';
import { Dashboard } from '../components/profile/Dashboard';
import { Projects } from '../components/profile/Projects';
import { Issues } from '../components/profile/Issues';

export const Profile: React.FC = () => {
	const [active, setActive] = usePersistedState('Dashboard', 'active');
	const { data, loading } = useUserQuery();

	function actionHandler() {
		switch (active) {
			case 'Dashboard':
				return <Dashboard data={data} />;

			case 'Projects':
				return <Projects data={data} />;
			case 'Issues':
				return <Issues data={data} />;
		}
	}

	return (
		<Box maxH="100vh" overflowY="hidden">
			<main>
				<Navbar overview />
				<Flex>
					<Sidebar background="#7209B7">
						<Box textAlign="center" px="5rem">
							<Button
								bg={
									active === 'Dashboard'
										? '#AF0EDE'
										: 'transparent'
								}
								color="white"
								_hover={{ background: '#AF0EDE' }}
								onClick={() => setActive('Dashboard')}
							>
								Dashboard
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Projects'
										? '#AF0EDE'
										: 'transparent'
								}
								color="white"
								_hover={{ background: '#AF0EDE' }}
								onClick={() => setActive('Projects')}
							>
								Projects
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Issues'
										? '#AF0EDE'
										: 'transparent'
								}
								color="white"
								_hover={{ background: '#AF0EDE' }}
								onClick={() => setActive('Issues')}
							>
								Issues
							</Button>
						</Box>
					</Sidebar>
					<Flex flexDir="column" className="right-col">
						{actionHandler()}
					</Flex>
				</Flex>
			</main>
		</Box>
	);
};
