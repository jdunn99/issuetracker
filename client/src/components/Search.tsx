import { Box, Stack, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { ProjectQuery, UserQuery } from '../generated/graphql';
import { InputField } from './InputField';

interface SearchProps {
	projectData?: ProjectQuery;
	userData?: UserQuery;
}

export const Search: React.FC<SearchProps> = ({ projectData, userData }) => {
	const [query, setQuery] = React.useState<string>('');
	const [result, setResult] = React.useState<any>([]);
	const [active, setActive] = React.useState<boolean>(false);

	const Suggestion = ({ result, setQuery }) => {
		function actionHandler() {
			if (projectData)
				return result.map((user) => (
					<Box
						key={user.id}
						p={2}
						cursor="pointer"
						_hover={{ background: '#DDDDDD' }}
						onClick={() => {
							setQuery(user.user.name);
						}}
					>
						<Text fontFamily="Poppins">{user.user.name}</Text>
					</Box>
				));

			if (userData)
				return result.map((proj) => (
					<Box
						key={proj.id}
						p={2}
						cursor="pointer"
						_hover={{ background: '#DDDDDD' }}
						onClick={() => {
							setQuery(proj.project.name);
						}}
					>
						<Text fontFamily="Poppins">{proj.project.name}</Text>
					</Box>
				));
		}

		return (
			<Box>
				<Stack>{actionHandler()}</Stack>
			</Box>
		);
	};

	React.useEffect(() => {
		if (projectData)
			setResult(
				projectData.project?.users.filter((user) =>
					user.user.name.toLowerCase().includes(query.toLowerCase())
				)
			);
		if (userData)
			setResult(
				userData.user?.projects.filter((proj) =>
					proj.project.name
						.toLowerCase()
						.includes(query.toLowerCase())
				)
			);
	}, [query, projectData, userData]);

	console.log(query);

	return (
		<>
			<Formik
				initialValues={{
					email: '',
					password: '',
				}}
				onSubmit={async (values, { setErrors }) => {}}
			>
				<Form autoComplete="off">
					<InputField
						onBlur={() => setTimeout(() => setActive(false), 100)}
						type="text"
						name="text"
						value={query}
						placeholder="Search"
						style={
							active && result.length > 0
								? { marginTop: '2.5rem' }
								: { marginTop: '0' }
						}
						onChange={(e) => {
							setQuery(e.target.value);
							setActive(true);
						}}
					/>

					{active ? (
						<Box className="fadeIn" background="#EDEDED">
							<Suggestion
								setQuery={(q: string) => setQuery(q)}
								result={result}
							/>
						</Box>
					) : null}
				</Form>
			</Formik>
		</>
	);
};
