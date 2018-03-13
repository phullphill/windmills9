import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStoreAndMiddleware } from 'common';
import { Game } from 'ui';

const store = createStoreAndMiddleware(process.env);
const containerElement = document.getElementById('windmills-app');

ReactDOM.render(
	<Provider store={store}>
		<Game />
	</Provider>,
	containerElement
);
