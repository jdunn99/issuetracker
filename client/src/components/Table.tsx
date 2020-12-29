import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

export function Table(props: BoxProps) {
	return (
		<Box mb={5} overflow="hidden">
			<Box as="table" width="full" {...props} />
		</Box>
	);
}

export function TableHead(props: BoxProps) {
	return <Box as="thead" {...props} />;
}

export function TableRow(props: BoxProps) {
	return <Box as="tr" {...props} />;
}

export function TableHeader(props: BoxProps) {
	return (
		<Box
			as="th"
			px="6"
			py="3"
			borderBottomWidth="1px"
			textAlign="left"
			fontSize="xs"
			textTransform="uppercase"
			letterSpacing="wider"
			lineHeight="1rem"
			fontWeight="medium"
			{...props}
		/>
	);
}

export function TableBody(props: BoxProps) {
	return <Box as="tbody" {...props} />;
}

export function TableCell(props: BoxProps) {
	return (
		<Box
			as="td"
			px="6"
			py="4"
			lineHeight="1.25rem"
			whiteSpace="nowrap"
			{...props}
		/>
	);
}
