import { Role } from '../types';
import { ObjectType, Field, registerEnumType, Int } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

registerEnumType(Role, {
	name: 'Role',
	description: "The user's role",
});

@ObjectType()
@Entity()
export class ProjectRole extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@ManyToOne(() => Project, (proj) => proj.users)
	@Field(() => Project)
	project: Project;

	@ManyToOne(() => User, (user) => user.projects)
	@Field(() => User)
	user: User;

	@Column({
		type: 'enum',
		enum: Role,
	})
	@Field(() => Role)
	role: Role;
}
