import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	Icon,
	InputLeftElement,
} from '@chakra-ui/react';
import '../App.css';
type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	name: string;
	icon?: string;
};

export const InputField: React.FC<FieldProps> = ({
	label,
	icon,
	size: _,
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
				<Input
					background="#eeeeee"
					rounded={10}
					{...field}
					{...props}
					id={field.name}
					color=""
				/>
			</InputGroup>
			{error ? <small style={{ color: 'red' }}>{error}</small> : null}
		</FormControl>
	);
};
