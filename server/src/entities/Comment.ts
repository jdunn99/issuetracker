import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
import { Issue } from "./Issue";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  comment: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt = new Date();

  @ManyToOne(() => User, (user) => user.comments)
  @Field(() => User)
  postedBy: User;

  @ManyToOne(() => Issue, (issue) => issue.comments, { onDelete: "CASCADE" })
  @Field(() => Issue)
  issue: Issue;
}
