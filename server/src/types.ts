import { User } from './entities/User';
import { Request, Response } from 'express';
import session from 'express-session';

export enum Role {
	ADMIN,
	EDITOR,
	VIEWER,
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
	req: Request & { session: session.Session };
	res: Response;
}
