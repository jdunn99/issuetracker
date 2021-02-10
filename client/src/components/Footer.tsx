import { Flex, Link, Heading, Box } from '@chakra-ui/react';
import React from 'react';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
	return (
		<Flex
			zIndex={1}
			top={0}
			p={2}
			background="rgb(26,32,44)"
			fontFamily="Poppins"
		>
			<Flex flex={1} m="auto" align="center" maxW={1600}>
				<Link>
					<Heading as="h3" size="lg" color="rgb(249,249,250)">
						Slotfocus
					</Heading>
				</Link>
				<Box ml={'auto'}></Box>
			</Flex>
		</Flex>
	);
};
