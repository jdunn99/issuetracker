import { ApolloQueryResult } from '@apollo/client';
import { ProjectQuery, Exact, UserQuery } from '../generated/graphql';

export interface ProjectProps {
	data: ProjectQuery;
	refetch: (
		variables?:
			| Partial<
					Exact<{
						id: number;
					}>
			  >
			| undefined
	) => Promise<ApolloQueryResult<ProjectQuery>>;
	dataUser?: UserQuery;
	id?: number;
}

export interface ProfileProps {
	data: UserQuery | undefined;
}
