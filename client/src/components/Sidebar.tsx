import React from 'react';
import { Box, Flex, Stack } from '@chakra-ui/react';

interface SidebarProps {
	background: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
	background,

	children,
}) => {
	return (
		<Box background={background} fontFamily="Poppins">
			<Flex
				flexDir="column"
				className="center-col"
				justify="space-between"
			>
				<Stack pt="5rem">{children}</Stack>
			</Flex>
		</Box>
	);
};
