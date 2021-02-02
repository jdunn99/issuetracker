import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { Field, ObjectType, Int, registerEnumType } from 'type-graphql';
import { Role } from '../types';
import { Issue } from './Issue';
import { ProjectRole } from './ProjectRole';
import { Comment } from './Comment';

registerEnumType(Role, {
	name: 'Role',
	description: "The user's role",
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ unique: true })
	@Field()
	email!: string;

	@Column()
	@Field()
	name!: string;

	// not a field because we don't want to access the hashed password
	@Column()
	password!: string;

	@Column({ nullable: true })
	@Field({ nullable: true })
	organization?: string;

	@Column({
		type: 'enum',
		enum: Role,
	})
	@Field(() => Role)
	role!: Role;

	@CreateDateColumn()
	@Field(() => Date)
	createdAt = new Date();

	@OneToMany(() => Issue, (issue) => issue.createdBy, {
		cascade: true,
	})
	@Field(() => [Issue], { defaultValue: [] })
	issues: Issue[];

	@OneToMany(() => ProjectRole, (proj) => proj.user, {
		cascade: true,
	})
	@Field(() => [ProjectRole])
	projects: ProjectRole[];

	@OneToMany(() => Comment, (comment) => comment.postedBy, {
		cascade: true,
	})
	@Field(() => [Comment])
	comments: Comment[];
}
