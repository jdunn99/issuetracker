import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Icon,
  InputLeftElement,
  Textarea,
  InputProps,
} from "@chakra-ui/react";
import "../App.css";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  icon?: string;
  area?: boolean;
  background?: string;
  opacity?: number;
};

type Props = FieldProps & InputProps;

export const InputField: React.FC<Props> = ({
  label,
  area,
  icon,
  opacity,
  size: _,
  background,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl fontFamily="Poppins">
      {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
      <InputGroup>
        {icon ? <InputLeftElement children={<Icon name={icon} />} /> : null}
        {area ? (
          <Textarea
            background={background ? background : "#eeeeee"}
            {...field}
            id={field.name}
            fontSize="14px"
            opacity={0.8}
            rounded="none"
            disabled={props.disabled}
            fontWeight="medium"
            placeholder={props.placeholder!}
          />
        ) : (
          <Input
            background={background ? background : "#eeeeee"}
            size="sm"
            {...field}
            {...props}
            id={field.name}
          />
        )}
      </InputGroup>
      {error ? <small style={{ color: "red" }}>{error}</small> : null}
    </FormControl>
  );
};
