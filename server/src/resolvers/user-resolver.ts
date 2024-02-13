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
  },
  User: {
    projects({ id }: User, { first, after }: ConnectionArgs) {
      return ProjectService.getProjectsByUserId(id, { first, after });
    },
  },
};

// const userResolver = {
//   Query: {
//     users: () => UserService.users(),
//     // user: async (_parent: Root, user: User, { req, res }: Context) => {
//     //   console.log(req, res);
//     //   return await UserService.user(user.id);
//     // },
//     // userById: async (_parent: Root, user: User) => {
//     //   return await UserService.user(user.id);
//     // },
//   },
//   Mutation: {
//     // createUser: async (_parent: Root, user: NewUser) => {
//     //   return await UserService.createUser(user);
//     // },
//     // updateUser: async (_parent: Root, { id, ...user }: any) => {
//     //   return await UserService.updateUser(id, user);
//     // },
//   },
//   User: {
//     projects: async (user: User, args: any) => {
//       return await ProjectService.getProjectsByUserId(user.id);
//     },
//   },
// };

export default UserResolver;
