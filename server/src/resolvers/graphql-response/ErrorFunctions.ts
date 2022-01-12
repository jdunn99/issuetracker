import { Error } from "../../entities/Error";

/** Common error functions */
interface Response {
  errors: Error[];
}

export const notLoggedIn = (): Response => {
  return {
    errors: [
      {
        field: "user",
        message: "Not signed in",
      },
    ],
  };
};

export const notFound = (field: string): Response => {
  return {
    errors: [
      {
        field,
        message: `${field} not found`,
      },
    ],
  };
};

export const notAuthorized = (): Response => {
  return {
    errors: [
      {
        field: "user",
        message: "Not authorized",
      },
    ],
  };
};
