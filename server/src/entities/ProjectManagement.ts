import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType, Int, registerEnumType } from "type-graphql";
import { User } from "./User";
import { Project } from "./Project";
import { Role } from "../types";
registerEnumType(Role, {
  name: "Role",
  description: "The user's role",
});
@ObjectType()
@Entity()
export class ProjectManagement extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => Project, (project) => project.projectManagement, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @Field(() => Project)
  project: Project;

  @ManyToOne(() => User, (user) => user.projectManagement)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt = new Date();

  @Column({ type: "enum", enum: Role, default: Role.VIEWER })
  @Field(() => Role)
  role: Role;
}
