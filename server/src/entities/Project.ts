import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
import { Issue } from "./Issue";
import { User } from "./User";
import { ProjectManagement } from "./ProjectManagement";

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => User, (user) => user.ownedProjects)
  @Field(() => User)
  owner: User;

  @OneToMany(() => ProjectManagement, (proj) => proj.project)
  @Field(() => [ProjectManagement])
  projectManagement: ProjectManagement[];

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
