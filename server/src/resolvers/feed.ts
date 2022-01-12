import { Feed } from "../entities/Feed";
import { Resolver, Subscription, Root, Arg, Mutation, Ctx } from "type-graphql";
import { Context } from "../types";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entities/User";

@Resolver(() => Feed)
export class FeedResolver {
  // return the next value after the cursor
  async peek(cursor: string, userId: number): Promise<Feed | null> {
    const nextFeedItem = await getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.feed", "feed")
      .where("user.id = :id", { id: userId })
      .andWhere("feed.createdAt < :cursor", { cursor: new Date(cursor) })
      .orderBy("feed.createdAt", "DESC")
      .limit(1)
      .getOne();

    if (!nextFeedItem) return null;
    return nextFeedItem.feed[0];
  }

  @Mutation(() => Feed, { nullable: true })
  async deleteFeedItem(
    @Arg("id") id: number,
    @Ctx() { req }: Context,
    @Arg("cursor") cursor: string
  ): Promise<Feed | null> {
    const user = await getRepository(User).findOne({ id: req.session.userId });
    if (!user) return null;

    const feedItem = await getRepository(Feed).findOne({
      where: { id },
      join: {
        alias: "feed",
        leftJoinAndSelect: {
          user: "feed.user",
        },
      },
    });

    if (!feedItem) return null;

    if (feedItem.user.id !== user.id) return null;

    const connection = getConnection();
    await connection.manager.delete(Feed, feedItem);

    const nextFeedItem = await this.peek(cursor, user.id);
    return nextFeedItem;
  }

  @Subscription(() => Feed, {
    topics: "FEED",
    filter: ({ payload, args }) => args.id === payload.user.id,
  })
  sendFeed(@Root() payload: Feed, @Arg("id") _id: number): Feed {
    return payload;
  }
}
