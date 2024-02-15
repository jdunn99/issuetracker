import {
  NewUser,
  UpdatedUser,
  UserConnection,
  UserPayload,
} from "../models/user-model";
import { ConnectionArgs } from "../models/types";
import UserController from "../controllers/user-controller";
import bcrypt from "bcrypt";

/**
 * Defines the functions for handling request and response
 * logic to/from the graphql resolver
 */
const UserService = {
  /**
   * Calls user controller to return user from database matching the id
   * @param id - The requested user's ID
   */
  async user(id: number) {
    try {
      const result = UserController.getUserByID(id);

      if (typeof result === "undefined") {
        throw new Error("User not found");
      }

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  /**
   * @function
   * Retrieves a user given their email
   *
   * @param email - The requested unique email
   * @returns The resulting user
   */
  userByEmail(email: string) {
    try {
      return UserController.getUserByEmail(email);
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * @function
   * Retrieves a user given their username
   *
   * @param username - The requested unique username
   * @returns The resulting user
   */
  userByUsername(username: string) {
    try {
      return UserController.getUsersByUsername(username);
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * @async
   * @function
   * Retrieves users from database and converts into connection format
   *
   * @returns The requested users
   */
  async users({ first, after }: ConnectionArgs): Promise<UserConnection> {
    try {
      const data = await UserController.getUsers({ first, after });
      const edges = data.map((node) => ({
        cursor: node.id.toString(),
        node,
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  },

  /**
   * @async
   * @function
   * Registers a new user to IssueTracker.
   *
   * @param user - The requested new user's data
   * @returns - The newly generated user
   */
  async createUser(user: NewUser): Promise<UserPayload> {
    try {
      if (user.password.length < 6) {
        return {
          user: null,
          errors: [
            {
              message: "Password must be longer than 6 characters",
              field: ["create", "user", "password"],
            },
          ],
        };
      }

      // hash password. store hash in db
      const hashed = await bcrypt.hash(user.password, 10);
      const dbUser = await UserController.createUser({
        ...user,
        password: hashed,
      });

      return {
        user: dbUser,
        errors: [],
      };
    } catch (error) {
      // TODO: Error handling on mutation input

      console.error(error);
      return {
        errors: [
          {
            field: ["create", "user"],
            message: (error as any).toString(),
          },
        ],
        user: null,
      };
    }
  },

  async updateUser(user: UpdatedUser): Promise<UserPayload> {
    try {
      if (!user.id) {
        return {
          user: null,
          errors: [
            {
              field: ["update", "user", "id"],
              message: "Missing user Id",
            },
          ],
        };
      }

      let updatedPassword: string | undefined;

      if (user.password) {
        if (user.password.length < 6) {
          return {
            user: null,
            errors: [
              {
                field: ["update", "user", "password"],
                message: "Password must be longer than 6 characters",
              },
            ],
          };
        }

        updatedPassword = await bcrypt.hash(user.password, 10);
      }

      const updatedUser = await UserController.updateUser({
        password: updatedPassword,
        ...user,
      });

      return {
        user: updatedUser,
        errors: [],
      };
    } catch (error) {
      console.error(error);
      return {
        user: null,
        errors: [
          {
            field: ["update", "user"],
            message: (error as any).toString(),
          },
        ],
      };
    }
  },
};

export default UserService;
