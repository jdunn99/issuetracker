import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Field, ObjectType, Int, registerEnumType } from 'type-graphql';
import { Role, Severity, Status } from '../types';
import { Project } from './Project';
import { User } from './User';
import { Comment } from './Comment';

registerEnumType(Role, {
	name: 'Role',
	description: "The user's role",
});

registerEnumType(Severity, {
	name: 'Severity',
	description: "The issue's severity",
});

registerEnumType(Status, {
	name: 'Status',
	description: "The issue's status",
});

@ObjectType()
@Entity()
export class Issue extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column()
	@Field()
	name!: string;

	@Column()
	@Field()
	desc!: string;

	@CreateDateColumn()
	@Field(() => Date)
	createdAt = new Date();

	@Column({
		type: 'enum',
		enum: Severity,
	})
	@Field(() => Severity)
	severity!: Severity;

	@Column({
		type: 'enum',
		enum: Status,
	})
	@Field(() => Status)
	status!: Status;

	@ManyToOne(() => Project, (project) => project.issues)
	@Field(() => Project)
	project: Project;

	@ManyToOne(() => User, (user) => user.issues)
	@Field(() => User)
	createdBy: User;

	@OneToMany(() => Comment, (comments) => comments.issue, {
		cascade: true,
	})
	@Field(() => [Comment])
	comments: Comment[];
}
