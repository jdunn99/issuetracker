import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Field, ObjectType, Int, registerEnumType } from "type-graphql";
import { Role } from "../types";
import { Issue } from "./Issue";
import { Comment } from "./Comment";
import { Notification } from "./Notification";
import { Project } from "./Project";
import { ProjectManagement } from "./ProjectManagement";
import { Feed } from "./Feed";

registerEnumType(Role, {
  name: "Role",
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

  @Column()
  password!: string;

  @OneToMany(() => ProjectManagement, (proj) => proj.user, { cascade: true })
  @Field(() => [ProjectManagement])
  projectManagement: ProjectManagement[];

  @OneToMany(() => Project, (project) => project.owner, { cascade: true })
  @Field(() => [Project])
  ownedProjects: Project[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt = new Date();

  @ManyToMany(() => Issue, { cascade: true })
  @JoinTable()
  @Field(() => [Issue])
  issues: Issue[];

  @OneToMany(() => Issue, (issue) => issue.owner)
  @Field(() => [Issue])
  ownedIssues: Issue[];

  @OneToMany(() => Comment, (comment) => comment.postedBy, {
    cascade: true,
  })
  @Field(() => [Comment])
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  @Field(() => [Notification])
  notifications: Notification[];

  @OneToMany(() => Feed, (feed) => feed.user, { cascade: true })
  @Field(() => [Feed])
  feed: Feed[];
}
