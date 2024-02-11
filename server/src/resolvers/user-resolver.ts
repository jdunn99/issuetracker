import { Root } from "@apollo/protobufjs";
import { NewUser, User } from "../models/user-model";
import UserService from "../services/user-service";
import { Insertable } from "kysely";

const userResolver = {
  Query: {
    users: () => UserService.users(),
    user: async (id: number) => {
      return await UserService.user(id);
    },
  },
  Mutation: {
    createUser: async (_parent: Root, user: NewUser) => {
      return await UserService.createUser(user);
    },
  },
};

export default userResolver;
