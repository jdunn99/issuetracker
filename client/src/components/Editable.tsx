import React, { InputHTMLAttributes } from "react";
import { Heading, Box, Text } from "@chakra-ui/react";
import "../App.css";

type EditableProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  value: string;
  icon?: string;
  area?: boolean;
  childRef: any;
};

export const Editable: React.FC<EditableProps> = ({
  label,
  area,
  childRef,
  icon,
  value,
  size: _,
  children,
  ...props
}) => {
  const [isEditing, setIsEditing] = React.useState<Boolean>(false);

  React.useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus();
    }
  }, [isEditing, childRef]);

  return (
    <Box {...props} mr={4} w="100%">
      {isEditing ? (
        <Box onBlur={() => setIsEditing(false)}>{children}</Box>
      ) : (
        <Box onClick={() => setIsEditing(true)}>
          {area ? (
            value.length === 0 ? (
              <Text>Edit description...</Text>
            ) : (
              <Text>{value}</Text>
            )
          ) : (
            <Heading mr={2} size="lg">
              {value}
            </Heading>
          )}
        </Box>
      )}
    </Box>
  );
};
