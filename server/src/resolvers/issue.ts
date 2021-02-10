import { Severity, Status, Context, Role } from '../types';
import {
	Resolver,
	Query,
	Mutation,
	Arg,
	Ctx,
	ObjectType,
	Field,
	Root,
	Subscription,
	PubSub,
} from 'type-graphql';
import { getRepository, getConnection } from 'typeorm';
import { Issue } from '../entities/Issue';
import { User } from '../entities/User';
import { Project } from '../entities/Project';
import { Notification } from '../entities/Notification';
import { PubSubEngine } from 'apollo-server-express';

@ObjectType()
class Error {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class IssueResponse {
	@Field(() => [Error], { nullable: true })
	errors?: Error[];

	@Field(() => Issue, { nullable: true })
	issue?: Issue;
}

interface NotificationPayload {
	notification: Notification;
	users: User[];
}

@Resolver(() => Issue)
export class IssueResolver {
	/**
	 * Retrieves all issues from the database
	 * @return (Promise<Issue[]>) issue Promise pending the array of issues
	 */
	@Query(() => [Issue])
	async issues(): Promise<Issue[]> {
		return await getRepository(Issue).find({
			join: {
				alias: 'issue',
				leftJoinAndSelect: {
					project: 'issue.project',
					createdBy: 'issue.createdBy',
					comments: 'issue.comments',
					postedBy: 'comments.postedBy',
				},
			},
		});
	}

	/**
	 * Retrieves an issue based on the id request parameter
	 * @param(id) id - number id of the issue being queried
	 * @return (Promise<Issue>) issue Promise of the issue being queried and relating information
	 */
	@Query(() => Issue)
	async issue(@Arg('id') id: number): Promise<Issue | null> {
		return (await getRepository(Issue).findOne({
			where: { id: id },
			join: {
				alias: 'issue',
				leftJoinAndSelect: {
					project: 'issue.project',
					createdBy: 'issue.createdBy',
					comments: 'issue.comments',
					postedBy: 'comments.postedBy',
				},
			},
		})) as Issue;
	}

	/**
	 *
	 * @param name - the name of the issue
	 * @param projectId - the id of the project to be added
	 * @param desc - the description of the project
	 * @param severity - the severity of the issue
	 * @return Promise<IssueResponse> - either errors or the issue to be created
	 */
	@Mutation(() => [Error], { nullable: true })
	async createIssue(
		@Arg('name') name: string,
		@Arg('projectId') projectId: number,
		@Arg('desc') desc: string,
		@Arg('severity') severity: Severity,
		@PubSub() pubsub: PubSubEngine,
		@Ctx() { req }: Context
	): Promise<Error[] | null> {
		const user = await getRepository(User).findOne({
			where: { id: req.session.userId },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					issues: 'user.issues',
					notifications: 'user.notifications',
				},
			},
		});
		if (!user) return [{ field: 'user', message: 'User is not logged in' }];

		const project = await getRepository(Project).findOne({
			where: { id: projectId },
			join: {
				alias: 'project',
				leftJoinAndSelect: {
					users: 'project.users',
					user: 'users.user',
					issues: 'project.issues',
				},
			},
		});
		if (!project)
			return [
				{
					field: 'project',
					message: 'invalid project id',
				},
			];

		const data = project.users.filter(
			(projectRole) =>
				projectRole.user === user &&
				(projectRole.user.role === Role.ADMIN ||
					projectRole.user.role === Role.EDITOR)
		);
		if (!data)
			return [
				{
					field: 'project',
					message: 'Not authorized',
				},
			];

		const connection = getConnection();
		const newIssue = new Issue();

		newIssue.name = name;
		newIssue.project = project;
		newIssue.desc = desc;
		newIssue.severity = severity;
		newIssue.status = Status.TODO;
		newIssue.comments = [];
		newIssue.createdBy = user;
		await connection.manager.save(newIssue);

		if (!user.issues) user.issues = [newIssue];
		else user.issues.push(newIssue);

		project.issues.push(newIssue);

		await connection.manager.save(user);
		await connection.manager.save(project);

		await pubsub.publish('ISSUE', newIssue);

		await pubsub.publish('NOTIFICATION', {
			notification: {
				message: `${user.name} created a new issue: ${newIssue.name}`,
				user: user,
			},
			users: project.users.map((projectRole) => {
				return projectRole.user;
			}),
		});

		return null;
	}

	@Mutation(() => IssueResponse)
	async updateIssue(
		@Arg('id') id: number,
		@Arg('name', { nullable: true }) name: string,
		@Arg('desc', { nullable: true }) desc: string,
		@Arg('status', { nullable: true }) status: Status,
		@Ctx() { req }: Context
	): Promise<IssueResponse> {
		const user = await getRepository(User).findOne({
			where: { id: req.session.userId },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					notifications: 'user.notifications',
					issues: 'user.issues',
				},
			},
		});
		if (!user)
			return {
				errors: [{ field: 'user', message: 'User is not logged in' }],
			};

		const issue = await getRepository(Issue).findOne({
			where: { id: id },
			join: {
				alias: 'issue',
				leftJoinAndSelect: {
					project: 'issue.project',
					createdBy: 'issue.createdBy',
					users: 'project.users',
					user: 'users.user',
					issues: 'project.issues',
					comments: 'issue.comments',
					postedBy: 'comments.postedBy',
				},
			},
		});
		if (!issue)
			return {
				errors: [{ field: 'issue', message: 'Issue does not exist' }],
			};

		const data = issue.project.users.filter(
			(projectRole) =>
				projectRole.user === user &&
				(projectRole.user.role === Role.ADMIN ||
					projectRole.user.role === Role.EDITOR)
		);
		if (!data)
			return {
				errors: [
					{
						field: 'issue',
						message: 'Not authorized',
					},
				],
			};

		console.log(status);

		const connection = getConnection();

		if (name) issue.name = name;
		if (desc) issue.desc = desc;
		if (status !== null) issue.status = status;

		await connection.manager.save(issue);

		console.log(issue);

		return { issue };
	}

	@Mutation(() => Boolean)
	async deleteIssues(): Promise<Boolean> {
		await getRepository(Issue).delete({});

		return true;
	}

	@Subscription(() => Notification, {
		topics: 'NOTIFICATION',
		filter: ({ payload, args }) => {
			return payload.notification.user.id !== args.subscriber;
		},
	})
	async notify(
		@Root() payload: NotificationPayload,
		@Arg('subscriber') _subscriber: number
	): Promise<Notification> {
		const newNotification = new Notification();
		const connection = getConnection();
		newNotification.message = payload.notification.message;
		newNotification.user = payload.notification.user;

		await connection.manager.save(newNotification);
		payload.notification.user.notifications.push(newNotification);
		await connection.manager.save(payload.notification.user);

		return newNotification;
	}

	@Subscription(() => Issue, {
		topics: 'ISSUE',
	})
	async sendIssue(@Root() payload: Issue): Promise<Issue> {
		return {
			...payload,
		} as Issue;
	}
}
