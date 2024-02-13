import { NewUser, UserConnection } from "../models/user-model";
import { ConnectionArgs, DataWithError, FieldError } from "../models/types";
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

  async createUser(user: NewUser) {
    try {
      // hash password. store hash in db
      const hashed = await bcrypt.hash(user.password, 10);
      return UserController.createUser({ ...user, password: hashed });
    } catch (error) {
      // TODO: Error handling on mutation input
      console.error(error);
      return null;
    }
  },
};

export default UserService;
