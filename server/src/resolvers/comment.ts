import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection, getRepository } from 'typeorm';
import { Comment } from '../entities/Comment';
import { Context } from '../types';
import { User } from '../entities/User';
import { Issue } from '../entities/Issue';

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

	// TODO: Comment Response Error Checking
	@Mutation(() => Comment, { nullable: true })
	async createComment(
		@Arg('content') content: string,
		@Arg('issueId') issueId: number,
		@Ctx() { req }: Context
	): Promise<Comment | null> {
		const user = await getRepository(User).findOne({
			where: { id: req.session.userId },
			join: {
				alias: 'user',
				leftJoinAndSelect: {
					comments: 'user.comments',
				},
			},
		});

		if (!user) return null;
		const issue = await getRepository(Issue).findOne({
			where: { id: issueId },
			join: {
				alias: 'issue',
				leftJoinAndSelect: {
					comments: 'issue.comments',
				},
			},
		});
		if (!issue) return null;

		const connection = getConnection();
		const newComment = new Comment();
		newComment.comment = content;
		newComment.issue = issue;
		newComment.postedBy = user;
		await connection.manager.save(newComment);

		user.comments.push(newComment);
		issue.comments.push(newComment);

		await connection.manager.save(user);
		await connection.manager.save(issue);

		return newComment;
	}
}
