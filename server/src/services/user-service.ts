import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "../models/database";
import {
  User,
  NewUser,
  UpdatedUser,
  UserConnection,
} from "../models/user-model";
import { Updateable, sql } from "kysely";
import { ConnectionArgs, DataWithError, FieldError } from "../models/types";
import UserController from "../controllers/user-controller";
import { ProjectConnection } from "../models/project-model";

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
};

export default UserService;
