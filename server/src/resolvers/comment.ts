import {
	Arg,
	Ctx,
	Mutation,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from 'type-graphql';
import { getConnection, getRepository } from 'typeorm';
import { Comment } from '../entities/Comment';
import { Context } from '../types';
import { User } from '../entities/User';
import { Issue } from '../entities/Issue';
import { Error } from '../entities/Error';
import { PubSubEngine } from 'apollo-server-express';

@Resolver(() => Comment)
export class CommentResolver {
	@Query(() => [Comment])
	async comments(): Promise<Comment[]> {
		return await getRepository(Comment).find({
			join: {
				alias: 'comment',
				leftJoinAndSelect: {
					issues: 'comment.issue',
					postedBy: 'comment.postedBy',
				},
			},
		});
	}

	@Mutation(() => [Error], { nullable: true })
	async createComment(
		@Arg('content') content: string,
		@Arg('issueId') issueId: number,
		@PubSub() pubsub: PubSubEngine,
		@Ctx() { req }: Context
	): Promise<Error[] | null> {
		const user = await getRepository(User).findOne({
			where: { id: req.session.userId },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					comments: 'user.comments',
				},
			},
		});

		if (!user)
			return [
				{
					field: 'content',
					message: 'Not logged in',
				},
			];

		const issue = await getRepository(Issue).findOne({
			where: { id: issueId },
			join: {
				alias: 'issue',
				leftJoinAndSelect: {
					comments: 'issue.comments',
				},
			},
		});
		if (!issue)
			return [
				{
					field: 'content',
					message: 'Issue does not exist',
				},
			];

		const connection = getConnection();
		const newComment = new Comment();

		if (content.length === 0)
			return [
				{
					field: 'content',
					message: 'Invalid comment. Comment should not be empty',
				},
			];

		newComment.comment = content;
		newComment.issue = issue;
		newComment.postedBy = user;
		await connection.manager.save(newComment);

		user.comments.push(newComment);
		issue.comments.push(newComment);

		await connection.manager.save(user);
		await connection.manager.save(issue);

		await pubsub.publish('COMMENT', newComment);

		return null;
	}

	@Mutation(() => Boolean)
	async deleteComment(@Arg('id') id: number): Promise<Boolean> {
		await getRepository(Comment).delete({ id: id });

		return true;
	}

	@Mutation(() => Boolean)
	async deleteComments(): Promise<Boolean> {
		await getRepository(Comment).delete({});

		return true;
	}

	@Subscription(() => Comment, {
		topics: 'COMMENT',
	})
	async sendComment(@Root() payload: Comment): Promise<Comment> {
		console.log(payload, 'firing?');
		return {
			...payload,
		} as Comment;
	}
}
