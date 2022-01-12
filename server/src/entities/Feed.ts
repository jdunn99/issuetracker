import { FeedType } from "../types";
import { ObjectType, Field, Int, registerEnumType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

registerEnumType(FeedType, { name: "FeedType" });

@ObjectType()
@Entity()
export class Feed extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  desc: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  subheading?: string;

  @Column({ type: "enum", enum: FeedType })
  @Field(() => FeedType)
  type: FeedType;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt = new Date();

  @ManyToOne(() => User, (user) => user.feed)
  @Field(() => User)
  user: User;
}
