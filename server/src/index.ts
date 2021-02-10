import express from 'express';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { IssueResolver } from './resolvers/issue';
import { CommentResolver } from './resolvers/comment';
import { ProjectResolver } from './resolvers/project';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { createServer } from 'http';

async function main() {
	const app = express();

	app.set('trust proxy', 1);
	const corsOptions = {
		origin: 'http://10.0.0.9:3000',
		credentials: true,
		'Access-Control-Allow-Credentials': true,
	};

	app.use(cors(corsOptions));

	// ORM setup
	const connectionOptions = await getConnectionOptions();
	const orm = await createConnection(connectionOptions);
	await orm.runMigrations();

	// session & redis
	const RedisStore = connectRedis(session);
	const redis = new Redis('127.0.0.1:6379');

	app.use(
		session({
			name: 'koala',
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 315360000000, // 10 years
				secure: false,
			},
			saveUninitialized: false,
			secret: 'sdlkjfhasldkjfhasp9d8gvy',
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				UserResolver,
				IssueResolver,
				ProjectResolver,
				CommentResolver,
			],
			validate: false,
		}),
		subscriptions: {
			onConnect: (connectionParams, _) => {
				console.log(connectionParams);
			},
		},
		context: async ({ req, res, connection }) => {
			if (connection) {
				console.log(req);
				return connection.context;
			} else {
				return {
					req,
					res,
				};
			}
		},
		playground: true,
	});

	apolloServer.applyMiddleware({ app, cors: false });

	const websocketServer = createServer(app);
	apolloServer.installSubscriptionHandlers(websocketServer);

	websocketServer.listen(4000, () => console.log('Server started'));
}

main().catch((err) => console.log(err));
