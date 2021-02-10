import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import {
	ApolloProvider,
	ApolloClient,
	InMemoryCache,
	split,
	HttpLink,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new WebSocketLink({
	uri: `ws://10.0.0.9:4000/graphql`,
	options: {
		reconnect: true,
	},
});

const httpLink = new HttpLink({
	uri: 'http://10.0.0.9:4000/graphql',
	credentials: 'include',
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
	credentials: 'include',
});

ReactDOM.render(
	<ChakraProvider>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</ChakraProvider>,
	document.getElementById('root')
);
