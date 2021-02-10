import { ObjectType, Field, Int } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@CreateDateColumn()
	@Field(() => Date)
	createdAt = new Date();

	@Column()
	@Field()
	message: string;

	@ManyToOne(() => User, (user) => user.notifications)
	@Field(() => User)
	user: User;
}
