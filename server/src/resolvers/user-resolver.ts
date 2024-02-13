import { Root } from "@apollo/protobufjs";
import { NewUser, UpdatedUser, User } from "../models/user-model";
import UserService from "../services/user-service";
import { Insertable } from "kysely";
import { Context } from "../models/database";
import ProjectService from "../services/project-service";
import { ConnectionArgs } from "../models/types";

interface UpdateUser {
  id: number;
  user: UpdatedUser;
}

/**
 * Defines resolver functions for GraphQL User schema.
 */
const UserResolver = {
  /**
   * Query functions
   */
  Query: {
    /**
     * @function
     * Retrieve a user by their ID
     *
     * @param id - The requested user ID
     */
    user(_parent: Root, { id }: User) {
      return UserService.user(id);
    },

    /**
     * @function
     * Retrieves all users
     */
    users(_parent: Root, { first, after }: ConnectionArgs) {
      return UserService.users({ first, after });
    },

    /**
     * @function
     * Resolves a user given their unique email
     */
    userByEmail(_parent: Root, { email }: User) {
      return UserService.userByEmail(email);
    },

    /**
     * @function
     * Resolves a user given their unique username
     */
    userByUsername(_parent: Root, { username }: User) {
      return UserService.userByUsername(username);
    },
  },
  User: {
    projects({ id }: User, { first, after }: ConnectionArgs) {
      return ProjectService.getProjectsByUserId(id, { first, after });
    },
  },
  Mutation: {
    createUser(_parent: Root, user: NewUser) {
      return UserService.createUser(user);
    },
  },
};

export default UserResolver;
