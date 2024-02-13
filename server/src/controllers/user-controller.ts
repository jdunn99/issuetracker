import { db, getPaginatedResult } from "../models/database";
import { ConnectionArgs } from "../models/types";
import { NewUser, User } from "../models/user-model";

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
   * @function
   * Return a user by ID from the database
   *
   * @param id The requested user ID
   * @return The user given their ID
   */
  getUserByID(id: number): Promise<User | undefined> {
    return db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  },

  /**
   * @function
   * Retrieves a user given their UNIQUE email
   */
  getUserByEmail(email: string): Promise<User> {
    return db
      .selectFrom("user")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirstOrThrow();
  },

  /**
   * @function
   * Retrieves a user given their unique username
   *
   * @param username - The requested user's username
   * @returns The resulting user
   */
  getUsersByUsername(username: string): Promise<User> {
    return db
      .selectFrom("user")
      .selectAll()
      .where("username", "=", username)
      .executeTakeFirstOrThrow();
  },

  /**
   * @function
   * Register a new user into the database
   *
   * @param user The requested user being created
   * @returns The newly created user
   */
  createUser(user: NewUser): Promise<User> {
    return db
      .insertInto("user")
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
};

export default UserController;
