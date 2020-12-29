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
		await connection.manager.save(newProject);

		return newProject;
	}

	@Mutation(() => Boolean)
	async deleteProjects(): Promise<Boolean> {
		await getRepository(Project).delete({});

		return true;
	}
}
