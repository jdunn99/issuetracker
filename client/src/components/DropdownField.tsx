import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
	FormControl,
	FormLabel,
	Select,
	InputGroup,
	Icon,
	InputLeftElement,
} from '@chakra-ui/react';
import '../App.css';
type FieldProps = InputHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	name: string;
	icon?: string;
};

export const DropdownField: React.FC<FieldProps> = ({
	label,
	icon,
	size: _,
	children,
	...props
}) => {
	const [field, { error }] = useField(props);

	return (
		<FormControl fontFamily="Poppins">
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputGroup>
				{icon ? (
					<InputLeftElement children={<Icon name={icon} />} />
				) : null}
				<Select
					variant="filled"
					background="#eeeeee"
					size="sm"
					{...field}
					{...props}
					id={field.name}
					color=""
				>
					{children}
				</Select>
			</InputGroup>
			{error ? <small style={{ color: 'red' }}>{error}</small> : null}
		</FormControl>
	);
};
