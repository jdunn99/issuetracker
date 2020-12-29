import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: 'http://localhost:4000/graphql',
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
