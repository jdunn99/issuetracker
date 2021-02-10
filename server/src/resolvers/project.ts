import { ProjectRole } from '../entities/ProjectRole';
import { Role } from '../types';
import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import { getConnection, getRepository } from 'typeorm';
import { Project } from '../entities/Project';
import { User } from '../entities/User';
import { Context } from '../types';

@Resolver(() => Project)
export class ProjectResolver {
	@Query(() => [Project])
	async projects(): Promise<Project[]> {
		return await getRepository(Project).find({
			join: {
				alias: 'project',
				leftJoinAndSelect: {
					users: 'project.users',
					user: 'users.user',
					issues: 'project.issues',
					createdBy: 'issues.createdBy',
					comments: 'issues.comments',
					postedBy: 'comments.postedBy',
				},
			},
		});
	}

	// TO-DO: Project visibility
	@Query(() => Project, { nullable: true })
	async project(@Arg('id') id: number): Promise<Project | null> {
		return (await getRepository(Project).findOne({
			where: { id: id },
			join: {
				alias: 'project',
				leftJoinAndSelect: {
					users: 'project.users',
					user: 'users.user',
					issues: 'project.issues',
					createdBy: 'issues.createdBy',
					comments: 'issues.comments',
					postedBy: 'comments.postedBy',
				},
			},
		})) as Project;
	}

	@Mutation(() => Project)
	async createProject(
		@Arg('name') name: string,
		@Arg('desc') desc: string,
		@Ctx() { req }: Context
	): Promise<Project> {
		const user = await getRepository(User).findOne({
			id: req.session.userId,
		});
		if (!user) throw Error();
		const connection = getConnection();

		const projectRole = new ProjectRole();
		projectRole.role = Role.ADMIN;
		projectRole.user = user;
		await connection.manager.save(projectRole);

		const newProject = new Project();
		newProject.name = name;
		newProject.desc = desc;
		newProject.users = [projectRole];
		newProject.issues = [];

		await connection.manager.save(newProject);

		return newProject;
	}

	@Mutation(() => ProjectRole)
	async addUserToProject(
		@Arg('id') id: number,
		@Arg('email') email: string,
		@Ctx() { req }: Context
	): Promise<ProjectRole> {
		const user = await getRepository(User).findOne({
			id: req.session.userId,
		});
		if (!user) throw Error();

		const addedUser = await getRepository(User).findOne({
			email: email,
		});
		if (!addedUser) throw Error();

		const project = await getRepository(Project).findOne({
			where: { id: id },
			join: {
				alias: 'project',
				leftJoinAndSelect: {
					users: 'project.users',
					user: 'users.user',
					issues: 'project.issues',
					createdBy: 'issues.createdBy',
					comments: 'issues.comments',
					postedBy: 'comments.postedBy',
				},
			},
		});

		if (!project) throw Error();

		for (let role of project.users) {
			if (role.user.id === addedUser.id) throw Error();
		}

		const connection = getConnection();
		const projectRole = new ProjectRole();
		projectRole.user = addedUser;
		projectRole.role = Role.VIEWER;
		projectRole.project = project;

		await connection.manager.save(projectRole);

		project.users.push(projectRole);

		await connection.manager.save(project);
		return projectRole;
	}

	@Mutation(() => Boolean)
	async removeUserFromProject(@Arg('id') id: number): Promise<Boolean> {
		// to remove a user from project we delete the ProjectRole
		await getRepository(ProjectRole).delete({ id: id });
		return true;
	}

	@Mutation(() => Boolean)
	async deleteProjects(): Promise<Boolean> {
		await getRepository(ProjectRole).delete({});
		await getRepository(Project).delete({});

		return true;
	}
}
