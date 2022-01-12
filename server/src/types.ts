import { User } from "./entities/User";
import { Request, Response } from "express";
import session from "express-session";

export enum Role {
  ADMIN,
  EDITOR,
  VIEWER,
  OWNER,
}

export enum Severity {
  LOW,
  MEDIUM,
  HIGH,
  VERYHIGH,
}

export enum Status {
  TODO,
  PROGRESS,
  REVIEW,
  RESOLVED,
}

export enum Visibility {
  PRIVATE,
  PUBLIC,
}

export interface Context {
  User: User;
  req: Request & { session: session.Session & { userId: any } };
  res: Response;
}

export enum FeedType {
  Comment,
  New,
  Invite,
  Role,
  Update,
}

export const mapRole = (temp: number) => {
  switch (temp) {
    case 0:
      return Role.ADMIN;
    case 1:
      return Role.EDITOR;
    case 2:
      return Role.VIEWER;
    case 3:
      return Role.OWNER;
    default:
      return Role.VIEWER;
  }
};
