import { Severity, Status, Context, Role } from '../types';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { getRepository, getConnection } from 'typeorm';
import { Issue } from '../entities/Issue';
import { User } from '../entities/User';
import { Project } from '../entities/Project';

@Resolver(() => Issue)
export class IssueResolver {
	@Query(() => [Issue])
	async issues(): Promise<Issue[]> {
		return await getRepository(Issue).find({
			join: {
				alias: 'issue',
				leftJoinAndSelect: {
					project: 'issue.project',
					createdBy: 'issue.createdBy',
				},
			},
		});
	}

	// TO-DO: Create Issue Response Class
	@Mutation(() => Issue, { nullable: true })
	async createIssue(
		@Arg('name') name: string,
		@Arg('projectId') projectId: number,
		@Arg('desc') desc: string,
		@Arg('severity') severity: Severity,
		@Ctx() { req }: Context
	): Promise<Issue | null> {
		const user = await getRepository(User).findOne({
			where: { id: req.session.userId },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					issues: 'user.issues',
				},
			},
		});
		if (!user) return null;

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
		if (!project) return null;

		console.log(project.users);

		const data = project.users.filter(
			(projectRole) =>
				projectRole.user === user &&
				(projectRole.user.role === Role.ADMIN ||
					projectRole.user.role === Role.EDITOR)
		);
		if (!data) return null;

		const connection = getConnection();
		const newIssue = new Issue();
		newIssue.name = name;
		newIssue.project = project;
		newIssue.desc = desc;
		newIssue.severity = severity;
		newIssue.status = Status.TODO;
		newIssue.createdBy = user;
		await connection.manager.save(newIssue);

		if (!user.issues) user.issues = [newIssue];
		else user.issues.push(newIssue);

		project.issues.push(newIssue);

		await connection.manager.save(user);
		await connection.manager.save(project);

		return newIssue;
	}

	@Mutation(() => Boolean)
	async deleteIssues(): Promise<Boolean> {
		await getRepository(Issue).delete({});

		return true;
	}
}
