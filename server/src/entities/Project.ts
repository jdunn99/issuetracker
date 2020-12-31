import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { Field, ObjectType, Int } from 'type-graphql';
import { Issue } from './Issue';
import { ProjectRole } from './ProjectRole';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@OneToMany(() => ProjectRole, (role) => role.project, { cascade: true })
	@Field(() => [ProjectRole])
	users: ProjectRole[];

	@Column()
	@Field()
	name: string;

	@Column()
	@Field()
	desc: string;

	@OneToMany(() => Issue, (issue) => issue.project, { cascade: true })
	@Field(() => [Issue])
	issues: Issue[];

	@CreateDateColumn()
	@Field(() => Date)
	createdAt = new Date();
}
