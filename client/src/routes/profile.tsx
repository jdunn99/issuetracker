import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useUserQuery } from '../generated/graphql';
import { usePersistedState } from '../util/persistState';
import { Projects } from '../components/profile/Projects';
import { Issues } from '../components/profile/Issues';

export const Profile: React.FC = () => {
	window.localStorage.clear();
	const [active, setActive] = usePersistedState('Projects', 'active');
	const { data, loading } = useUserQuery();

	function actionHandler() {
		switch (active) {
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
						<Box textAlign="center" px="7rem"></Box>
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
