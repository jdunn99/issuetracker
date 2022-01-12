import React from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { Error } from "../../generated/graphql";
import { sleep } from "../sleep";

export const useError = <T extends {}>(
  data: T | undefined,
  property: string,
  path?: string
) => {
  const history = useHistory();
  const toast = useToast();
  const [errors, setErrors] = React.useState<Error[]>([]);

  React.useEffect(() => {
    const helper = async () => {
      if (data) {
        if (
          data[property].errors &&
          errors.length < data[property].errors.length
        ) {
          for (const error of data[property].errors) {
            setErrors([...errors, error]);
            toast({
              title: "error",
              description: error.message,
              status: "error",
              isClosable: true,
            });
          }
          if (path) {
            await sleep(500);
            history.push(path);
          }
        }
      }
    };
    helper();
  }, [data, path, toast, history, property, errors]);

  return errors;
};
