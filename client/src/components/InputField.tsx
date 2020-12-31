import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	Icon,
	InputLeftElement,
	Textarea,
} from '@chakra-ui/react';
import '../App.css';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	name: string;
	icon?: string;
	area?: boolean;
};

export const InputField: React.FC<FieldProps> = ({
	label,
	area,
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
				{area ? (
					<Textarea
						{...field}
						id={field.name}
						placeholder={props.placeholder}
					/>
				) : (
					<Input
						background="#eeeeee"
						size="sm"
						{...field}
						{...props}
						id={field.name}
					/>
				)}
			</InputGroup>
			{error ? <small style={{ color: 'red' }}>{error}</small> : null}
		</FormControl>
	);
};
