import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { User } from "../entities/User";
import { Context, Role } from "../types";
import {
  UserResponse,
  UserOverviewResponse,
  ProjectManagementResponse,
  UserProjectResponse,
} from "./graphql-response/Response";
import {
  userQuery,
  overviewQuery,
  usersQuery,
  userProjectsQuery,
  editQuery,
} from "./user/queries";
import {
  loginMutation,
  logoutMutation,
  registerMutation,
  updateMutation,
} from "./user/mutations";

@Resolver(() => User)
export class UserResolver {
  /************** QUERIES **************/

  // Used to check if the User is logged in.
  @Query(() => User, { nullable: true })
  async user(@Ctx() { req }: Context): Promise<User | null> {
    return userQuery(req.session.userId);
  }

  // Return metrics to Client.
  @Query(() => UserOverviewResponse)
  async getUserOverview(
    @Arg("limit", () => Int) limit: number,
    @Ctx() { req }: Context,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<UserOverviewResponse> {
    return overviewQuery(limit, req.session.userId, cursor);
  }

  // Used in searching for User(s).
  @Query(() => [User])
  async usersByQuery(
    @Arg("query") query: string,
    @Arg("limit") limit: number
  ): Promise<User[]> {
    return usersQuery(query, limit);
  }

  @Query(() => UserProjectResponse)
  async getUserProjects(
    @Ctx() { req }: Context,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<UserProjectResponse> {
    return userProjectsQuery(req.session.userId, cursor);
  }

  // Checks to see if the User has permission to edit a project.
  @Query(() => Role)
  async canEdit(@Arg("id") id: number, @Ctx() { req }: Context): Promise<Role> {
    return editQuery(id, req.session.userId);
  }

  /************** MUTATIONS **************/

  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name") name: string
  ): Promise<UserResponse> {
    return registerMutation(email, password, name);
  }

  @Mutation(() => ProjectManagementResponse)
  async updateUser(
    @Arg("projectId") projectId: number,
    @Arg("role") role: Role
  ): Promise<ProjectManagementResponse> {
    return updateMutation(projectId, role);
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ): Promise<UserResponse> {
    return loginMutation(email, password, ctx);
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context) {
    await logoutMutation(ctx);
  }
}
