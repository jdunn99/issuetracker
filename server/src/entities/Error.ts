import { ObjectType, Field } from 'type-graphql';

@ObjectType('error')
export class Error {
	@Field()
	field: string;

	@Field()
	message: string;
}
