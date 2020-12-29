import { Resolver, Query } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Issue } from '../entities/Issue';

@Resolver(() => Issue)
export class IssueResolver {
	@Query(() => [Issue])
	async projects(): Promise<Issue[]> {
		return await getRepository(Issue).find();
	}
}
