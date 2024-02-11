import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "../models/database";
import { User, NewUser } from "../models/user-model";

export const UserService = {
  users: async () => {
    // const result = await db
    //   .selectFrom("user")
    //   .leftJoin("project", "user.id", "project.creator_id")
    //   .selectAll()
    //   .execute();
    // const result = await sql<User[]>`
    // SELECT "user"."id", "project"."id" AS project_id FROM "user" LEFT JOIN "project" ON "user"."id" = "project"."creator_id";
    // `.execute(db);

    const result = await db
      .selectFrom("user")
      .selectAll("user")
      .select((eb) => [
        jsonArrayFrom(eb.selectFrom("project").selectAll()).as("projects"),
      ])
      .execute();
    console.log(result);
    return result;
  },
  user: async (id: number): Promise<User> => {
    return await db
      .selectFrom("user")
      .where("id", "=", id)
      .innerJoin("project", "creator_id", "id")
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
