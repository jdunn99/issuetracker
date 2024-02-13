import { db, getPaginatedResult } from "../models/database";
import { ConnectionArgs } from "../models/types";
import { User } from "../models/user-model";

/**
 * Defines the functions for retrieving user related entities from the database
 */
const UserController = {
  /**
   * @function
   * Return all users from the database
   *
   * @returns The retrieved users
   */
  getUsers({ first, after }: ConnectionArgs): Promise<User[]> {
    const query = getPaginatedResult("user", { first, after });
    return query.execute();
  },

  /**
   * @async
   * @function
   * Return a user by ID from the database
   *
   * @param id The requested user ID
   * @return The user given their ID
   */
  async getUserByID(id: number): Promise<User | undefined> {
    return await db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  },
};

export default UserController;
