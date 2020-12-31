import {
	Resolver,
	Query,
	Mutation,
	Arg,
	ObjectType,
	Field,
	Ctx,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import { Context, Role } from '../types';

const SALT_FACTOR = 10;

@ObjectType()
class Error {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [Error], { nullable: true })
	errors?: Error[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver(() => User)
export class UserResolver {
	@Query(() => User, { nullable: true })
	async user(@Ctx() { req }: Context): Promise<User | null> {
		if (!req.session.userId) return null;

		return (await getRepository(User).findOne({
			where: { id: req.session.userId },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					projects: 'user.projects',
					project: 'projects.project',
					issues: 'project.issues',
					createdBy: 'issues.createdBy',
				},
			},
		})) as User;
	}

	/*
	 * @desc: Gets all users from the database
	 * @params:
	 * @returns: [Users]
	 */
	@Query(() => [User])
	async users(): Promise<User[]> {
		return await getRepository(User).find({
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					projects: 'user.projects',
					project: 'projects.project',
					issues: 'project.issues',
					createdBy: 'issues.createdBy',
				},
			},
		});
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Arg('name') name: string,
		@Arg('role', () => Role) role: Role,
		@Arg('organization', { nullable: true }) organization?: string
	): Promise<UserResponse> {
		// Check if email exists
		if (await getRepository(User).findOne({ email: email })) {
			return {
				errors: [
					{
						field: 'email',
						message: 'Email already exists',
					},
				],
			};
		}

		console.log(role);

		// Check the password to see if it is strong enough
		if (password.length < 6) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Password is too short',
					},
				],
			};
		} else if (password.search(/\d/) === -1) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Password must contain at least 1 number',
					},
				],
			};
		}

		const hashed = bcrypt.hashSync(password, SALT_FACTOR);
		let newUser = new User();
		newUser.email = email;
		newUser.password = hashed;
		newUser.name = name;
		if (organization) newUser.organization = organization;
		newUser.role = role;
		newUser.projects = [];
		newUser.issues = [];

		await getRepository(User).save(newUser);

		return {
			user: newUser,
		};
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { req }: Context
	): Promise<UserResponse> {
		const checkedUser = (await getRepository(User).findOne({
			where: { email: email },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					projects: 'user.projects',
					project: 'projects.project',
					issues: 'project.issues',
					createdBy: 'issues.createdBy',
				},
			},
		})) as User;
		if (!checkedUser)
			return {
				errors: [
					{
						field: 'email',
						message: 'Email is invalid',
					},
				],
			};
		if (!bcrypt.compareSync(password, checkedUser.password)) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Password is invalid',
					},
				],
			};
		}

		console.log(checkedUser.id);

		req.session.userId = checkedUser.id;

		return {
			user: checkedUser,
		};
	}

	@Mutation(() => UserResponse)
	async changePermissions(
		@Arg('userId') userId: number,
		@Arg('role', () => Role) role: Role,
		@Ctx() { req }: Context
	): Promise<UserResponse> {
		if (!req.session.userId)
			return {
				errors: [
					{
						field: '',
						message: 'Not signed in',
					},
				],
			};

		const toBeChanged = await getRepository(User).findOne({ id: userId });

		if (!toBeChanged)
			return {
				errors: [
					{
						field: 'user',
						message: 'User does not exist',
					},
				],
			};

		toBeChanged.role = role;
		await getRepository(User).save(toBeChanged);

		return {
			user: toBeChanged,
		};
	}

	@Mutation(() => Boolean)
	async deleteUsers(): Promise<boolean> {
		await getRepository(User).delete({});
		return true;
	}
}
