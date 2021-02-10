import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Role, useProjectQuery, useUserQuery } from '../generated/graphql';
import { Spinner, Box, Flex, Button, Heading } from '@chakra-ui/react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Issues } from '../components/project/Issues';
import { Create } from '../components/project/Create';
import { Users } from '../components/project/Users';
import { Settings } from '../components/project/Settings';

interface RouteProps {
	id: string | undefined;
}

export const Project = ({ match }: RouteComponentProps<RouteProps>) => {
	return match.params.id === 'create' ? (
		<Create />
	) : match.params.id ? (
		<Render id={match.params.id} />
	) : null;
};

const Render: React.FC<RouteProps> = ({ id }) => {
	const { data, loading, refetch } = useProjectQuery({
		variables: { id: parseInt(id!) },
	});
	const [admin, setAdmin] = React.useState<boolean>(false);
	const { data: dataUser } = useUserQuery();
	const [active, setActive] = React.useState<string>('Issues');

	function actionHandler() {
		switch (active) {
			case 'Issues':
				return <Issues admin={admin} data={data!} refetch={refetch} />;
			case 'Users':
				return <Users refetch={refetch} admin={admin} data={data!} />;
			case 'Settings':
				return <Settings refetch={refetch} data={data!} />;
			default:
				return null;
		}
	}

	React.useEffect(() => {
		if (dataUser)
			if (dataUser.user) {
				const temp = data!.project!.users.filter((projectRole) => {
					return (
						projectRole.user.id === dataUser!.user!.id &&
						(projectRole.role === Role.Admin ||
							projectRole.role === Role.Editor)
					);
				});
				if (temp.length > 0) setAdmin(true);
			}
	}, [data, dataUser]);

	return loading && !data ? (
		<Flex w="100%" h="100vh" align="center" justify="center">
			<Spinner />
		</Flex>
	) : (
		<Box>
			<main>
				<Navbar overview />
				<Flex>
					{/* <Sidebar background="#7209B7">
						<Box textAlign="center">
							<Button
								bg="transparent"
								color="white"
								_hover={{ background: '#AF0EDE' }}
							></Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg="transparent"
								_hover={{ background: '#AF0EDE' }}
							></Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg="transparent"
								_hover={{ background: '#AF0EDE' }}
							></Button>
						</Box>
					</Sidebar> */}
					<Sidebar background="#EDEDED">
						<Box textAlign="center" px="5rem">
							<Button
								bg={
									active === 'Issues'
										? '#DDDDDD'
										: 'transparent'
								}
								_hover={{ background: '#DDDDDD' }}
								onClick={() => setActive('Issues')}
							>
								Issues
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Users'
										? '#DDDDDD'
										: 'transparent'
								}
								_hover={{ background: '#DDDDDD' }}
								onClick={() => setActive('Users')}
							>
								Users
							</Button>
						</Box>
						<Box textAlign="center" p={1}>
							<Button
								bg={
									active === 'Settings'
										? '#DDDDDD'
										: 'transparent'
								}
								_hover={{ background: '#DDDDDD' }}
								onClick={() => setActive('Settings')}
							>
								Settings
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
