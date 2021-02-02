import { Box, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { ProjectProps } from '../../util/types';
import { InputField } from '../InputField';

export const Settings: React.FC<ProjectProps> = ({ data, refetch }) => {
	return (
		<Box mx="auto" w="90%">
			<Box
				mt="5rem"
				px={5}
				fontFamily="Poppins"
				className="profileComponent"
			>
				<Heading size="lg">{data!.project!.name} Settings</Heading>
				<Box h="100%" m="auto" maxW="50%" mt="3rem">
					<Formik
						initialValues={{
							name: data!.project!.name,
							desc: data!.project!.desc,
						}}
						onSubmit={async (values) => {}}
					>
						<Form>
							<Box mt={8}>
								<InputField
									name="name"
									placeholder={data!.project!.name}
									label="Project Name"
									type="text"
								/>
							</Box>
							<Box mt={8}>
								<InputField
									name="desc"
									placeholder={data!.project!.desc}
									label="Project Description"
									type="text"
								/>
							</Box>
						</Form>
					</Formik>
				</Box>
			</Box>
		</Box>
	);
};
