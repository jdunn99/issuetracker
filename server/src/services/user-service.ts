import { db } from "../models/database";
import { User, NewUser } from "../models/user-model";

export const UserService = {
  users: async () => {
    const result = await db.selectFrom("user").selectAll().execute();
    return result;
  },
  user: async (id: number): Promise<User> => {
    return await db
      .selectFrom("user")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  },
  createUser: async (user: NewUser): Promise<User> => {
    return await db
      .insertInto("user")
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
};

export default UserService;
